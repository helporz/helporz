var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src(['./scss/ionic.app.scss', './scss/app/app.scss', './scss/im/im.scss', './scss/hoicons/hoicons.scss'])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// 将www代码混淆并复制到手机对应的文件夹
// [[
gulp.task('transport-ios', function () {
  transport('ios');
});
gulp.task('transport-android', function () {
  transport('android');
});

function transport(pf) {
  var dest;
  if (pf == 'ios') {
    dest = 'platforms/ios/www';
  } else if (pf == 'android') {
    dest = 'platforms/android/assets/www';
  } else {
    //process.stdout.write('invalid platform\n');
  }

  //gulp.src('www/**/*.js')
  //  .pipe(uglify({
  //    output: {
  //      max_line_len: 1000000
  //    }
  //  }))
  //  .pipe(gulp.dest(dest));

  gulp.src('www/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dest+'/js'));

  gulp.src('www/modules/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dest+'/modules'));

  //gulp.src('src/www/**/*.html')
  //  .pipe(gulp.dest('www'));
}
// ]]


// test code:
gulp.task('test-trans', function() {
  gulp.src('src/www/**/*.js')
    .pipe(gulp.dest('www'));
})
