/**
 * Created by merk on 07.11.16.
 */


var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    ts      = require('gulp-typescript');



gulp.task("default", function () {

    gulp.watch('src/typescript/*.ts', ['build']);
});


gulp.task('build', function () {

    return gulp.src('src/typescript/*.ts')
        .pipe(ts())
        .pipe(concat('mediaPlayer.js'))
        .pipe(gulp.dest('src/build/'));

});

gulp.task('minify', function () {

    return gulp.src('src/build/*.js')
        .pipe(uglify())
        .pipe(concat('mediaPlayer.min.js'))
        .pipe(gulp.dest('src/build/min/'));

});