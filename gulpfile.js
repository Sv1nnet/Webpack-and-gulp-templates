const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglifyjs'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer');

// Compile scss and sass files to css files to app/css
gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.+(scss|sass)')
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({ stream: true }));
});

// Minify js lib files
gulp.task('scripts', function() {
  return gulp.src(['src/libs/**/*.js'])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

// Minify css libs
gulp.task('css-libs', ['sass'], function() {
  // Then minify css libs
  return gulp.src('src/css/libs.css') // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
    .pipe(gulp.dest('src/css')); // Выгружаем в папку app/css
});

// Sync browser without refreshing the page
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src',
    }
  });
});

// Delete dist folder in order to clean excess files
gulp.task('clean', function() {
  return del('dist');
});

// Clear cache
gulp.task('clear', function() {
  return cache.clearAll();
});

// Optimize images
gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      une: [pngquant()],
    })))
    .pipe(gulp.dest('dist/img'));
});

// Watch changes
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
  gulp.watch('src/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
  gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('src/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

// Build app
gulp.task('build', ['clean', 'img', 'css-libs'], function() {
  // Build lib css files and move them to build folder
  let buildLibCss = gulp.src([
    'src/css/libs.min.css',
  ])
    .pipe(gulp.dest('dist/css'));

  // Build css files and move them to build folder
  let buildCss = gulp.src([
    'src/css/main.css',
  ])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));

  // Move font to build folder
  let buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  // Move js files to build folder
  let buildJs = gulp.src('src/js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  // Move html files to build folder
  let buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

// Start watching and then perform others tasks
gulp.task('default', ['watch']);
