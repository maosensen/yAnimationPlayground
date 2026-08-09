import {
  MotionPolicyProvider,
  useMotionPolicy,
} from "@yanimation/motion-kit/policy";
import { MotionPressable } from "@yanimation/motion-kit/pressable";
import { Reveal } from "@yanimation/motion-kit/reveal";
import { Stagger } from "@yanimation/motion-kit/stagger";
import { motionTransition } from "@yanimation/motion-kit/transitions";

function PolicyReader() {
  const policy = useMotionPolicy();
  return <output>{policy.preference}</output>;
}

export function ConsumerContract() {
  return (
    <MotionPolicyProvider preference="system">
      <Reveal preset="rise">
        <Stagger.Root tempo="standard">
          <Stagger.Item>
            <MotionPressable type="button" feedback="compress">
              Test
            </MotionPressable>
          </Stagger.Item>
        </Stagger.Root>
      </Reveal>
      <PolicyReader />
      <output>{motionTransition.enter.type}</output>
    </MotionPolicyProvider>
  );
}
