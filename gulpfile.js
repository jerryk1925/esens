const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require("browser-sync").create();
const pug = require('gulp-pug');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const del = require("del");
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");

function clean() {
  return del(["./build/"]);
}

function browser(done) {
  browsersync.init({
    server: {
      baseDir: "./build/"
    },
  });
  done();
}

function scripts() {
  return src('./src/assets/js/**/*.js')
  .pipe(dest('./build/js/'))
  .pipe(browsersync.stream());
}

// BrowserSync Reload
// function browserSyncReload(done) {
//   browsersync.reload();
//   done();
// }

function style() {
  return src('./src/assets/styles/main.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(scss({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./build/styles/'))
    .pipe(browsersync.stream());
}

function pugs() {
  return src('./src/pug/pages/**/*.pug')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(pug())
    .pipe(sourcemaps.write())
    .pipe(dest('./build/'))
    .pipe(browsersync.stream());
}

function images() {
  return src("./src/assets/img/**/*")
    .pipe(newer("./build/img"))
    // .pipe(
    //   imagemin([
    //     imagemin.gifsicle({ interlaced: true }),
    //     imagemin.jpegtran({ progressive: true }),
    //     imagemin.optipng({ optimizationLevel: 5 }),
    //     imagemin.svgo({
    //       plugins: [
    //         {
    //           removeViewBox: false,
    //           collapseGroups: true
    //         }
    //       ]
    //     })
    //   ])
    // )
    .pipe(dest("./build/img"));
}

function watchFiles() {
  watch("./src/assets/styles/**/*.scss", style);
  watch("./src/assets/js/**/*.js", scripts);
  watch("./src/pug/**/*.pug", pugs);
  watch("./src/assets/img/**/*", images);
  // series(browserSyncReload)
}


exports.default = series(clean, parallel(style,pugs, scripts, images, watchFiles, browser)) 

