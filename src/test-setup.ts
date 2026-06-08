import { vi } from "vitest";

vi.mock("react-native", () => ({
  View: (props: any) => null,
  Text: (props: any) => null,
  StyleSheet: { create: (styles: any) => styles },
  Platform: { OS: "web" },
  Pressable: (props: any) => null,
  Image: (props: any) => null,
  ScrollView: (props: any) => null,
  FlatList: (props: any) => null,
  TextInput: (props: any) => null,
  TouchableOpacity: (props: any) => null,
  StatusBar: (props: any) => null,
  KeyboardAvoidingView: (props: any) => null,
  ActivityIndicator: (props: any) => null,
  Alert: { alert: vi.fn() },
  SafeAreaView: (props: any) => null,
}));

vi.mock("react-native-webview", () => ({
  WebView: (props: any) => null,
}));

vi.mock("react-native-reanimated", () => {
  const buildEntry = () => ({
    springify: () => ({
      damping: () => ({
        stiffness: () => ({
          delay: () => ({}),
        }),
      }),
    }),
  });

  return {
    createAnimatedComponent: (comp: any) => comp,
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    useDerivedValue: () => ({ value: {} }),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    withSequence: (...vals: any[]) => vals[vals.length - 1],
    withRepeat: (anim: any) => anim,
    withDelay: (_delay: number, anim: any) => anim,
    withDecay: (val: any) => val,
    FadeIn: buildEntry(),
    FadeOut: buildEntry(),
    FadeInDown: buildEntry(),
    FadeInUp: buildEntry(),
    FadeInLeft: buildEntry(),
    FadeInRight: buildEntry(),
    SlideInRight: buildEntry(),
    SlideInUp: buildEntry(),
    ZoomIn: buildEntry(),
    BounceIn: buildEntry(),
    Stagger: () => ({}),
    makeMutable: (init: any) => ({ value: init }),
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    interpolate: (val: any, input: any[], output: any[]) => output[0],
    Extrapolation: { CLAMP: "clamp" },
    useAnimatedScrollHandler: (handlers: any) => handlers,
    useAnimatedProps: () => ({}),
  };
});
