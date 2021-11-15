/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias['@prisma/client$'] = require.resolve('@prisma/client');
        return config;
    },
};
