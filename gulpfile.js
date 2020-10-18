const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const babel = require('gulp-babel');

function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%']
        }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(dest('dist'))
}

function js() {
    return src('src/components/**.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(dest('dist'))
}

function img() {
    return src('src/images/**.png')
        .pipe(dest('dist/images'))
}

function fonts() {
    return src('src/vendor/**.+(woff|foff2)')
        .pipe(dest('dist/css'))
}

function css() {
    return src('src/vendor/**.css')
        .pipe(dest('dist/css'))
}

function clear() {
    return del('dist')
}

function serve() {
    sync.init({
        server: './dist'
    })

    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
    watch('src/components/**.js', series(js)).on('change', sync.reload)
    watch('src/images/**.png', series(img)).on('change', sync.reload)
    watch('src/vendor/**.css', series(css)).on('change', sync.reload)
    watch('src/vendor/**.+(woff|foff2)', series(fonts)).on('change', sync.reload)
}


exports.build = series(clear, scss, css, html, img, js, fonts)
exports.serve = series(clear, scss, css, html, img, js, fonts, serve)
exports.clear = clear
