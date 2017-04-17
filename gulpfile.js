//importando o modulo gulp responsável pelo build (fazedor de tarefas)
const gulp = require('gulp');

//importando o modulo gulp-util
const util = require('gulp-util');

const runSequence = require('run-sequence');

const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins({
  rename: {
    'gulp-angular-templatecache': 'templateCache'
  }
});

const _ = require('lodash');

//importando as gulpTasks criadas no modulo (arquivo) deps.js
require('./angular1/gulpTasks/app');
require('./angular1/gulpTasks/deps');
require('./angular1/gulpTasks/server');

gulp.task('nodemon', function() {
  return plugins.nodemon({
    script: 'loader.js',
    nodeArgs: ['--debug'],
    ext: 'js, html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

//declaração da task padrão sempre que for executado o comando gulp no console
gulp.task('default', function() {
  if (util.env.production) { //se a chamada do gulp conter a flag production
    gulp.start('deps', 'app'); //chama duas tasks: deps e app
  } else { //se for chamada para o desenvolvimento
    // gulp.start('deps', 'app', 'server'); //iniciar as tres tasks: deps, app e server
    runSequence('deps', 'app', 'server', 'nodemon', done);
  }
});
