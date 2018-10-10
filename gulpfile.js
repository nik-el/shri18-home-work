"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var del = require("del");
var server = require("browser-sync").create();
var run = require("run-sequence");
const jsminify = require("gulp-babel-minify");

gulp.task("style", function () {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("docs/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("docs/css"))
    .pipe(server.stream());
});

gulp.task("minify", () =>
  gulp.src("scripts/*.js")
    .pipe(jsminify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest("docs/scripts"))
);

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("docs"));
});

gulp.task("images", function () {
  return gulp.src("image/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('docs/image'));
});

gulp.task("copy", function () {
  return gulp.src([
    "data/**",
  ], {
    base: "."
  })
    .pipe(gulp.dest("docs"));
});

gulp.task("clean", function () {
  return del("docs");
});

gulp.task("serve", function() {
  server.init({
    server: "docs/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]).on("change", server.reload);
});

gulp.task("build", function (done) {
  run("clean", "copy", "style", "minify", "images", "html", done);
});
