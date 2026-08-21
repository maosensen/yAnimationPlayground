export type ScalarSegment = {
  from: number;
  to: number;
  velocity: number;
};

export const SCREEN_STUDIO_BEZIER = [0.25, 1, 0.3, 1] as const;

export function criticalSpringPosition(
  elapsedSeconds: number,
  segment: ScalarSegment,
  omega: number,
) {
  const displacement = segment.from - segment.to;
  const coefficient = segment.velocity + omega * displacement;
  return (
    segment.to +
    (displacement + coefficient * elapsedSeconds) *
      Math.exp(-omega * elapsedSeconds)
  );
}

export function criticalSpringVelocity(
  elapsedSeconds: number,
  segment: ScalarSegment,
  omega: number,
) {
  const displacement = segment.from - segment.to;
  const coefficient = segment.velocity + omega * displacement;
  return (
    (coefficient - omega * (displacement + coefficient * elapsedSeconds)) *
    Math.exp(-omega * elapsedSeconds)
  );
}

export function cubicBezierProgress(
  progress: number,
  [x1, y1, x2, y2] = SCREEN_STUDIO_BEZIER,
) {
  const clampedProgress = clamp(progress, 0, 1);
  const parameter = solveBezierParameter(clampedProgress, x1, x2);

  return cubicCoordinate(parameter, y1, y2);
}

export function cubicBezierSlope(
  progress: number,
  [x1, y1, x2, y2] = SCREEN_STUDIO_BEZIER,
) {
  const parameter = solveBezierParameter(clamp(progress, 0, 1), x1, x2);
  const horizontalSlope = cubicDerivative(parameter, x1, x2);

  if (Math.abs(horizontalSlope) < 0.000001) return 0;
  return cubicDerivative(parameter, y1, y2) / horizontalSlope;
}

function solveBezierParameter(progress: number, x1: number, x2: number) {
  let parameter = progress;

  for (let iteration = 0; iteration < 6; iteration += 1) {
    const error = cubicCoordinate(parameter, x1, x2) - progress;
    const slope = cubicDerivative(parameter, x1, x2);
    if (Math.abs(slope) < 0.000001) break;
    parameter = clamp(parameter - error / slope, 0, 1);
  }

  return parameter;
}

export function responseDuration(omega: number) {
  return 9 / omega;
}

export function isSpringSettled(
  value: number,
  target: number,
  velocity: number,
  valueTolerance: number,
  velocityTolerance: number,
) {
  return (
    Math.abs(value - target) <= valueTolerance &&
    Math.abs(velocity) <= velocityTolerance
  );
}

function cubicCoordinate(parameter: number, point1: number, point2: number) {
  const inverse = 1 - parameter;
  return (
    3 * inverse * inverse * parameter * point1 +
    3 * inverse * parameter * parameter * point2 +
    parameter * parameter * parameter
  );
}

function cubicDerivative(parameter: number, point1: number, point2: number) {
  const inverse = 1 - parameter;
  return (
    3 * inverse * inverse * point1 +
    6 * inverse * parameter * (point2 - point1) +
    3 * parameter * parameter * (1 - point2)
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
