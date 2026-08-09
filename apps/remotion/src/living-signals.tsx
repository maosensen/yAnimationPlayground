import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  duration,
  easing,
  millisecondsToFrames,
} from "@yanimation/motion-tokens";
import story from "@yanimation/video-contract/product-story.json";
import contract from "@yanimation/video-contract/production-contract.json";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type LivingSignalsProps = {
  projectLabel: string;
  rendererLabel: string;
};

type StoryScene = (typeof story.scenes)[number];

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fadeForFrame = (frame: number, durationInFrames: number, fps: number) => {
  const fadeFrames = Math.min(
    millisecondsToFrames(duration.narrative, fps),
    Math.floor(durationInFrames / 4),
  );
  return Math.min(
    interpolate(frame, [0, fadeFrames], [0, 1], clamp),
    interpolate(
      frame,
      [durationInFrames - fadeFrames, durationInFrames],
      [1, 0],
      clamp,
    ),
  );
};

const SignalOrbit = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const size = portrait ? 600 : 480;
  const center = size / 2;
  const rotation = frame * 0.45;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0.32, 0.56, 0.82].map((ratio, index) => (
        <div
          key={ratio}
          style={{
            position: "absolute",
            inset: `${(1 - ratio) * 50}%`,
            border: `2px solid ${contract.palette.primary}${index === 2 ? "66" : "3d"}`,
            borderRadius: "50%",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: center - 58,
          top: center - 58,
          width: 116,
          height: 116,
          borderRadius: "50%",
          background: contract.palette.primary,
          boxShadow: `0 0 90px ${contract.palette.primary}99`,
          transform: `scale(${0.9 + Math.sin(frame / 12) * 0.08})`,
        }}
      />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2 + (rotation * Math.PI) / 180;
        const radius = size * (index % 2 === 0 ? 0.42 : 0.29);
        const dotSize = index % 3 === 0 ? 20 : 12;
        return (
          <div
            key={`orbit-dot-${index + 1}`}
            style={{
              position: "absolute",
              left: center + Math.cos(angle) * radius - dotSize / 2,
              top: center + Math.sin(angle) * radius - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background:
                index === 0
                  ? contract.palette.success
                  : contract.palette.accent,
              boxShadow: `0 0 24px ${contract.palette.primary}aa`,
            }}
          />
        );
      })}
    </div>
  );
};

const MeaningBars = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const values = [0.42, 0.68, 0.54, 0.88, 0.62, 0.76, 0.48];
  const height = portrait ? 460 : 390;
  return (
    <div
      style={{
        width: portrait ? 760 : 610,
        height,
        display: "flex",
        alignItems: "end",
        gap: portrait ? 22 : 18,
        padding: portrait ? 42 : 34,
        borderRadius: 36,
        background: `${contract.palette.surface}e6`,
        border: `1px solid ${contract.palette.accent}33`,
      }}
    >
      {values.map((value, index) => {
        const wave = 0.08 * Math.sin(frame / 13 + index * 1.4);
        const barHeight = Math.max(0.18, value + wave) * (height - 82);
        return (
          <div
            key={value}
            style={{
              flex: 1,
              height: barHeight,
              borderRadius: 999,
              background:
                index === 3
                  ? `linear-gradient(180deg, ${contract.palette.success}, ${contract.palette.primary})`
                  : `linear-gradient(180deg, ${contract.palette.accent}, ${contract.palette.primary}99)`,
            }}
          />
        );
      })}
    </div>
  );
};

const RuntimeMap = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const runtimes = ["CSS / SVG", "MOTION", "GSAP", "D3", "LOTTIE", "CANVAS"];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: portrait ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
        gap: 18,
        width: portrait ? 760 : 690,
      }}
    >
      {runtimes.map((runtime, index) => {
        const phase = Math.sin(frame / 18 + index) * 0.5 + 0.5;
        return (
          <div
            key={runtime}
            style={{
              minHeight: portrait ? 148 : 132,
              padding: 24,
              borderRadius: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: contract.palette.surface,
              border: `1px solid ${contract.palette.accent}${Math.round(
                35 + phase * 40,
              )
                .toString(16)
                .padStart(2, "0")}`,
              transform: `translateY(${(1 - phase) * 8}px)`,
            }}
          >
            <span style={{ color: contract.palette.muted, fontSize: 17 }}>
              0{index + 1}
            </span>
            <span
              style={{
                color: contract.palette.foreground,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {runtime}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const FrameStack = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const cards = ["FRAME 0438", "FRAME 0439", "FRAME 0440"];
  return (
    <div
      style={{
        position: "relative",
        width: portrait ? 720 : 620,
        height: portrait ? 470 : 390,
      }}
    >
      {cards.map((label, index) => {
        const offset = index * (portrait ? 54 : 44);
        const scan = (frame * 5 + index * 80) % 100;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              inset: `${offset}px ${offset * 0.35}px auto ${offset * 0.35}px`,
              height: portrait ? 320 : 270,
              padding: 30,
              borderRadius: 30,
              background:
                index === 2
                  ? contract.palette.surfaceStrong
                  : contract.palette.surface,
              border: `1px solid ${contract.palette.accent}55`,
              boxShadow: "0 30px 70px #00000055",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: contract.palette.muted,
              }}
            >
              <span>{label}</span>
              <span>30 FPS</span>
            </div>
            <div
              style={{
                marginTop: 28,
                height: 10,
                borderRadius: 999,
                background: contract.palette.background,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${scan}%`,
                  background: contract.palette.primary,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FormatPair = ({
  frame,
  portrait,
}: {
  frame: number;
  portrait: boolean;
}) => {
  const tilt = Math.sin(frame / 18) * 2;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: portrait ? 32 : 44,
      }}
    >
      {[
        {
          label: "16:9",
          width: portrait ? 390 : 360,
          height: portrait ? 220 : 203,
        },
        {
          label: "9:16",
          width: portrait ? 220 : 203,
          height: portrait ? 390 : 360,
        },
      ].map((format, index) => (
        <div
          key={format.label}
          style={{
            width: format.width,
            height: format.height,
            borderRadius: 30,
            padding: 24,
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            background: `linear-gradient(145deg, ${contract.palette.surfaceStrong}, ${contract.palette.surface})`,
            border: `2px solid ${index === 1 ? contract.palette.success : contract.palette.primary}`,
            transform: `rotate(${index === 0 ? tilt : -tilt}deg)`,
            boxShadow: "0 28px 80px #00000066",
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 800 }}>{format.label}</span>
          <span style={{ fontSize: 18, color: contract.palette.muted }}>
            ADAPTIVE
          </span>
        </div>
      ))}
    </div>
  );
};

const SceneVisual = ({
  scene,
  frame,
  portrait,
}: {
  scene: StoryScene;
  frame: number;
  portrait: boolean;
}) => {
  if (scene.visual === "orbit")
    return <SignalOrbit frame={frame} portrait={portrait} />;
  if (scene.visual === "bars")
    return <MeaningBars frame={frame} portrait={portrait} />;
  if (scene.visual === "runtimes")
    return <RuntimeMap frame={frame} portrait={portrait} />;
  if (scene.visual === "frames")
    return <FrameStack frame={frame} portrait={portrait} />;
  return <FormatPair frame={frame} portrait={portrait} />;
};

const Scene = ({
  scene,
  children,
}: {
  scene: StoryScene;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = fadeForFrame(frame, durationInFrames, fps);
  const rise = interpolate(
    frame,
    [
      0,
      Math.min(
        millisecondsToFrames(duration.narrative, fps),
        durationInFrames / 3,
      ),
    ],
    [54, 0],
    {
      ...clamp,
      easing: Easing.bezier(...easing.enter),
    },
  );
  const format = portrait
    ? contract.formats.portrait
    : contract.formats.landscape;

  return (
    <AbsoluteFill
      style={{
        padding: `${format.safeArea.top}px ${format.safeArea.right}px ${format.safeArea.bottom}px ${format.safeArea.left}px`,
        opacity,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          alignItems: portrait ? "stretch" : "center",
          justifyContent: "space-between",
          gap: portrait ? 90 : 76,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div style={{ maxWidth: portrait ? 860 : 780 }}>
          <div
            style={{
              marginBottom: portrait ? 36 : 28,
              color: contract.palette.success,
              fontSize: portrait ? 27 : 23,
              fontWeight: 700,
              letterSpacing: "0.16em",
            }}
          >
            {scene.eyebrow}
          </div>
          <h1
            style={{
              margin: 0,
              color: contract.palette.foreground,
              fontSize: portrait ? 94 : 88,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 800,
            }}
          >
            {scene.title}
          </h1>
          <p
            style={{
              margin: `${portrait ? 38 : 32}px 0 0`,
              maxWidth: portrait ? 800 : 690,
              color: contract.palette.muted,
              fontSize: portrait ? 34 : 28,
              lineHeight: 1.45,
            }}
          >
            {scene.body}
          </p>
        </div>
        <div
          style={{
            minHeight: portrait ? 640 : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const backgroundStyle: CSSProperties = {
  background: `radial-gradient(circle at 80% 20%, ${contract.palette.primary}26, transparent 35%), linear-gradient(145deg, ${contract.palette.background}, #050b13)`,
  color: contract.palette.foreground,
  fontFamily,
};

export const LivingSignals = ({
  projectLabel,
  rendererLabel,
}: LivingSignalsProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const portrait = height > width;
  const progress = frame / Math.max(1, durationInFrames - 1);

  return (
    <AbsoluteFill style={backgroundStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "linear-gradient(#76a9ff22 1px, transparent 1px), linear-gradient(90deg, #76a9ff22 1px, transparent 1px)",
          backgroundSize: portrait ? "72px 72px" : "64px 64px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: portrait ? 64 : 44,
          left: portrait ? 72 : 96,
          right: portrait ? 72 : 96,
          display: "flex",
          justifyContent: "space-between",
          color: contract.palette.muted,
          fontSize: portrait ? 20 : 17,
          fontWeight: 700,
          letterSpacing: "0.14em",
          zIndex: 20,
        }}
      >
        <span>{projectLabel}</span>
        <span>{rendererLabel}</span>
      </div>
      {story.scenes.map((scene) => {
        const startFrame = Math.round(scene.start * fps);
        const duration = Math.round(scene.duration * fps);
        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={duration}
            premountFor={fps}
          >
            <Scene scene={scene}>
              <SceneVisual
                scene={scene}
                frame={frame - startFrame}
                portrait={portrait}
              />
            </Scene>
          </Sequence>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: portrait ? 72 : 96,
          right: portrait ? 72 : 96,
          bottom: portrait ? 72 : 42,
          height: 4,
          borderRadius: 99,
          background: `${contract.palette.foreground}18`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${contract.palette.primary}, ${contract.palette.success})`,
          }}
        />
      </div>
      <Audio
        src={staticFile(contract.audio.fileName)}
        volume={contract.audio.volume}
      />
    </AbsoluteFill>
  );
};
