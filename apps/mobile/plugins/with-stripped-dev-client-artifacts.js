// Removes expo-dev-client's prebuild artifacts from store builds. The package
// stays installed (its native code is already debug-only), but its auto-applied
// config plugin writes NSLocalNetworkUsageDescription + NSBonjourServices into
// Info.plist and SYSTEM_ALERT_WINDOW into AndroidManifest regardless of build
// configuration — none of which the release app uses.
const { withInfoPlist, withAndroidManifest } = require('expo/config-plugins');

const withStrippedDevClientArtifacts = (config) => {
  config = withInfoPlist(config, (c) => {
    delete c.modResults.NSLocalNetworkUsageDescription;
    delete c.modResults.NSBonjourServices;
    return c;
  });
  config = withAndroidManifest(config, (c) => {
    const manifest = c.modResults.manifest;
    if (Array.isArray(manifest['uses-permission'])) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (p) => p.$['android:name'] !== 'android.permission.SYSTEM_ALERT_WINDOW'
      );
    }
    return c;
  });
  return config;
};

module.exports = withStrippedDevClientArtifacts;
