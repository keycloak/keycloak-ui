module.exports = {
  extends: "@snowpack/app-scripts-react",
  scripts: {
    "build:css": "postcss",
    "bundle:*": "@snowpack/plugin-webpack"
  },
  proxy: {
    "/realms": process.env.BACKEND_URL,
  },
  plugins: [
    [
      "@snowpack/plugin-webpack",
      {
        extendConfig: (config) => {
          config.plugins.push(/* ... */);
          return config;
        },
      },
    ],
  ],
  devServer: {
    historyApiFallback: true
  }
};
