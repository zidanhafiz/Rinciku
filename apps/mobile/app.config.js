// Dynamic wrapper over app.json: static config stays there; this only layers
// build-profile-dependent behavior on top.
module.exports = ({ config }) => {
  if (process.env.EAS_BUILD_PROFILE === 'production') {
    config.plugins = [
      ...(config.plugins ?? []),
      './plugins/with-stripped-dev-client-artifacts',
    ];
  }
  return config;
};
