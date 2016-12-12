var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulf-if');

//SASS processing
gulp.task('sass', function(){
  return gulp.src('site/assets/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('site/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//watch function
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('site/assets/scss/**/*.scss', ['sass']);
  gulp.watch('site/assets/images/**/*.+(png|jpg|jpeg|gif|svg)', browserSync.reload);
  gulp.watch('site/**/*.html', browserSync.reload);
  gulp.watch('site/assets/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'site'
    },
  })
});

gulp.task('useref', function() {
  return gulp.src('site/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))

});
