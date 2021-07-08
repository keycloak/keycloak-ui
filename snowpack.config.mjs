import proxy from "http2-proxy";

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
    "node_modules/@patternfly/patternfly/assets/fonts": { url: "/assets/fonts", static: true },
    "node_modules/@patternfly/patternfly/assets/pficon": { url: "/assets/pficon", static: true },
    "node_modules/@patternfly/patternfly/assets/images": { url: "/assets/images", static: true },
  },
  plugins: [
    "@snowpack/plugin-postcss",
    "@snowpack/plugin-react-refresh",
    [
      "@snowpack/plugin-typescript",
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: "yarn pnpify tsc" } : {}),
      },
    ],
  ],
  routes: [
    {
      src: "/auth/admin/.*",
      dest: (req, res) => proxy.web(req, res, {
        hostname: "localhost",
        port: 8180,
      }),
    },
  ],
  optimize: {
    bundle: true,
  },
  buildOptions: {
    baseUrl: "/adminv2",
  },
};
