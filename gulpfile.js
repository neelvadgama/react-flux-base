var Promise = require('es6-promise').Promise;
var gulp = require('gulp');
var reactConfigFactory = require('./gulp_tasks/react-config');

// Those deps will be cached and not watched.
var dependencies = [
    'debug',
    'react',
    'react/addons',
    'react-router',
    'react-bootstrap',
    'react-dom'
];

// Extending the default config factory
var configFactory = Object.create(reactConfigFactory);

// add deps
configFactory.getBrowserifyConfig = function(overrides) {
    var config = reactConfigFactory.getBrowserifyConfig.call(this, overrides);
    config.external = dependencies;
    return config;
};

configFactory.getCopyConfig = function(overrides) {
    var config = reactConfigFactory.getCopyConfig.call(this, overrides);
    var pathsToAdd = ['./src/assets/**'];
    config.src = config.src ? pathsToAdd.concat(config.src) : pathsToAdd;
    return config;
};

require('./gulp_tasks/simple-project-tasks')(gulp, configFactory);