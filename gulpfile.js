var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var postcss_import = require("postcss-import");
var minify = require('gulp-clean-css');
var cssbeautify = require('gulp-cssbeautify');
var postcssPresetEnv = require('postcss-preset-env');

var postcss_processors = [
  postcss_import(),
  postcssPresetEnv({
    stage: 2,
    features: {
      'custom-media-queries': true
    }
  })
];

function mkit_base ()
{
  return gulp.src('modules/mkit-base/index.css')
  .pipe(postcss(postcss_processors))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit-base/build'))
}

function mkit_menu ()
{
  return gulp.src('modules/mkit-menu/index.css')
  .pipe(postcss(postcss_processors))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit-menu/build'))
}

function mkit_box ()
{
  return gulp.src('modules/mkit-box/index.css')
  .pipe(postcss(postcss_processors))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit-box/build'))
}

function mkit_control ()
{
  return gulp.src('modules/mkit-control/index.css')
  .pipe(postcss(postcss_processors))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit-control/build'))
}

function mkit ()
{
  return gulp.src('modules/mkit/index.css')
  .pipe(postcss(postcss_processors))
  .pipe(cssbeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(rename('index.css'))
  .pipe(gulp.dest('modules/mkit/build'))
}




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

var mkit_build = gulp.series(mkit, mkit_base, mkit_control, mkit_box, mkit_menu);

gulp.task('mkit', mkit_build);


//gulp.task('mkit', ['mkit-base', 'mkit-control']);

//gulp.task('default', ['amalgamation', 'minification']);
