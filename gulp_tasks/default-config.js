var stringify = require('stringify');

function mergeConfigs(defaultConf, overrides) {
    if (overrides != null) {
        for (var key in defaultConf) {
            if (overrides[key] !== undefined) {
                defaultConf[key] = overrides[key];
            }
        }
    }
    return defaultConf;
}

const DEFAULT_DEST = './_site';
const DEFAULT_ENV = 'production';

module.exports = {
    getBrowserifyConfig: function(overrides) {
        return mergeConfigs({
            entries: './src/scripts/app.js',

            // Array to store dependencies that will be compiled into a deps.js file ONLY once (e.g. add deps from your
            // node module in here as you would not be modifying them).s
            external: [
            ],
            transform: [
                {
                    opts: stringify(['.html']),
                    tr: null
                }
            ],
            useWatchify: false,
            dest: DEFAULT_DEST,
            env: DEFAULT_ENV,
            uglify: {}
        }, overrides);
    },

    getBrowserSyncConfig: function(overrides) {
        return mergeConfigs({
            baseDir: DEFAULT_DEST
        }, overrides);
    },

    getHTMLConfig: function(overrides) {
        return mergeConfigs({
            src: './src/index.html',
            dest: DEFAULT_DEST,
            env: DEFAULT_ENV
        }, overrides)
    },

    getSASSConfig: function(overrides) {
        return mergeConfigs({
            src: './src/styles/**/*.scss',
            dest: DEFAULT_DEST,
            env: DEFAULT_ENV,
        }, overrides);
    },

    // Config for css autoprefixer
    getAutoprefixConfig: function(overrides) {
        mergeConfigs({
            browsers: ['last 2 versions'],
            cascade: false
        }, overrides);
    },

    getCopyConfig: function(overrides) {
        return mergeConfigs({
            base: './src/',
            src: ['./src/img/**'],
            dest: DEFAULT_DEST,
            env: DEFAULT_ENV
        }, overrides);
    }
};
