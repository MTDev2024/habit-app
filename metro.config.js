const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permet à Metro de résoudre les fichiers de fonts (.ttf, .otf)
// nécessaire pour @expo/vector-icons sur le web
config.resolver.assetExts.push('ttf', 'otf');

module.exports = config;
