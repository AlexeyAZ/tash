var gulp = require('gulp'),
    watch = require('gulp-watch'), // альтернативный вариант слежения //
    prefixer = require('gulp-autoprefixer'), // вендорные префиксы //
    uglify = require('gulp-uglify'), // сжатие JS //
    less = require('gulp-less'), // компиляция less в css //
    sourcemaps = require('gulp-sourcemaps'), // sourcemaps для css //
    rigger = require('gulp-rigger'), // импорт одного файла в другой //
    imagemin = require('gulp-imagemin'), // сжатие изображений //
    pngquant = require('imagemin-pngquant'), // сжатие png изображений //
    del = require('del'), // права на удаление папок и файлов //
    connect = require('gulp-connect'), // локальный сервер //
    cssnano = require('gulp-cssnano'), // сжатие css //
    pump = require('pump')
;

//Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
//Синтаксис src/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов

var path = {
    //Готовые после сборки файлы
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        other: 'build/'
    },
    //Пути откуда брать исходники
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        less: 'src/less/style.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: ['src/*.json', 'src/*.ico']
    },
    //За изменением каких файлов необходимо наблюдать
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        less: 'src/less/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: ['src/*.json', 'src/*.ico']
    },
    clean: './build'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
});

gulp.task('js:build', function (cb) {
    pump([
        gulp.src(path.src.js), //Найдем наш main файл
            rigger(), //Прогоним через rigger
            sourcemaps.init(), //Инициализируем sourcemap
            uglify(), //Сожмем наш js
            sourcemaps.write(), //Пропишем карты
            gulp.dest(path.build.js) //Выплюнем готовый файл в build
    ],
    cb
  );
});

gulp.task('less:build', function () {
    gulp.src(path.src.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('other:build', function () {
    gulp.src(path.src.other)
        .pipe(gulp.dest(path.build.other))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'less:build',
    'fonts:build',
    'image:build',
    'other:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.less], function(event, cb) {
        gulp.start('less:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch(path.watch.other, function(event, cb) {
        gulp.start('other:build');
    });
});

gulp.task('clean', function (cb) {
    del(path.clean, cb);
});

gulp.task('connect', function() {
  connect.server({
    port: 8888
  });
});

gulp.task('default', ['build', 'connect', 'watch']);
