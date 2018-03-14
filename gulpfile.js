var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var minify = require('gulp-clean-css');

gulp.task('amalgamation', function ()
{

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

gulp.task('minification', function ()
{
  return gulp.src('dist/markup_kit/css/amalgamation.css')
  .pipe(minify())
  .pipe(rename('minification.css'))
  .pipe(gulp.dest('dist/markup_kit/css'))
});

gulp.task('default', ['amalgamation', 'minification']);