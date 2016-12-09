var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('hello', function() {
  console.log('Snow day!');

});

gulp.task('sass', function(){
  return gulp.src('site/assets/css/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/css'))

});
