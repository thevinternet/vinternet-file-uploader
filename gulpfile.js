// Gulp Config: The Vinternet - File Uploader

// Modules (https://www.npmjs.com/package/)
const gulp = require('gulp');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const merge = require('merge-stream')
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const deporder = require('gulp-deporder');
const stripdebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const watch = require ('gulp-watch');
const nodemon = require('gulp-nodemon');

// Development Mode Flag
const devBuild = (process.env.NODE_ENV !== 'production');

// Folders
const src = 'src/';
const build = 'build/';

// Clean Up Build Directory (glup-clean)
gulp.task('clean', () => {
  return gulp.src(build, {read: false})
    .pipe(clean());
});

// File Changes Task (gulp-changed)
gulp.task('changes', () =>
  gulp.src(src)
    .pipe(changed(build))
    .pipe(gulp.dest(build))
);

// Root Files Deployment
gulp.task('root', () =>
gulp.src(src + '*.*')
  .pipe(changed(build))
  .pipe(gulp.dest(build))
);

// Pug To HTML Task (gulp-pug)
gulp.task('pug', function buildHTML(done){
 gulp.src(src + 'templates/views/*')
    .pipe(pug({
      doctype: 'html',
      pretty: false
    }))
    .pipe(gulp.dest(build))
    done();
});

// Image Optimisation (gulp-imagemin)
gulp.task('images', () =>
  gulp.src(src + 'images/**/*')
    .pipe(changed(build + 'images/'))
    .pipe(imagemin())
    .pipe(gulp.dest(build + 'images/'))
);

// CSS Optimisation (gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker cssnano)
gulp.task('css', gulp.series('images', (done) => {
  const postCssOpts = [
    assets({ loadPaths: ['images/'] }),
    autoprefixer(),
    mqpacker
  ];
  postCssOpts.push(cssnano);

  const sanitize = gulp.src('node_modules/sanitize.css/sanitize.css');

  const scss = gulp.src(src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }).on('error', sass.logError));

  return merge(sanitize, scss)
    .pipe(postcss(postCssOpts))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(build + 'css/'))
     done();
}));

// JavaScript Optimisation (gulp-babel gulp-deporder gulp-concat gulp-strip-debug gulp-uglify)
gulp.task('javascript', () => {
  const jsbuild = gulp.src(src + 'js/**/*')
    .pipe(babel({
        presets: [['@babel/preset-env']]
    }))
    .pipe(deporder())
    .pipe(concat('main.js'))
    .pipe(stripdebug())
    .pipe(uglify())

  return jsbuild.pipe(gulp.dest(build + 'js/'));
});

// Watch Task (gulp-watch)
gulp.task('watch', (done) => {
  gulp.watch(src + 'images/**/*', gulp.parallel('images'));
  gulp.watch(src + '*.*', gulp.parallel('root'));
  gulp.watch(src + 'templates/**/*', gulp.parallel('pug'));
  gulp.watch(src + 'scss/**/*', gulp.parallel('css'));
  gulp.watch(src + 'js/**/*', gulp.parallel('javascript'));
  done();
});

// Server Task (gulp-nodemon)
gulp.task('server', (done) => {
  const stream = nodemon({
    script: 'server.js',
    ignore: ['ignored.js']
  })

  stream
    .on('restart', (done) => {
      console.log('restarted!');
      //done();
    })
    .on('crash', (done) => {
      console.error('Application has crashed!\n')
      stream.emit('restart', 10)  // restart the server in 10 seconds
      done();
    })
  done();
});

// ********** BUILD TASKS ********** //

// Clean Build Directory & Run All Asset Compilation Tasks
gulp.task('compile', gulp.series('root', 'pug', 'css', 'javascript'));

// Clean Build Directory & Run Local Build - Compile, Server & Watch Tasks
gulp.task('local', gulp.series('compile', 'server', 'watch'));

// Clean Build Directory & Run Heroku Build - Compile, JavaScript & Server Tasks
gulp.task('build', gulp.series('compile', 'server'));
