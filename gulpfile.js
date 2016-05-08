var gulp = require("gulp");
var gutil = require("gulp-util");
// var webpack = require("webpack");

// var WebpackDevServer = require("webpack-dev-server");
// var webpackConfig = require("./webpack.config.development.js");

gulp.task('default',['start-backend-dev'], function () {

});


gulp.task("start-backend-dev", function(){
	var nodemon = require("gulp-nodemon");
	nodemon({
		script: 'server.js'
		, ext: 'js html'
		, env: {
			'NODE_ENV': 'development'
		}
	});
})
