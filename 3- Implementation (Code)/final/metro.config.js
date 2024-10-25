const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  defaultConfig.resolver.extraNodeModules = {
    ...defaultConfig.resolver.extraNodeModules,
    // Only include buffer and process if needed
    buffer: require.resolve('buffer'),
    process: require.resolve('process'),
  };

  return defaultConfig;
})();
