import contract from "@yanimation/video-contract/production-contract.json";
import { Composition } from "remotion";
import { LivingSignals, type LivingSignalsProps } from "./living-signals";

const defaultProps = {
  projectLabel: "yAnimationPlayground / v0.5",
  rendererLabel: "REMOTION / FRAME-DRIVEN REACT",
} satisfies LivingSignalsProps;

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
    </>
  );
};
