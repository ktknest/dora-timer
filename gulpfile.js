var gulp = require('gulp');
var concat = require('gulp-concat-util');
var babel = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('build', ['build:js', 'build:css']);

gulp.task('build:js', function() {
  gulp.src([
    './src/js/**/*.js'
  ])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js', {
      process: function(content) {
        return content.replace(/(^|\n)[ \t]*'use strict';?\s*/g, '$1');
      }
    }))
    .pipe(ngAnnotate({
      single_quotes : true
    }))
    .pipe(concat.header([
      ';(function(window, document) {',
      '',
      '\'use strict\';',
      '',
      ''].join('\n')))
    .pipe(concat.footer(['',
      '})(this, this.document);', ''].join('\n')))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('build:css', function() {
  gulp.src([
    './src/css/reset.css',
    './src/css/style.css'
  ])
    .pipe(concat('style.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
  gulp.watch('./src/js/**/*.js', ['build:js']);
  gulp.watch('./src/css/**/*.css', ['build:css']);
});
