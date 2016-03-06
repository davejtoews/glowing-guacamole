//gulpfile.js

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts', function(){
	return gulp.src('public/src/scripts/*.js')
		.pipe(concat('main.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('public/dest/scripts'));
});
gulp.task('sass', function(){
	return sass('public/src/styles/main.scss', {style: 'expanded'})
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dest/styles'));
});
gulp.task('watch', function(){
	gulp.watch('public/src/styles/*.scss', ['sass']);
});



gulp.task('default', ['sass', 'watch']);