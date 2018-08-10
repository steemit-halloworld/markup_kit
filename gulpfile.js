var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var minify = require('gulp-clean-css');
var cssbeautify = require('gulp-cssbeautify');

gulp.task('mkit-box', function () {
  var plugins = [
    cssnext()
  ];

  return gulp.src('modules/mkit-box/index.scss')
  .pipe(sass({
    includePaths: ["modules"],
    errorLogToConsole: true
  }))
  .pipe(postcss(plugins))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit-box/css'))
});


gulp.task('amalgamation', function () {

  var plugins = [
    cssnext()
  ];

  return gulp.src('modules/markup_kit/css/include.css')
  .pipe(sass({
    includePath: ["modules/markup_kit/css/"],
    errorLogToConsole: true
  }))
  .pipe(postcss(plugins))
  .pipe(rename('amalgamation.css'))
  .pipe(gulp.dest('dist/markup_kit/css'))
});

gulp.task('minification', function () {
  return gulp.src('dist/markup_kit/css/amalgamation.css')
  .pipe(minify())
  .pipe(rename('minification.css'))
  .pipe(gulp.dest('dist/markup_kit/css'))
});

gulp.task('default', ['amalgamation', 'minification']);