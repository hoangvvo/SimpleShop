module.exports = {
  presets: [
    [
      "module:metro-react-native-babel-preset",
      { useTransformReactJSXExperimental: true },
    ],
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [
          ".ios.js",
          ".android.js",
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".json",
        ],
      },
    ],
    "react-native-paper/babel",
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
