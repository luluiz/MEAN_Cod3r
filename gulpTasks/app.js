//importando o modulo gulp responsável pelo build (fazedor de tarefas)
const gulp = require('gulp');

//importando o modulo gulp-babel responsável pela tradução de comandos ECMAScript2015
//para a versão anterior
const babel = require('gulp-babel');

//importando o modulo gulp-uglify responsável pela redução dos arquivos
const uglify = require('gulp-uglify');

//importando o modulo gulp-htmlmin responsável redução dos arquivos css
const uglifycss = require('gulp-uglifycss');

//importando o modulo gulp-concat responsável pela concatenação dos arquivos em um
const concat = require('gulp-concat');

//importando o modulo gulp-htmlmin responsável redução dos arquivos html
const htmlmin = require('gulp-htmlmin');

//criando as tarefas: sempre que a task app for chamada, mais 4 tasks serão chamadas
gulp.task('app', ['app.html', 'app.css', 'app.js', 'app.assets']);

//declarando a task app.html
gulp.task('app.html', function() {
    gulp.src('angular1/app/**/*.html') //pega todos os arquivos HTML indepedentes de qual
        //subpasta (**) esteja
        .pipe(htmlmin({ collapseWhitespace: true })) //reduz o HTML para deixar o menor possivel
        .pipe(gulp.dest('public')); //copia todos os arquivos HTML para dentro da pasta public
});

//declarando a task app.css
gulp.task('app.css', function() {
    gulp.src('angular1/app/**/*.css') //pega todos os arquivos CSS indepedentes de qual
        //subpasta (**) esteja
        .pipe(uglifycss({ "uglyComments": true })) //reduz o HTML para deixar o menor possivel
        .pipe(concat('app.min.css')) //concatena todos os arquivos CSS para um chamado app.min.css
        .pipe(gulp.dest('public/assets/css')); //copia todos os arquivos CSS para dentro
    //da pasta public/assets/css
});

//declarando a task app.js
gulp.task('app.js', function() {
    gulp.src('angular1/app/**/*.js') //pega todos os arquivos JS indepedentes de qual
        //subpasta (**) esteja
        .pipe(babel({ presets: ['es2015'] })) //converte todos os comandos do ECMAScript2015 para o anterior
        //para evitar incompatibilidade com browsers
        .pipe(uglify()) //reduz o JS para deixar o menor possivel
        .pipe(concat('app.min.js')) //concatena todos os arquivos JS para um unico chamado app.min.js
        .pipe(gulp.dest('public/assets/js')); //copia todos os arquivos JS para dentro
    //da pasta public/assets/js
});

//declarando a task app.assets (imagens e fontes)
gulp.task('app.assets', function() {
    gulp.src('angular1/assets/**/*.*') //pega todos os arquivos de imagens, documentos, indepedentes de qual
        //subpasta (**) esteja
        .pipe(gulp.dest('public/assets')); //copia todos os arquivos estáticos como
    //imagens, documentos e copia para dentro da pasta public/assets
});
