const path = require('path');
module.exports = {
  webpack5: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.experiments = {
      asyncWebAssembly: true
    };

    if (isServer) {
      config.output.webassemblyModuleFilename =
        './../static/wasm/[modulehash].wasm'
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    }

    return config;
  },
};