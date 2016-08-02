var del = require('del');

var htmlTasks = require('./html-task');
var sassTasks = require('./sass-task');
var copyTasks = require('./copy-task');
var browserifyTasks = require('./browserify-task');
var bustCache = require('./cache-bust-task');
var listTask = require('./list-task');

module.exports = function init(gulp, configFactory) {
    configFactory = configFactory === undefined ? require('./default-config') : configFactory;

    listTask(gulp);

    //
    //  Single run build tasks.
    //
    function generateTasks(prefix, confOverride) {
        //
        // Build the configs
        //
        var browserifyConfig = configFactory.getBrowserifyConfig(confOverride);
        var sassConfig = configFactory.getSASSConfig(confOverride);
        var autoprefixConfig = configFactory.getAutoprefixConfig(confOverride);
        var htmlConfig = configFactory.getHTMLConfig(confOverride);
        var copyConfig = configFactory.getCopyConfig(confOverride);

        gulp.task(prefix + 'build-app', function() {
            var bundler = browserifyTasks.getAppBundler(browserifyConfig);
            return browserifyTasks.bundle(bundler, 'app.js', browserifyConfig);
        });

        gulp.task(prefix + 'build-deps', function() {
            var bundler = browserifyTasks.getDepsBundler(browserifyConfig);
            return browserifyTasks.bundle(bundler, 'deps.js', browserifyConfig)
        });

        gulp.task(prefix + 'build-sass', function() {
            return sassTasks.build(sassConfig, autoprefixConfig);
        });

        gulp.task(prefix + 'build-html', function() {
            return htmlTasks.build(htmlConfig);
        });

        gulp.task(prefix  + 'build-conf', function() {
            return copyTasks.build(copyConfig);
        });

        gulp.task(prefix + 'build-all', [
            prefix + 'build-deps',
            prefix + 'build-app',
            prefix + 'build-html',
            prefix + 'build-sass',
            prefix + 'build-conf'
        ]);


        // Build all and bust cache.
        gulp.task(prefix + 'build', [prefix + 'build-all'], function() {
            return bustCache(htmlConfig.src, htmlConfig.dest);
        });

        gulp.task('clean', function() {
            del([browserifyConfig.dest, sassConfig.dest, htmlConfig.dest, copyConfig.dest]);
        });
    }

    generateTasks('dev:', {env: 'development'});

    // Prod tasks will be created without prefixes.
    generateTasks('prod:', {env: 'production'});
};