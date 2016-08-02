var browserSync = require('browser-sync');
var modRewrite = require('connect-modrewrite');

module.exports = function(options) {
    browserSync({
        host: 'localhost',
        port: 9014,
        open: 'external',
        ghostMode: typeof options.ghostMode === 'undefined' ? false : options.ghostMode,
        server: {
            baseDir: options.baseDir,
            index: 'index.html',
            middleware: [
                modRewrite([
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
        }
    });
};
