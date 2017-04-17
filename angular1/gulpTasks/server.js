//importando o modulo gulp responsável pelo build (fazedor de tarefas)
const gulp = require('gulp');

//importando o modulo gulp-watch responsável por monitorar as alterações dos
//arquivos gerando o build novamente
const watch = require('gulp-watch');

//importando o modulo gulp-webserver responsável por prover dados estáticos
const webserver = require('gulp-webserver');

//criando as tarefas: sempre que a task server for chamada, um objeto watch
//será criado
gulp.task('server', ['watch'], function() {
    gulp.src('public').pipe(webserver({
        livereload: true, //se houve alterações nas páginas recarrega-as
        port: 4000, //porta onde o servidor vai rodar
        open: true //abre o browser automaticamente
    }));
});

//declarando a task deps.js
gulp.task('watch', function() {
    watch('app/**/*.html', () => gulp.start('app.html')); //se houver alterações html
    //chame somente o app.html
    watch('app/**/*.css', () => gulp.start('app.css')); //se houver alterações CSS
    //chame somente o app.css
    watch('app/**/*.js', () => gulp.start('app.js')); //se houver alterações JS
    //chame somente o app.js
    watch('assets/**/*.*', () => gulp.start('app.assets')); //se houver alterações assets
    //chame somente o app.assets
});
