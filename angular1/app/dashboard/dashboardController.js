//retirando a declaração do controller do escopo global e atribuindo a uma função
//seguindo boas práticas de John Papa
(function() {
    //declaração do controller do DashboardCtrl
    angular.module('primeiraApp').controller('DashboardCtrl', [
        '$http', //injeção de depedência
        DashboardController //chamada da função declarada abaixo
    ]);

    //declarando a função do controller
    function DashboardController($http) {
        //vm recebe o objeto da propria função dentro do escopo
        const vm = this;

        //função que faz uma requisição http para a API Rest do backend
        //para obter o summario de todos os pagamentos da aplicação
        vm.getSummary = function() {
            //constante que aponta para a URL da API
            const url = 'http://localhost:3003/api/billingSummary';

            //se a requisição retornar com sucesso é chamada a função
            $http.get(url).then(function(response) {
                //constante que recebe os valores vindo da resposta da requisição
                //através do parametro data do response
                const { credit = 0, debt = 0 } = response.data;
                //destructured
                vm.credit = credit; //atribuindo os valores recebidos da requisição
                vm.debt = debt; //para a constante vm
                vm.total = credit - debt;
            });
        };
        //função chamada sempre que o controller fizer uma requisição get
        vm.getSummary();
    }
})();
