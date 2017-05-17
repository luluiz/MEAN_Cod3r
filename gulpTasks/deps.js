//importando o modulo gulp responsável pelo build (fazedor de tarefas)
const gulp = require('gulp');

//importando o modulo do gulp uglify de redução de arquivos js
const uglify = require('gulp-uglify');

//importando o modulo do gulp uglifycss de redução de arquivos css
const uglifycss = require('gulp-uglifycss');

//importando o modulo do gulp concat de concatenação de arquivos
const concat = require('gulp-concat');

//criando as tarefas: sempre que a task deps for chamada, mais 3 tasks serão
//chamadas
gulp.task('deps', ['deps.js', 'deps.css', 'deps.fonts']);

//declarando a task deps.js
gulp.task('deps.js', function() {
    gulp.src([ //array de arquivos para chamada de depedências js do projeto
            'node_modules/angular/angular.min.js',
            'node_modules/angular-ui-router/release/angular-ui-router.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
            'node_modules/admin-lte/plugins/jQuery/jquery-2.2.3.min.js',
            'node_modules/admin-lte/bootstrap/js/bootstrap.min.js',
            'node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
            'node_modules/admin-lte/dist/js/app.min.js'
        ])
        .pipe(uglify()) //reduzir o arquivo ao máximo tirando espaços e reduzindo nomes de variáveis
        .pipe(concat('deps.min.js')) //concatena todos os arquivos num unico chamado deps.min.js
        .pipe(gulp.dest('public/assets/js')); //copia o arquivo deps.min.js para dentro
    //da pasta informada entre aspas simples
});

//declarando a task deps.css
gulp.task('deps.css', function() {
    gulp.src([
            'node_modules/angular-toastr/dist/angular-toastr.min.css',
            'node_modules/font-awesome/css/font-awesome.min.css',
            'node_modules/admin-lte/bootstrap/css/bootstrap.min.css',
            'node_modules/admin-lte/dist/css/AdminLTE.min.css',
            'node_modules/admin-lte/dist/css/skins/_all-skins.min.css'
        ])
        .pipe(uglifycss({ "uglyComments": true })) //reduzir o css juntamente com os comentários
        .pipe(concat('deps.min.css')) //concatena todos os arquivos num unico chamado deps.min.css
        .pipe(gulp.dest('public/assets/css')); //copia o arquivo deps.min.css para dentro
    //da pasta informada entre aspas simples
});

//declarando a task deps.fonts
gulp.task('deps.fonts', function() {
    gulp.src([
            'node_modules/font-awesome/fonts/*.*',
            'node_modules/admin-lte/bootstrap/fonts/*.*'
        ])
        .pipe(gulp.dest('public/assets/fonts')); //copia os arquivos de fontes para dentro
    //da pasta informada entre aspas simples
});
