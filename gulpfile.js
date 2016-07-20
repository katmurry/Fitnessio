var gulp = require('gulp');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Static Server + watching scss/html files
gulp.task('serve', function() {
  browserSync({
    server: './',
    open: false
  });
});

// Reload any html files
gulp.task('html', function() {
  return gulp.src('./*.html')
    .pipe(reload({
      stream: true
    }));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('./assets/scss/*.scss')
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded',
    }))
    .pipe(prefix({
      browsers: ['last 6 versions', 'ie 8'],
      cascade: false
    }))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(reload({
      stream: true
    }))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/tiny/'))
    .pipe(reload({
      stream: true
    }));
});

// Optimize and rename images with .min added
gulp.task('images', function() {
  return gulp.src(['./assets/images/*', '!./assets/images/*.min.*'])
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{
      removeViewBox: false
    }],
    use: [pngquant()]
  }))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./assets/tiny/'));
});

// Default task to start the server and watch files
gulp.task('default', ['serve', 'html', 'sass', 'images'], function() {
  gulp.watch('./*.html').on('change', reload);
  gulp.watch('./assets/scss/*.scss', ['sass']);
  gulp.watch('./assets/scss/*.scss').on('change', reload);
});
