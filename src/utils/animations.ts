import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  SlideInRight,
  SlideInUp,
  ZoomIn,
  BounceIn,
  Stagger,
  withSpring,
  withTiming,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

export const SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const TIMING_CONFIG: WithTimingConfig = {
  duration: 200,
};

export function pressScale() {
  return withSpring(0.95, SPRING_CONFIG);
}

export function releaseScale() {
  return withSpring(1, SPRING_CONFIG);
}

export const FADE_IN_UP = FadeInUp.springify().damping(15).stiffness(150);
export const FADE_IN_DOWN = FadeInDown.springify().damping(15).stiffness(150);
export const FADE_IN_LEFT = FadeInLeft.springify().damping(15).stiffness(150);
export const FADE_IN_RIGHT = FadeInRight.springify().damping(15).stiffness(150);
export const SLIDE_IN_RIGHT = SlideInRight.springify().damping(15).stiffness(150);
export const SLIDE_IN_UP = SlideInUp.springify().damping(15).stiffness(150);
export const ZOOM_IN = ZoomIn.springify().damping(15).stiffness(150);
export const BOUNCE_IN = BounceIn.springify().damping(15).stiffness(150);

export function staggeredEntrance(delay: number) {
  return FadeInUp.springify()
    .damping(15)
    .stiffness(150)
    .delay(delay);
}

export {
  Animated,
  withSpring,
  withTiming,
  Stagger,
};
