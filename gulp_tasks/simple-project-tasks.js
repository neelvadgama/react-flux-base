var sassTasks = require('./sass-task');
var browserifyTasks = require('./browserify-task');
var devServerTask = require('./dev-server-task');
var defaultConfigFactory = require('./default-config');
var runSequence = require('run-sequence');

module.exports = function init(gulp, configFactory) {

    /*
     * Required in order to use gulp common via npm link
     */
    runSequence = runSequence.use(gulp);

    configFactory = configFactory || defaultConfigFactory;

    /**
     * Load this file to get basic tasks for all simple projects that will use commonJS code with SASS.
     *
     * This file will provide the following general purpose tasks:
     * - gulp start: Starts a dev server and watches the files.
     * - gulp build: Triggers a build that will copy the html / css & JS files into a _site folder for deployment.
     */

    /**
     * Loads all the basic build tasks used for prod & dev.
     */
    require('./base-tasks')(gulp, configFactory);

    //
    //  Watch tasks.
    //
    gulp.task('watch-app', function() {
        var browserifyConf = configFactory.getBrowserifyConfig({env:'development'});
        browserifyConf.useWatchify = true;
        var bundler = browserifyTasks.getAppBundler(browserifyConf);
        return browserifyTasks.bundle(bundler, 'app.js', browserifyConf);
    });

    gulp.task('watch-sass', function() {
        return sassTasks.watch(configFactory.getSASSConfig());
    });

    // We do not need to build app as the call to watch will build the app.
    gulp.task('build-all-but-app', ['dev:build-deps', 'dev:build-html', 'dev:build-sass', 'dev:build-conf']);
    gulp.task('watch', function(callback) {
        runSequence('build-all-but-app', ['watch-app', 'watch-sass'], callback);
    });

    /**
     * Start the dev server
     */
    gulp.task('server', function() {
        return devServerTask(configFactory.getBrowserSyncConfig());
    });

    /**
     * Start the dev-server and watchers for development purpose.
     */
    gulp.task('start', ['server', 'watch']);

    /**
     * Main release task.
     */
    gulp.task('build', ['prod:build']);
};