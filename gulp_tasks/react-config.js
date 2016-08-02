var babelify = require('babelify');
var envify = require('envify');
var stringify = require('stringify');
var defaultConfigFactory = require('./default-config');

// Extending the default config factory
var configFactory = Object.create(defaultConfigFactory);

configFactory.getBrowserifyConfig = function(overrides) {
    var config = defaultConfigFactory.getBrowserifyConfig.call(this, overrides);

    config.external = config.external.concat([
        'bluebird', // Promise
        'react',
        'react-router'
    ]);

    config.transform = [
        {
            opts: stringify,
            tr: {
                extensions: ['.svg']
            }
        },
        {
            opts: babelify,
            tr: {
                presets: ["es2015", "react", "stage-0"],
            }
        },
        {
            opts: envify,
            tr: { NODE_ENV: config.env }
        }
    ];

    return config;
};

module.exports = configFactory;
