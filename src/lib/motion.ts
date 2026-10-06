import type { WithSpringConfig } from "react-native-reanimated";

/**
 * Mobile counterpart to the web app's src/lib/motion.ts, deliberately using the
 * same two numbers so both apps settle the same way.
 *
 * Reanimated 4 takes `dampingRatio` + `duration` directly, which is the same
 * pair Apple's motion guidance is written in, so no conversion is needed here.
 * `dampingRatio: 1` is critically damped — reaches the target and stops.
 *
 * The rule for which to use: overshoot is only correct when the gesture itself
 * carried momentum (a flick, a throw, a drag release). Something that merely
 * appeared, or moved because state changed, settles flat.
 *
 * Note Reanimated treats `duration` as *perceptual* — the real settle is about
 * 1.5x this — so these are not directly comparable to a CSS duration.
 */

/** Default: anything appearing, moving or resizing on its own. No overshoot. */
export const springUI: WithSpringConfig = { dampingRatio: 1, duration: 400 };

/** Presses: should read as immediate rather than as travel. */
export const springPress: WithSpringConfig = { dampingRatio: 1, duration: 250 };

/** How far a pressable scales down while held. Matches the web app's :active. */
export const PRESS_SCALE = 0.97;
