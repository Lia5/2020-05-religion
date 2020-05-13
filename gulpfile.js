var syntax        = 'scss'; // Syntax: sass or scss;

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		gcmq      = require('gulp-group-css-media-queries'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		sourcemaps = require('gulp-sourcemaps'),
		pug		  = require('gulp-pug');
		// rsync         = require('gulp-rsync');

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'myapp'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
  });

gulp.task('styles', function() {
	return gulp.src('myapp/'+syntax+'/**/*.'+syntax+'')
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(gcmq())
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('myapp/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'myapp/libs/1.jquery/dist/jquery.min.js',
		// 'myapp/libs/intl-tel-input/js/utils.js',
		// 'myapp/libs/intl-tel-input/js/intlTelInput.js',
		'myapp/libs/3.mask/jquery.maskedinput.min.js',
		'myapp/libs/preload/preload.js',
		// 'myapp/libs/2.slick/slick.js',
		// 'myapp/libs/owlcarousel/dist/owlcarousel.js',
		// 'myapp/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('myapp/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('pug', function() {
	// gulp.src('myapp/pug/**/*.pug')
	// 	.pipe(browserSync.stream())
	return gulp.src('myapp/pug/pages/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('myapp/'))
		.pipe(browserSync.stream())

});

// gulp.task('pug2', function(done) {
// 	// gulp.src('myapp/pug/**/*.pug')
// 	// 	.pipe(browserSync.stream())
// 	return gulp.src('myapp/pug/**/*.pug')
// 		.pipe(gulp.dest('myapp/'))
// 	done();
// });

// gulp.task('rsync', function() {
// 	return gulp.src('myapp/**')
// 	.pipe(rsync({
// 		root: 'myapp/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

gulp.task('watch', gulp.parallel('styles', 'js', 'pug', 'browser-sync', function() {
	gulp.watch('myapp/'+syntax+'/**/*.'+syntax+'', gulp.series('styles'));
	gulp.watch('myapp/'+syntax+'/**/*.+(scss|sass)', gulp.series('styles'));
	gulp.watch(['libs/**/*.js', 'myapp/js/common.js'], gulp.series('js'));
	gulp.watch('myapp/pug/**/*.pug', gulp.series('pug'));

	gulp.watch('myapp/*.html', browserSync.reload)

}));

gulp.task('default', gulp.series('watch'));
