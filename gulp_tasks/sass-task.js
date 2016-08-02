var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpAutoPrefixer = require('gulp-autoprefixer');
var gulpUtil = require('gulp-util');
var gulpSourceMaps = require('gulp-sourcemaps');


/**
 * Builds and returns the appropriate sass options.
 * @param options
 * @returns {object}
 */
function getSassOptions(options) {
    var sassOptions = {
        useSourceMaps: true,
        onSuccess: function(css) {
            var stats = css.stats;
            gulpUtil.log(gulpUtil.colors.green('Sass rebuild successful:'));
            gulpUtil.log(gulpUtil.colors.green('Processed ' + stats.entry + ' in ' + 'Completed in ' + css.stats.duration + 'ms'));
        },
        onError: function(err) {
            gulpUtil.log(gulpUtil.colors.red('Sass rebuild failed:'));
            if(err.file && err.line) {
                gulpUtil.log(gulpUtil.colors.red('Error in ' + err.file + ' on line ' + err.line));
            }
            if(err.message) {
                gulpUtil.log(gulpUtil.colors.red(err.message));
            }
        }
    }

    if (options && options.env !== 'development' ) {
        sassOptions.outputStyle = 'compressed';
        sassOptions.useSourceMaps = false;
    }

    return sassOptions;
}

module.exports = {
    build: function(options, autoprefixOptions) {
        gulpUtil.log('');
        gulpUtil.log(gulpUtil.colors.green('Sass rebuild...'));

        var sassOptions = getSassOptions(options);

        if(sassOptions.useSourceMaps) {
            return gulp.src(options.src)
                .pipe(gulpSass().on('error', gulpSass.logError))
                .pipe(gulpSourceMaps.init())
                .pipe(gulpSass(sassOptions))
                .pipe(gulpAutoPrefixer(autoprefixOptions))
                .pipe(gulpSourceMaps.write())
                .pipe(gulp.dest(options.dest));
        }
        else {
            return gulp.src(options.src)
                .pipe(gulpSass(sassOptions))
                .pipe(gulpAutoPrefixer(autoprefixOptions))
                .pipe(gulp.dest(options.dest));
        }
    },

    watch: function(options) {
        return gulp.watch(options.src, this.build.bind(this, options));
    }
};
