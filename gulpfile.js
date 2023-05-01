const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require('gulp-sass')(require('sass'));
const plumber = require("gulp-plumber");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const {
    stream
} = require("browser-sync");
const browserSync = require('browser-sync').create();
const imagemin = require("gulp-imagemin");
const sourcemaps = require('gulp-sourcemaps');





function compilePug() {
    return gulp.src("./src/pug/**/*.pug")
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}



function CSScompiling() {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(cleanCSS())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            pretty: true
        }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}


function script() {
    return gulp.src("src/js/**/*.js")
        .pipe(uglify())
        .pipe(browserSync.stream())
        .pipe(gulp.dest('build/js'));
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
    return gulp.src([
            "src/img/**/*.{jpg,png,gif,svg}",
            "!src/img/sprites/**/*"
        ])
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(gulp.dest('build/img'));
}

exports.default = gulp.parallel(compilePug, CSScompiling, script, watcher);