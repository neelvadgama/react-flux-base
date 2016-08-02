var gulp = require('gulp');

module.exports = {
    build: function(options) {
        return gulp.src(options.src)
            .pipe(gulp.dest(options.dest));
    }
};