var gulp = require('gulp');

module.exports = {
    build: function(options) {
        return gulp.src(options.src, options.base && {base: options.base})
            .pipe(gulp.dest(options.dest));
    }
};