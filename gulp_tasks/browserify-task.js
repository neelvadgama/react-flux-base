var browserify = require('browserify');
var watchify = require('watchify');
var logError = require('./error-logger');
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream2');
var gulp = require('gulp');


/**
 * Builds and returns the appropriate browserify options.
 * @returns {object}
 * @param options
 */
function getBrowserifyOptions(options) {
    var browserifyOptions = options.initOptions || {};

    // Init with watchify require settings.
    if(options.useWatchify) {
        for(var key in watchify.args) {
            //noinspection JSUnfilteredForInLoop
            browserifyOptions[key] = watchify.args[key]
        }
    }

    // Add source maps.
    if(options.env === 'development') {
        browserifyOptions.debug = true;
    }
    //browserifyOptions.presets = ["es2015", "react"];

    return browserifyOptions;
}

/**
 * @param options
 * @return {browserify} Basic bundler with the relevant transform applied.
 */
function getBundler(options) {
    var browserifyOptions = getBrowserifyOptions(options);
    var bundler = browserify(browserifyOptions);

    // Apply any transform passed in.
    if(options.transform.length > 0) {
        options.transform.forEach(function(transform, index, arr) {
            var opts = transform.opts;
            var tr = transform.tr;
            bundler = bundler.transform(opts, tr);
        })
    }

    return bundler;
}

module.exports = {
    /**
     * Bundle all the files defined as external into a single file.
     * @param options
     * @returns {browserify}
     */
    getDepsBundler: function(options) {
        var bundler = getBundler(options);
        bundler.require(options.external);
        bundler.on('error', logError);

        return bundler;
    },

    /**
     * Bundle the app source code and exclude all the externals.
     * @param options
     * @returns {browserify}
     */
    getAppBundler: function(options) {
        var bundler = getBundler(options);

        if(options.useWatchify) {
            bundler = watchify(bundler);
            var reBundle = function() {
                return this.bundle(bundler, 'app.js', options);
            }.bind(this);

            bundler.on('log', function(msg) { $.util.log(msg) });
            bundler.on('update', reBundle);
        }

        bundler.external(options.external);
        bundler.add(options.entries);

        return bundler;
    },

    /**
     * Common code performed when bundling.
     * @param {string} outputName
     * @param {browserify} bundler
     * @param {object} options
     * @returns {browserify}
     */
    bundle: function(bundler, outputName, options) {
        function onError(err){
            logError(err);
            if(options.env === 'production'){
                process.exit(1)
            }
        }

        bundler = bundler
            .bundle()
            .on('error', onError)
            .pipe(source(outputName));

        if(options.env === 'production') {
            bundler = bundler.pipe(uglify(options.uglify))
        }

        return bundler
            .pipe(gulp.dest(options.dest));
    }
};
