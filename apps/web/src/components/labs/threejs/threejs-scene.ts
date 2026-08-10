import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Fog,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  getQualityPreset,
  type QualityPresetId,
  type SignalId,
  type SpatialMode,
} from "./threejs-model";

export type ThreeTelemetry = {
  fps: number;
  frameMs: number;
  dpr: number;
  drawCalls: number;
  geometries: number;
  triangles: number;
  points: number;
};

type SpatialSceneOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  quality: QualityPresetId;
  mode: SpatialMode;
  selectedSignal: SignalId;
  motionEnabled: boolean;
  autoOrbit: boolean;
  onTelemetry: (telemetry: ThreeTelemetry) => void;
  onSelect: (signal: SignalId) => void;
};

type SignalMesh = Mesh<SphereGeometry, MeshStandardMaterial> & {
  userData: { signalId: SignalId };
};

const signalOrder: SignalId[] = ["core", "growth", "retention"];

const modeNodePositions: Record<
  SpatialMode,
  Array<[number, number, number]>
> = {
  constellation: [
    [-2.5, 0.55, 0.4],
    [1.8, 1.45, -1.2],
    [2.25, -1.25, 0.65],
  ],
  layers: [
    [-2.55, -1.15, 1.1],
    [0, 0.1, 0],
    [2.55, 1.25, -1.15],
  ],
  route: [
    [-2.55, 0.7, 0.7],
    [0, -0.5, -0.1],
    [2.55, 0.8, -0.8],
  ],
};

function deterministic(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function cssVariableColor(
  variable: string,
  fallback: [number, number, number],
) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  if (!context || !value) {
    return new Color().setRGB(...fallback, SRGBColorSpace);
  }
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(red / 255, green / 255, blue / 255, SRGBColorSpace);
}

function createPointTargets(count: number, mode: SpatialMode) {
  const targets = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const phase = deterministic(index, 1) * Math.PI * 2;
    const variance = deterministic(index, 2);
    if (mode === "constellation") {
      const radius = 1.65 + variance * 2.4;
      const polar = Math.acos(2 * deterministic(index, 3) - 1);
      targets[offset] = radius * Math.sin(polar) * Math.cos(phase);
      targets[offset + 1] = radius * Math.cos(polar) * 0.72;
      targets[offset + 2] = radius * Math.sin(polar) * Math.sin(phase);
    } else if (mode === "layers") {
      const layer = (index % 5) - 2;
      const radius = 0.6 + variance * 3.2;
      targets[offset] = Math.cos(phase) * radius;
      targets[offset + 1] =
        layer * 0.62 + (deterministic(index, 4) - 0.5) * 0.2;
      targets[offset + 2] = Math.sin(phase) * radius;
    } else {
      const progress = index / Math.max(1, count - 1);
      const turns = progress * Math.PI * 6;
      const radius = 0.7 + variance * 0.55;
      targets[offset] = (progress - 0.5) * 7;
      targets[offset + 1] = Math.sin(turns) * radius;
      targets[offset + 2] = Math.cos(turns) * radius;
    }
  }
  return targets;
}

export class SpatialSignalScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(42, 1, 0.1, 80);
  private readonly controls: OrbitControls;
  private readonly root = new Group();
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly signalMeshes: SignalMesh[] = [];
  private readonly onTelemetry: SpatialSceneOptions["onTelemetry"];
  private readonly onSelect: SpatialSceneOptions["onSelect"];
  private readonly resizeObserver: ResizeObserver;
  private pointsObject: Points<BufferGeometry, PointsMaterial> | null = null;
  private pointTargets = new Float32Array();
  private quality: QualityPresetId;
  private mode: SpatialMode;
  private selectedSignal: SignalId;
  private motionEnabled: boolean;
  private autoOrbit: boolean;
  private frameCount = 0;
  private sampleStarted = performance.now();
  private lastFrame = this.sampleStarted;
  private disposed = false;

  constructor(options: SpatialSceneOptions) {
    this.quality = options.quality;
    this.mode = options.mode;
    this.selectedSignal = options.selectedSignal;
    this.motionEnabled = options.motionEnabled;
    this.autoOrbit = options.autoOrbit;
    this.onTelemetry = options.onTelemetry;
    this.onSelect = options.onSelect;

    this.renderer = new WebGLRenderer({
      canvas: options.canvas,
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    const background = cssVariableColor("--background", [0.04, 0.05, 0.08]);
    const primary = cssVariableColor("--primary", [0.17, 0.49, 1]);
    const chartTwo = cssVariableColor("--chart-2", [0.18, 0.78, 0.66]);
    const chartThree = cssVariableColor("--chart-3", [0.62, 0.42, 0.94]);
    const border = cssVariableColor("--border", [0.28, 0.3, 0.36]);
    const foreground = cssVariableColor("--foreground", [0.9, 0.92, 0.96]);
    this.renderer.setClearColor(background, 1);
    this.scene.background = background;
    this.scene.fog = new Fog(background, 8, 18);
    this.scene.add(this.root);

    this.camera.position.set(0, 1.35, 9.2);
    this.controls = new OrbitControls(this.camera, options.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.minDistance = 5.2;
    this.controls.maxDistance = 13;
    this.controls.autoRotateSpeed = 0.55;
    this.controls.addEventListener("change", this.renderStaticFrame);

    this.scene.add(new AmbientLight(foreground, 0.72));
    const keyLight = new DirectionalLight(primary, 6.2);
    keyLight.position.set(4, 6, 5);
    this.scene.add(keyLight);
    const fillLight = new DirectionalLight(chartTwo, 3.4);
    fillLight.position.set(-5, -2, 3);
    this.scene.add(fillLight);

    const coreGeometry = new IcosahedronGeometry(0.85, 2);
    const coreMaterial = new MeshStandardMaterial({
      color: background.clone().lerp(primary, 0.28),
      emissive: primary,
      emissiveIntensity: 0.42,
      metalness: 0.48,
      roughness: 0.32,
      wireframe: true,
    });
    const core = new Mesh(coreGeometry, coreMaterial);
    core.name = "Signal Atlas core";
    this.root.add(core);

    const ringColors = [primary, chartTwo, chartThree];
    ringColors.forEach((color, index) => {
      const geometry = new TorusGeometry(1.35 + index * 0.54, 0.012, 8, 96);
      const material = new MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.55,
      });
      const ring = new Mesh(geometry, material);
      ring.rotation.set(Math.PI / (2.8 + index), index * 0.48, index * 0.62);
      this.root.add(ring);
    });

    const signalGeometry = new SphereGeometry(0.25, 24, 16);
    signalOrder.forEach((signalId, index) => {
      const material = new MeshStandardMaterial({
        color: ringColors[index],
        emissive: ringColors[index],
        emissiveIntensity: 0.45,
        metalness: 0.35,
        roughness: 0.3,
      });
      const mesh = new Mesh(signalGeometry, material) as SignalMesh;
      mesh.userData = { signalId };
      mesh.position.fromArray(modeNodePositions[this.mode][index]);
      this.signalMeshes.push(mesh);
      this.root.add(mesh);
    });

    const path = new CatmullRomCurve3([
      new Vector3(-3.5, -1.2, 0.8),
      new Vector3(-1.4, 1.1, -0.7),
      new Vector3(0.5, -0.65, 0.3),
      new Vector3(2.1, 1.2, -0.9),
      new Vector3(3.5, -0.2, 0.35),
    ]);
    const pathGeometry = new TubeGeometry(path, 96, 0.018, 6, false);
    const pathMaterial = new MeshStandardMaterial({
      color: foreground,
      emissive: primary,
      emissiveIntensity: 0.65,
      side: DoubleSide,
      transparent: true,
      opacity: 0.42,
    });
    this.root.add(new Mesh(pathGeometry, pathMaterial));

    const axisGeometry = new BufferGeometry().setFromPoints([
      new Vector3(-4.5, 0, 0),
      new Vector3(4.5, 0, 0),
    ]);
    const axisMaterial = new LineBasicMaterial({
      color: border,
      transparent: true,
      opacity: 0.32,
    });
    this.root.add(new Line(axisGeometry, axisMaterial));

    this.rebuildPoints();
    this.updateSignalSelection();
    this.resizeObserver = new ResizeObserver(() =>
      this.resize(options.container),
    );
    this.resizeObserver.observe(options.container);
    this.resize(options.container);
    this.syncAnimationLoop();
  }

  private readonly renderStaticFrame = () => {
    if (!this.motionEnabled && !this.disposed) {
      this.renderer.render(this.scene, this.camera);
      this.publishTelemetry(0, 0);
    }
  };

  private publishTelemetry(fps: number, frameMs: number) {
    this.onTelemetry({
      fps,
      frameMs,
      dpr: Number(this.renderer.getPixelRatio().toFixed(1)),
      drawCalls: this.renderer.info.render.calls,
      geometries: this.renderer.info.memory.geometries,
      triangles: this.renderer.info.render.triangles,
      points: this.renderer.info.render.points,
    });
  }

  private rebuildPoints() {
    if (this.pointsObject) {
      this.root.remove(this.pointsObject);
      this.pointsObject.geometry.dispose();
      this.pointsObject.material.dispose();
    }
    const preset = getQualityPreset(this.quality);
    this.pointTargets = createPointTargets(preset.points, this.mode);
    const positions = this.pointTargets.slice();
    const geometry = new BufferGeometry();
    const positionAttribute = new BufferAttribute(positions, 3);
    positionAttribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    const material = new PointsMaterial({
      color: cssVariableColor("--primary", [0.17, 0.49, 1]),
      size: this.quality === "stress" ? 0.026 : 0.035,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    });
    this.pointsObject = new Points(geometry, material);
    this.root.add(this.pointsObject);
    this.applyPixelRatio();
  }

  private applyPixelRatio() {
    const preset = getQualityPreset(this.quality);
    const dpr = Math.min(window.devicePixelRatio || 1, preset.dprCap);
    this.renderer.setPixelRatio(dpr);
  }

  private resize(container: HTMLElement) {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (!this.motionEnabled) this.renderer.render(this.scene, this.camera);
  }

  private readonly renderFrame = (now: number) => {
    const deltaMs = Math.min(64, now - this.lastFrame);
    this.lastFrame = now;
    this.frameCount += 1;

    this.controls.autoRotate = this.autoOrbit;
    this.controls.update(deltaMs / 1000);
    this.root.rotation.y += deltaMs * 0.000035;
    const core = this.root.children[0];
    core.rotation.x += deltaMs * 0.00011;
    core.rotation.y += deltaMs * 0.00016;

    if (this.pointsObject) {
      const attribute = this.pointsObject.geometry.getAttribute(
        "position",
      ) as BufferAttribute;
      const positions = attribute.array as Float32Array;
      let changed = false;
      for (let index = 0; index < positions.length; index += 1) {
        const next = MathUtils.lerp(
          positions[index],
          this.pointTargets[index],
          0.045,
        );
        if (Math.abs(next - positions[index]) > 0.0001) changed = true;
        positions[index] = next;
      }
      attribute.needsUpdate = changed;
      this.pointsObject.rotation.y -= deltaMs * 0.000025;
    }

    this.signalMeshes.forEach((mesh, index) => {
      const target = modeNodePositions[this.mode][index];
      mesh.position.set(
        MathUtils.lerp(mesh.position.x, target[0], 0.055),
        MathUtils.lerp(mesh.position.y, target[1], 0.055),
        MathUtils.lerp(mesh.position.z, target[2], 0.055),
      );
      const selected = mesh.userData.signalId === this.selectedSignal;
      const pulse = selected ? 1.14 + Math.sin(now * 0.004) * 0.08 : 1;
      const scale = MathUtils.lerp(mesh.scale.x, pulse, 0.16);
      mesh.scale.setScalar(scale);
    });

    this.renderer.render(this.scene, this.camera);
    if (now - this.sampleStarted >= 500) {
      const elapsed = now - this.sampleStarted;
      this.publishTelemetry(
        Math.round((this.frameCount * 1000) / elapsed),
        Number((elapsed / this.frameCount).toFixed(1)),
      );
      this.sampleStarted = now;
      this.frameCount = 0;
    }
  };

  private syncAnimationLoop() {
    this.controls.enableDamping = this.motionEnabled;
    this.controls.autoRotate = this.motionEnabled && this.autoOrbit;
    this.lastFrame = performance.now();
    this.sampleStarted = this.lastFrame;
    this.frameCount = 0;
    this.renderer.setAnimationLoop(
      this.motionEnabled ? this.renderFrame : null,
    );
    if (!this.motionEnabled) {
      this.snapToTargets();
      this.renderer.render(this.scene, this.camera);
      this.publishTelemetry(0, 0);
    }
  }

  private snapToTargets() {
    if (this.pointsObject) {
      const attribute = this.pointsObject.geometry.getAttribute(
        "position",
      ) as BufferAttribute;
      (attribute.array as Float32Array).set(this.pointTargets);
      attribute.needsUpdate = true;
    }
    this.signalMeshes.forEach((mesh, index) => {
      mesh.position.fromArray(modeNodePositions[this.mode][index]);
      const scale = mesh.userData.signalId === this.selectedSignal ? 1.18 : 1;
      mesh.scale.setScalar(scale);
    });
  }

  private updateSignalSelection() {
    this.signalMeshes.forEach((mesh) => {
      mesh.material.emissiveIntensity =
        mesh.userData.signalId === this.selectedSignal ? 1.35 : 0.45;
    });
  }

  setQuality(quality: QualityPresetId) {
    if (quality === this.quality) return;
    this.quality = quality;
    this.rebuildPoints();
    this.renderStaticFrame();
  }

  setMode(mode: SpatialMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this.pointTargets = createPointTargets(
      getQualityPreset(this.quality).points,
      mode,
    );
    if (!this.motionEnabled) this.snapToTargets();
    this.renderStaticFrame();
  }

  selectSignal(signal: SignalId) {
    this.selectedSignal = signal;
    this.updateSignalSelection();
    if (!this.motionEnabled) this.snapToTargets();
    this.renderStaticFrame();
  }

  setMotionEnabled(enabled: boolean) {
    if (enabled === this.motionEnabled) return;
    this.motionEnabled = enabled;
    this.syncAnimationLoop();
  }

  setAutoOrbit(enabled: boolean) {
    this.autoOrbit = enabled;
    this.controls.autoRotate = enabled && this.motionEnabled;
    this.renderStaticFrame();
  }

  resetCamera() {
    this.camera.position.set(0, 1.35, 9.2);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.renderStaticFrame();
  }

  pick(clientX: number, clientY: number, rect: DOMRect) {
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.signalMeshes, false)[0];
    const signalId = hit?.object.userData.signalId as SignalId | undefined;
    if (signalId) this.onSelect(signalId);
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.controls.removeEventListener("change", this.renderStaticFrame);
    this.controls.dispose();

    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    this.scene.traverse((object) => {
      if ("geometry" in object && object.geometry instanceof BufferGeometry) {
        geometries.add(object.geometry);
      }
      if ("material" in object) {
        const material = object.material;
        if (Array.isArray(material)) {
          for (const item of material) {
            if (item instanceof Material) materials.add(item);
          }
        } else if (material) {
          if (material instanceof Material) materials.add(material);
        }
      }
    });
    geometries.forEach((geometry) => {
      geometry.dispose();
    });
    materials.forEach((material) => {
      material.dispose();
    });
    this.renderer.dispose();
  }
}
