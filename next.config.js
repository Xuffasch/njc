const withPlugins = require('next-compose-plugins');
const withWorkbox = require('next-with-workbox');

module.exports = withPlugins(
  [
    [withWorkbox, {
      workbox: {
        swSrc: 'service-worker.js',
        force: true, /* force service worker generation in dev */
      }
    }],
  ]
)