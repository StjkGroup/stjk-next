/**
 * Create by fay on 4/29/20 5:55 上午
 */
const webpackConfig = require('./webpack/config');
const runtimeCaching = require('./webpack/runtimeCaching');
const pro = process.env.NODE_ENV === 'production';
const swDest = pro ? 'sw.js' : 'static/sw.js';

const withOffline = require('next-offline')

const withNextConfig = ({assetPrefix='', env, generateInDevMode=false, webpack, ...nextConfig}) => {
  const defaultConfig = {
    future: {
      webpack5: true,
    },
    assetPrefix,
    env: {
      ASSET_PREFIX: assetPrefix,
      ...env
    },
    webpack: webpackConfig(webpack),
    registerSwPrefix: assetPrefix,
    scope: assetPrefix+'/',
    generateInDevMode,
    dontAutoRegisterSw: true,
    workboxOpts: {
      swDest,
      modifyURLPrefix: { 'autostatic/': '_next/static/' },
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5242880,
      runtimeCaching,
      // navigateFallback: assetPrefix + '/index.html',
      navigateFallbackDenylist: [/^\/_/],
    },
    trailingSlash: true,
  }
  if(!pro && generateInDevMode) {
    defaultConfig.experimental = {
      async rewrites() {
        return [
          {
            source: '/service-worker.js',
            destination: '/_next/static/service-worker.js',
          },
        ]
      },
    };
  }
  return withOffline({...defaultConfig, ...nextConfig});
}

module.exports = withNextConfig;