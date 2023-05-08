"use strict";

var gulp = require("gulp");

var pug = require("gulp-pug");

var sass = require('gulp-sass')(require('sass'));

var plumber = require("gulp-plumber");

var autoprefixer = require('gulp-autoprefixer');

var cleanCSS = require('gulp-clean-css');

var babel = require('gulp-babel');

var uglify = require('gulp-uglify');

var _require = require("browser-sync"),
    stream = _require.stream;

var browserSync = require('browser-sync').create();

var imagemin = require("gulp-imagemin");

var sourcemaps = require('gulp-sourcemaps');

function compilePug() {
  return gulp.src("./src/pug/**/*.pug").pipe(pug({
    pretty: true
  })).pipe(gulp.dest('./')).pipe(browserSync.stream());
}

function CSScompiling() {
  return gulp.src("./src/scss/**/*.scss").pipe(cleanCSS()).pipe(plumber()).pipe(sourcemaps.init()).pipe(sass({
    pretty: true
  }).on("error", sass.logError)).pipe(autoprefixer()).pipe(plumber.stop()).pipe(sourcemaps.write()).pipe(gulp.dest('build/css')).pipe(browserSync.stream());
}

function script() {
  return gulp.src("src/js/**/*.js").pipe(uglify()).pipe(browserSync.stream()).pipe(gulp.dest('build/js'));
}

function liveserver() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}

function watcher() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('src/pug/**/*.pug', compilePug);
  gulp.watch('src/js/main.js', script);
  gulp.watch('src/scss/**/*scss', CSScompiling);
  gulp.watch('build/*.html').on('change', liveserver);
  gulp.watch('src/img/**/*.{jpg,png,gif,svg}', imageCompressing);
  gulp.watch('src/js', script);
}

function imageCompressing() {
  return gulp.src(["src/img/**/*.{jpg,png,gif,svg}", "!src/img/sprites/**/*"]).pipe(imagemin([imagemin.gifsicle({
    interlaced: true
  }), imagemin.mozjpeg({
    quality: 75,
    progressive: true
  }), imagemin.optipng({
    optimizationLevel: 5
  }), imagemin.svgo({
    plugins: [{
      removeViewBox: true
    }, {
      cleanupIDs: false
    }]
  })])).pipe(gulp.dest('build/img'));
}

exports["default"] = gulp.parallel(compilePug, CSScompiling, script, watcher);