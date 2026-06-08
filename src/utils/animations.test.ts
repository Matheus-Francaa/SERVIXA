import { describe, it, expect, vi } from "vitest";

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

  const mockComp = (props: any) => null;
  (mockComp as any).displayName = "AnimatedMock";

  return {
    default: mockComp,
    createAnimatedComponent: (comp: any) => comp,
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    FadeIn: buildEntry(),
    FadeInDown: buildEntry(),
    FadeInUp: buildEntry(),
    FadeInLeft: buildEntry(),
    FadeInRight: buildEntry(),
    SlideInRight: buildEntry(),
    SlideInUp: buildEntry(),
    ZoomIn: buildEntry(),
    BounceIn: buildEntry(),
    Stagger: () => ({}),
  };
});

describe("animations utility", () => {
  it("exports animation presets", async () => {
    const mod = await import("./animations");
    expect(mod.FADE_IN_UP).toBeDefined();
    expect(mod.FADE_IN_DOWN).toBeDefined();
    expect(mod.ZOOM_IN).toBeDefined();
    expect(mod.BOUNCE_IN).toBeDefined();
    expect(mod.SLIDE_IN_RIGHT).toBeDefined();
    expect(mod.SLIDE_IN_UP).toBeDefined();
  });

  it("exports withSpring and withTiming", async () => {
    const mod = await import("./animations");
    expect(typeof mod.withSpring).toBe("function");
    expect(typeof mod.withTiming).toBe("function");
  });

  it("staggeredEntrance returns an entry animation", async () => {
    const mod = await import("./animations");
    const anim = mod.staggeredEntrance(200);
    expect(anim).toBeDefined();
  });
});
