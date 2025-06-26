const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'mfe2',
  filename: 'remoteEntry.js',
  exposes: {
    //'./Component': './src/app/app.component.ts',
    './Routes': './src/app/app.routes.ts'
  },

  shared: {
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    '@angular/common/http': { singleton: true, strictVersion: true }
  },

});
