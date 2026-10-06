import { type ComponentProps } from "react";
import { Pressable, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { PRESS_SCALE, springPress } from "@/lib/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = ComponentProps<typeof Pressable> & {
  /** Set false where a parent already provides the press response. */
  scaleOnPress?: boolean;
};

/**
 * Pressable that acknowledges the touch on press-*in* rather than on release.
 *
 * The plain Pressable `pressed` flag re-renders on the JS thread, so feedback
 * arrives a frame or more after the finger. Driving the scale through a shared
 * value keeps it on the UI thread, so it responds even while JS is busy — which
 * is exactly when a dropped press is most noticeable.
 *
 * Honours the OS reduce-motion setting by dropping the travel and keeping
 * whatever colour/opacity feedback the caller supplies.
 */
export function PressableScale({ scaleOnPress = true, style, ...props }: Props) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const setPressed = (pressed: boolean) => {
    if (!scaleOnPress || reduceMotion || props.disabled) return;
    scale.set(withSpring(pressed ? PRESS_SCALE : 1, springPress));
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        setPressed(true);
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        props.onPressOut?.(event);
      }}
      style={[style as ViewStyle, animated]}
    />
  );
}
