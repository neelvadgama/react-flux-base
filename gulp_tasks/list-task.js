module.exports = function init(gulp) {
    // Helper to list all the current available gulp tasks.
    gulp.task('list-tasks', function() {
        console.log('Available tasks are:')
        for(var taskName in gulp.tasks) {
            console.log(taskName);
        }
    });
}