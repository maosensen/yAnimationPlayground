import { loadFont } from "@remotion/google-fonts/Inter";
import { signalAtlasReference } from "@yanimation/animation-pipeline/reference";
import {
  duration,
  easing,
  millisecondsToFrames,
} from "@yanimation/motion-tokens";
import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SignalAtlasProps = {
  projectLabel: string;
  rendererLabel: string;
};

const { storyboard, provenanceManifest, qaReport } = signalAtlasReference;
type SignalAtlasScene = (typeof storyboard.scenes)[number];

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const palette = {
  background: "#07101f",
  surface: "#0d1930",
  surfaceStrong: "#132445",
  foreground: "#f7f9fc",
  muted: "#8fa3c3",
  primary: "#2b7eff",
  cyan: "#47d7ff",
  success: "#58e6a9",
  line: "#25436d",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const frameEase = Easing.bezier(...easing.enter);

const sceneOpacity = (frame: number, frames: number, fps: number) => {
  const fade = Math.min(
    millisecondsToFrames(duration.narrative, fps),
    frames / 4,
  );
  return Math.min(
    interpolate(frame, [0, fade], [0, 1], clamp),
    interpolate(frame, [frames - fade, frames], [1, 0], clamp),
  );
};

const SeededSignalField = ({ frame }: { frame: number }) => {
  const settle = interpolate(frame, [0, 72], [0, 1], {
    ...clamp,
    easing: frameEase,
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: 36,
        background: `linear-gradient(145deg, ${palette.surfaceStrong}, ${palette.surface})`,
        border: `1px solid ${palette.line}`,
      }}
    >
      {[0.28, 0.5, 0.72].map((lane) => (
        <div
          key={lane}
          style={{
            position: "absolute",
            left: "9%",
            right: "9%",
            top: `${lane * 100}%`,
            height: 2,
            opacity: 0.25 + settle * 0.45,
            background: `linear-gradient(90deg, transparent, ${palette.primary}, ${palette.cyan}, transparent)`,
          }}
        />
      ))}
      {Array.from({ length: 24 }, (_, index) => {
        const lane = [0.28, 0.5, 0.72][index % 3];
        const originX = 8 + ((index * 37 + 11) % 84);
        const originY = 10 + ((index * 53 + 17) % 80);
        const targetX = 12 + ((index * 29) % 76);
        const x = originX + (targetX - originX) * settle;
        const y = originY + (lane * 100 - originY) * settle;
        const size = index % 7 === 0 ? 18 : 10;
        return (
          <div
            key={`signal-${index + 1}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: "50%",
              background: index % 5 === 0 ? palette.success : palette.cyan,
              boxShadow: `0 0 ${12 + settle * 22}px ${palette.primary}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 34,
          bottom: 28,
          color: palette.muted,
          fontSize: 16,
          letterSpacing: "0.14em",
        }}
      >
        SEED {provenanceManifest.seed} / 24 EVENTS
      </div>
    </div>
  );
};

const AtlasGrid = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const stages = ["BRIEF", "STORYBOARD", "ASSETS", "SCAFFOLD", "QA"];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: portrait ? "1fr" : "repeat(5, 1fr)",
        gap: portrait ? 16 : 14,
        width: "100%",
      }}
    >
      {stages.map((stage, index) => {
        const reveal = interpolate(
          frame,
          [index * 10, index * 10 + 24],
          [0, 1],
          { ...clamp, easing: frameEase },
        );
        return (
          <div
            key={stage}
            style={{
              minHeight: portrait ? 112 : 230,
              padding: portrait ? "22px 26px" : "28px 22px",
              borderRadius: 26,
              background: palette.surface,
              border: `1px solid ${index === 4 ? palette.success : palette.line}`,
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 22}px)`,
              display: "flex",
              flexDirection: portrait ? "row" : "column",
              alignItems: portrait ? "center" : "stretch",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <span style={{ color: palette.muted, fontSize: 16 }}>
              0{index + 1}
            </span>
            <span
              style={{
                color: index === 4 ? palette.success : palette.foreground,
                fontSize: portrait ? 24 : 20,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {stage}
            </span>
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: index === 4 ? palette.success : palette.primary,
                boxShadow: `0 0 20px ${index === 4 ? palette.success : palette.primary}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const ReviewStack = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const artifacts = ["STORYBOARD.JSON", "ASSET-MANIFEST.JSON", "SCAFFOLD.JSON"];
  const reveal = interpolate(frame, [8, 56], [0, 1], {
    ...clamp,
    easing: frameEase,
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: portrait ? "1fr" : "1.25fr 0.75fr",
        gap: 24,
        width: "100%",
      }}
    >
      <div style={{ position: "relative", minHeight: portrait ? 400 : 360 }}>
        {artifacts.map((artifact, index) => (
          <div
            key={artifact}
            style={{
              position: "absolute",
              inset: `${index * (portrait ? 70 : 52)}px ${index * 18}px auto ${index * 18}px`,
              height: portrait ? 220 : 210,
              padding: 28,
              borderRadius: 28,
              background: index === 2 ? palette.surfaceStrong : palette.surface,
              border: `1px solid ${palette.line}`,
              transform: `translateY(${(1 - reveal) * (44 + index * 12)}px)`,
              opacity: reveal,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: palette.muted, fontSize: 15 }}>
              ARTIFACT / 0{index + 1}
            </span>
            <span
              style={{
                color: palette.foreground,
                fontSize: 23,
                fontWeight: 700,
              }}
            >
              {artifact}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          minHeight: 300,
          padding: 30,
          borderRadius: 30,
          background: `${palette.success}12`,
          border: `1px solid ${palette.success}`,
          opacity: reveal,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: palette.success,
            fontSize: 17,
            letterSpacing: "0.12em",
          }}
        >
          QA / {qaReport.status.toUpperCase()}
        </span>
        <div>
          <div
            style={{
              color: palette.foreground,
              fontSize: 64,
              fontWeight: 800,
            }}
          >
            {qaReport.summary.pass}/{qaReport.checks.length}
          </div>
          <div style={{ color: palette.muted, fontSize: 18 }}>
            EXECUTABLE CHECKS
          </div>
        </div>
        <span
          style={{
            color: palette.muted,
            fontSize: 15,
            wordBreak: "break-all",
          }}
        >
          {provenanceManifest.bundleHash.slice(0, 20)}
        </span>
      </div>
    </div>
  );
};

const SceneVisual = ({
  scene,
  frame,
  portrait,
}: {
  scene: SignalAtlasScene;
  frame: number;
  portrait: boolean;
}) => {
  if (scene.visual.kind === "signal-field") {
    return <SeededSignalField frame={frame} />;
  }
  if (scene.visual.kind === "atlas-grid") {
    return <AtlasGrid frame={frame} portrait={portrait} />;
  }
  return <ReviewStack frame={frame} portrait={portrait} />;
};

const StoryScene = ({ scene }: { scene: SignalAtlasScene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const frames = Math.round(scene.duration * fps);
  const opacity = sceneOpacity(frame, frames, fps);
  const copyIn = interpolate(frame, [0, 26], [0, 1], {
    ...clamp,
    easing: frameEase,
  });

  const copyStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: portrait ? "100%" : 610,
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        padding: portrait ? "180px 72px 150px" : "150px 96px 120px",
        display: "grid",
        gridTemplateColumns: portrait ? "1fr" : "0.8fr 1.2fr",
        gridTemplateRows: portrait ? "auto 1fr" : "1fr",
        gap: portrait ? 72 : 90,
      }}
    >
      <div
        style={{
          ...copyStyle,
          opacity: copyIn,
          transform: `translateY(${(1 - copyIn) * 28}px)`,
        }}
      >
        <span
          style={{
            color: palette.cyan,
            fontSize: portrait ? 20 : 18,
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          {scene.copy.eyebrow}
        </span>
        <h1
          style={{
            margin: "28px 0 24px",
            color: palette.foreground,
            fontSize: portrait ? 74 : 78,
            lineHeight: 0.98,
            letterSpacing: "-0.045em",
          }}
        >
          {scene.copy.title}
        </h1>
        <p
          style={{
            margin: 0,
            color: palette.muted,
            fontSize: portrait ? 28 : 25,
            lineHeight: 1.45,
          }}
        >
          {scene.copy.body}
        </p>
      </div>
      <div
        style={{
          minHeight: portrait ? 620 : 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <SceneVisual scene={scene} frame={frame} portrait={portrait} />
      </div>
    </AbsoluteFill>
  );
};

export const SignalAtlas = ({
  projectLabel,
  rendererLabel,
}: SignalAtlasProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(
    frame,
    [0, durationInFrames - 1],
    [0, 100],
    clamp,
  );

  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 82% 18%, ${palette.primary}26, transparent 34%), radial-gradient(circle at 12% 88%, ${palette.cyan}12, transparent 30%)`,
        }}
      />
      {storyboard.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.start * storyboard.fps)}
          durationInFrames={Math.round(scene.duration * storyboard.fps)}
          premountFor={storyboard.fps}
        >
          <StoryScene scene={scene} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 72,
          right: 72,
          display: "flex",
          justifyContent: "space-between",
          color: palette.muted,
          fontSize: 16,
          letterSpacing: "0.12em",
        }}
      >
        <span>{projectLabel}</span>
        <span>{rendererLabel}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 54,
          height: 3,
          background: palette.line,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: palette.primary,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
