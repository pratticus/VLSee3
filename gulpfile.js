var gulp = require('gulp');

var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

/* CSS Libraries */
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');

/* JS Libraries*/
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

//SASS processing
gulp.task('sass', function(){
  return gulp.src('site/assets/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('site/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('default', function(callback){
  runSequence(['sass','browserSync','watch'], callback)

})
//watch function
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('site/assets/scss/**/*.scss', ['sass']);
  gulp.watch('site/assets/images/**/*.+(png|jpg|jpeg|gif|svg)', browserSync.reload);
  gulp.watch('site/**/*.html', browserSync.reload);
  gulp.watch('site/assets/js/**/*.js', browserSync.reload);
});

//browser sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'site'
    },
  })
});

//consolidating and minifying css and js files
/*gulp.task('useref', function() {
  return gulp.src('site/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulp.dest('dist'));

});*/

gulp.task('sexyCSS', function(){
  return gulp.src('site/assets/scss/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(uncss({
			html: ['site/*.html']//,
			//ignore: [/alertPrompt/, /form-wrapper ol/, /browserCheckResults/, /error fail/, /defaultNoJs/]
		}))
		.pipe(cssnano())
	    .pipe(sourcemaps.write('maps'))
	    .pipe(gulp.dest('dist/assets/css')) // Outputs it in the css folder

})
gulp.task('fatJS', function(){
  return gulp.src('site/*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify({mangle: false})))
      .pipe(gulp.dest('dist'));
})
gulp.task('skinnyJS', function(){
  return gulp.src('site/*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify({mangle: false})))
      .pipe(gulp.dest('dist'));
})
//image Optimization
gulp.task('images', function(){
  return gulp.src('site/assets/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced:true
  })))
  .pipe(gulp.dest('dist/assets/images'))
})

//font consolidation
gulp.task('fonts', function(){
  return gulp.src('site/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))
})

//cleaning up files
gulp.task('clean:dist', function(){
  return del.sync('dist');
})

//clear cached files
gulp.task('cache:clear', function(callback){
  return cache.clearAll(callback)
})

gulp.task('build', function(callback){
  //runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback)
  runSequence('clean:dist', ['sexyCSS','fatJS','skinnyJS','images','fonts'], callback)
})
