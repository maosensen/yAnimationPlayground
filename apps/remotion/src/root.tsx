import { signalAtlasReference } from "@yanimation/animation-pipeline/reference";
import contract from "@yanimation/video-contract/production-contract.json";
import { Composition } from "remotion";
import { LivingSignals, type LivingSignalsProps } from "./living-signals";
import { SignalAtlas, type SignalAtlasProps } from "./signal-atlas";

const defaultProps = {
  projectLabel: "yAnimationPlayground / v0.5",
  rendererLabel: "REMOTION / FRAME-DRIVEN REACT",
} satisfies LivingSignalsProps;

const pipelineDefaultProps = {
  projectLabel: "yAnimationPlayground / v0.7",
  rendererLabel: "REVIEWED PIPELINE / REMOTION",
} satisfies SignalAtlasProps;

const pipelineFormats = Object.fromEntries(
  signalAtlasReference.creativeBrief.formats.map((format) => [
    format.id,
    format,
  ]),
);
const pipelineStoryboard = signalAtlasReference.storyboard;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="LivingSignalsLandscape"
        component={LivingSignals}
        width={contract.formats.landscape.width}
        height={contract.formats.landscape.height}
        fps={contract.fps}
        durationInFrames={contract.durationInFrames}
        defaultProps={defaultProps}
      />
      <Composition
        id="LivingSignalsPortrait"
        component={LivingSignals}
        width={contract.formats.portrait.width}
        height={contract.formats.portrait.height}
        fps={contract.fps}
        durationInFrames={contract.durationInFrames}
        defaultProps={defaultProps}
      />
      <Composition
        id="SignalAtlasLandscape"
        component={SignalAtlas}
        width={pipelineFormats.landscape.width}
        height={pipelineFormats.landscape.height}
        fps={pipelineStoryboard.fps}
        durationInFrames={
          pipelineStoryboard.durationSeconds * pipelineStoryboard.fps
        }
        defaultProps={pipelineDefaultProps}
      />
      <Composition
        id="SignalAtlasPortrait"
        component={SignalAtlas}
        width={pipelineFormats.portrait.width}
        height={pipelineFormats.portrait.height}
        fps={pipelineStoryboard.fps}
        durationInFrames={
          pipelineStoryboard.durationSeconds * pipelineStoryboard.fps
        }
        defaultProps={pipelineDefaultProps}
      />
    </>
  );
};
