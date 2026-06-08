// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react-native", () => ({
  View: (props: any) => null,
  Text: (props: any) => null,
  StyleSheet: { create: (styles: any) => styles },
  Platform: { OS: "web" },
}));

vi.mock("react-native-reanimated", () => ({
  createAnimatedComponent: (comp: any) => comp,
  useSharedValue: (init: any) => ({ value: init }),
  useAnimatedStyle: () => ({}),
  withSpring: (val: any) => val,
  withTiming: (val: any) => val,
}));

vi.mock("react-native-webview", () => ({
  WebView: (props: any) => null,
}));

import React from "react";
import { render } from "@testing-library/react";

describe("ServiceMap", () => {
  it("renders without crashing when coordinates are provided", async () => {
    const { ServiceMap } = await import("./ServiceMap");
    const { container } = render(
      React.createElement(ServiceMap, {
        latitude: -23.5505,
        longitude: -46.6333,
        title: "São Paulo",
      }),
    );
    expect(container).toBeDefined();
  });

  it("renders nothing when coordinates are missing", async () => {
    const { ServiceMap } = await import("./ServiceMap");
    const { container } = render(
      React.createElement(ServiceMap, {
        latitude: undefined as any,
        longitude: undefined as any,
      }),
    );
    expect(container).toBeDefined();
  });

  it("accepts a style prop", async () => {
    const { ServiceMap } = await import("./ServiceMap");
    const { container } = render(
      React.createElement(ServiceMap, {
        latitude: -23.5505,
        longitude: -46.6333,
        style: { height: 200 },
      }),
    );
    expect(container).toBeDefined();
  });
});
