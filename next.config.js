const path = require('path');
module.exports = {
  webpack5: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    if (isServer) {
      config.output.webassemblyModuleFilename =
        './../static/wasm/biscuit.wasm'
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/biscuit.wasm'
    }

    return config;
  },
};