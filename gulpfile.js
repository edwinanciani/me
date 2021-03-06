var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var ghPages = require('gulp-gh-pages');

gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('css'));
});

gulp.task('styles', ['fonts', 'sass'], function() {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'css/ionicons.min.css',
		'node_modules/materialize-css/dist/css/materialize.css',
		'css/main.css'
	])
		.pipe(concat('all.css'))
		.pipe(rename('all.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('css'))
		.pipe(connect.reload());
});

gulp.task('fonts', function() {
	gulp.src('fonts/*')
		.pipe(gulp.dest('fonts'));
});

gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/materialize-css/dist/js/materialize.js',
		'scripts/**/*.js'
	])
		.pipe(concat('all.js'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'))
		.pipe(connect.reload());
});

gulp.task('html', function() {
	gulp.src('index.html')
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('index.html', ['html']);
	gulp.watch('scripts/**/*.js', ['scripts']);
	gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('connect',['watch'], function() {
	connect.server({ livereload: true });
});

gulp.task('deploy', ['scripts', 'styles'], function() {
	gulp.src([
		'js/all.min.js',
		'css/all.min.css',
		'img/*',
		'fonts/*',
		'index.html'
	], { base: './dist/' })
		.pipe(ghPages({
			remoteUrl:'git@github.com:edwinanciani/edwinanciani.github.io.git',
			origin:'origin',
			branch:'master'
		}));
});

gulp.task('test', ['scripts', 'styles'], function() {
	gulp.src([
		'js/all.min.js',
		'css/all.min.css',
		'img/*',
		'fonts/*',
		'index.html',
		'favicon.ico'
	], { base: './' })
		.pipe(
			ghPages());
});

gulp.task('default', ['connect', 'watch', 'scripts', 'styles']);
