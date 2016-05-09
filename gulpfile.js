var gulp = require("gulp");
var gutil = require("gulp-util");
var nodemon = require("gulp-nodemon");
var babel = require("gulp-babel");
var cleanCSS = require('gulp-clean-css');

gulp.task('default',['start-backend-dev'], function () {

});


gulp.task('es6',function(){
	gulp.src("server/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});


gulp.task('compileJS',function(){
	var stream = gulp.src('./src/**/*.js') // your ES2015 code
	.pipe(babel()) // compile new ones
	.pipe(gulp.dest('./dist')); // write them
	 return stream; // important for gulp-nodemon to wait for completion
})
gulp.task('compileCSS',function(){
	return gulp.src('src/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
})

gulp.task("start-backend-dev", ['compileJS','compileCSS'], function(){
	var stream =nodemon({
		script: 'dist/server/server.js',
		watch: 'src' ,
		tasks: ['compileJS','compileCSS'],
		env: {
			'NODE_ENV': 'development'
		}
	});
	return stream;
})
