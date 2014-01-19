var gulp = require('gulp'),
    cover = require('./index'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    exec = require('child_process').exec;


gulp.task('test', function () {
    gulp.src(['test/**.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('lint', function () {
    gulp.src(['test/**/*.js', 'index.js', 'contrib/cover.js', 'contrib/coverage_store.js', 'contrib/reporters/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('debug', function () {
    exec('node --debug-brk blnkt.js', {}, function (error, stdout, stderr) {
        console.log('STDOUT');
        console.log(stdout);
        console.log('STDERR');
        console.log(stderr);
        if (error) {
            console.log('-------ERROR-------');
            console.log(error);
        }
    });
});

/*
 * these tasks are to actually use the plugin and test it within the context of gulp
 */
gulp.task('blnkt', function () {
    gulp.src(['src.js', 'src2.js', 'src3.js'], { read: false })
        .pipe(cover.instrument({
            pattern: ['**/test*'],
            debugDirectory: 'debug'
        }))
        .pipe(mocha({
            reporter: 'spec'
        }))
        .pipe(cover.report({
            outFile: 'blnkt.html'
        }));
});

gulp.task('watch', function () {
    gulp.watch(['src.js', 'src2.js', 'src3.js', 'test.js', 'test2.js'], function(event) {
      gulp.run('blnkt');
    });    
});

