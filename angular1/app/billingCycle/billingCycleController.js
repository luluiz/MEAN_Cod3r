//retirando a declaração do controller do escopo global e atribuindo a uma função
//seguindo boas práticas de John Papa
(function() {
    //declaração do controller do BillingCycleCtrl
    angular.module('primeiraApp').controller('BillingCycleCtrl', [
        '$http', //injeção de depedência
        '$location', //injeção de depedência
        'msgs', //injeção de depedência
        'tabs', //injeção de depedência
        BillingCycleController //referência da função declarada abaixo
    ]);

    //declarando a função do controller
    function BillingCycleController($http, $location, msgs, tabs) {
        //vm recebe o objeto da propria função dentro do escopo
        const vm = this;
        //constante que aponta para a URL da API
        const url = 'http://localhost:3003/api/billingCycles';

        //reseta o cadastro e zera o ciclo de pagamentos
        vm.refresh = function() {
            //atribuindo a paginação para a constante page
            //onde se for inválido pegue por padrão a página 1
            const page = parseInt($location.search().page) || 1;

            //recuperando os registros do banco de dados de 8 em 8
            $http.get(`${url}?skip=${(page - 1) * 8}&limit=8`).then(function(response) {
                vm.billingCycle = { credits: [{}], debts: [{}] }; //zerando o atributo billingCycle
                vm.billingCycles = response.data; //resposta obtida do get feita na url que retorna um array de ciclos de pagamentos
                vm.calculateValues(); //chamada à função de cálculos dos valores

                //paginando os elementos do banco
                $http.get(`${url}/count`).then(function(response) {
                    //armazenando a quantidade de páginas que serão exibidas
                    //através da função matematica que divide o valor por 8 e o metodo ceil arredonda o valor
                    vm.pages = Math.ceil(response.data.value / 8);
                    tabs.show(vm, { tabList: true, tabCreate: true }); //passando os estados das abas ativadas
                });
            });
        };

        //função que faz uma requisição http para a API Rest do backend
        //para obter criar de todos os pagamentos da aplicação
        vm.create = function() {
            //se a requisição retornar com sucesso é chamada a função
            $http.post(url, vm.billingCycle).then(function(response) {
                vm.refresh(); //chamada à função de atualizar os ciclos de pagamentos
                msgs.addSuccess('Inserção realizada com sucesso!!');
                //se retornar erro
            }).catch(function(response) {
                msgs.addError(response.data.errors);
            });
        };

        //função que recebe como parametro o objeto selecionado
        vm.showTabView = function(billingCycle) {
            vm.billingCycle = billingCycle; //variavel do controle recebe o parametro que form vai ler
            vm.calculateValues(); //chamada à função de cálculos dos valores
            tabs.show(vm, { tabView: true }); //mostrando somente a tabUpdate
        };

        //função que recebe como parametro o objeto selecionado
        vm.showTabUpdate = function(billingCycle) {
            vm.billingCycle = billingCycle; //variavel do controle recebe o parametro que form vai ler
            vm.calculateValues(); //chamada à função de cálculos dos valores
            tabs.show(vm, { tabUpdate: true }); //mostrando somente a tabUpdate
        };
        //função que recebe como parametro o objeto selecionado
        vm.showTabDelete = function(billingCycle) {
            vm.billingCycle = billingCycle; //variavel do controle recebe o parametro que form vai ler
            vm.calculateValues(); //chamada à função de cálculos dos valores
            tabs.show(vm, { tabDelete: true }); //mostrando somente a tabDelete
        };

        //função que visualiza os dados da linha selecionada
        vm.view = function() {
            //declarando a const que conterá a url do backend juntamente com o _id do elemento a ser visualizado
            const viewUrl = `${url}/${vm.billingCycle._id}`;
            //passagem de dados para a visualização com sucesso do elemento
            $http.get(viewUrl, vm.billingCycle);
        };

        //função que altera os dados da linha selecionada
        vm.update = function() {
            //declarando a const que conterá a url do backend juntamente com o _id do elemento a ser alterado
            const updateUrl = `${url}/${vm.billingCycle._id}`;
            //passagem de dados para a alteração com sucesso do elemento
            $http.put(updateUrl, vm.billingCycle).then(function(response) {
                vm.refresh(); //volte para lista e inclusão
                msgs.addSuccess('Alteração realizada com sucesso!');
            }).catch(function(response) { //caso dê erro retorna a msg de erro
                msgs.addError(response.data.errors);
            });
        };

        //função que deleta os dados da linha selecionada
        vm.delete = function() {
            //declarando a const que conterá a url do backend juntamente com o _id do elemento a ser excluido
            const deleteUrl = `${url}/${vm.billingCycle._id}`;
            //passagem de dados para a exclusão com sucesso do elemento
            $http.delete(deleteUrl, vm.billingCycle).then(function(response) {
                vm.refresh(); //volte para lista e inclusão
                msgs.addSuccess('Exclusão realizada com sucesso!');
            }).catch(function(response) { //caso dê erro retorna a msg de erro
                msgs.addError(response.data.errors);
            });
        };

        //função que adiciona os créditos utilizando um metodo chamado splice
        //recebendo como parâmetro o index do objeto clicado
        vm.addCredit = function(index) {
            //splice adiciona no index mais um elemento logo abaixo do clicado,
            //não remove nada e adiciona um elemento vazio
            vm.billingCycle.credits.splice(index + 1, 0, {});
        };

        //função que clona os créditos utilizando o metodo splice
        //recebendo como parâmetro o index do objeto clicado e os campos obrigatórios do documento no mongoDB
        vm.cloneCredit = function(index, { name, value }) {
            //splice adiciona no index mais um elemento logo abaixo do clicado,
            //não remove nada e clona o objeto com as chaves {name, value}
            vm.billingCycle.credits.splice(index + 1, 0, { name, value });
            vm.calculateValues(); //chamada à função de cálculos dos valores
        };

        //função que clona os créditos utilizando o metodo splice
        //recebendo como parâmetro o index do objeto clicado e os campos obrigatórios do documento no mongoDB
        vm.deleteCredit = function(index) {
            //para excluir elementos tem que ter pelo menos dois pois senão
            //os botoes de adição, clone e exclusão desaparecem
            if (vm.billingCycle.credits.length > 1) {
                //splice, no index atual, remove o elemento
                vm.billingCycle.credits.splice(index, 1);
                vm.calculateValues(); //chamada à função de cálculos dos valores
            } else { //se só tem um elemento
                //splice, no index atual, remove o elemento
                vm.billingCycle.credits.splice(index, 1);
                //e adicionar um novo elemento vazio para os botoes nao sumirem
                vm.billingCycle.credits.splice(index, 0, {});
                vm.calculateValues(); //chamada à função de cálculos dos valores
            }
        };

        //função que adiciona os débitos utilizando um metodo chamado splice
        //recebendo como parâmetro o index do objeto clicado
        vm.addDebt = function(index) {
            //splice adiciona no index mais um elemento logo abaixo do clicado,
            //não remove nada e adiciona um elemento vazio
            vm.billingCycle.debts.splice(index + 1, 0, {});
        };

        //função que clona os débitos utilizando o metodo splice
        //recebendo como parâmetro o index do objeto clicado e os campos obrigatórios do documento no mongoDB
        vm.cloneDebt = function(index, { name, value, status }) {
            //splice adiciona no index mais um elemento logo abaixo do clicado,
            //não remove nada e clona o objeto com as chaves {name, value, status}
            vm.billingCycle.debts.splice(index + 1, 0, { name, value, status });
            vm.calculateValues(); //chamada à função de cálculos dos valores
        };

        //função que clona os débitos utilizando o metodo splice
        //recebendo como parâmetro o index do objeto clicado e os campos obrigatórios do documento no mongoDB
        vm.deleteDebt = function(index) {
            //para excluir elementos tem que ter pelo menos dois pois senão
            //os botoes de adição, clone e exclusão desaparecem
            if (vm.billingCycle.debts.length > 1) {
                //splice, no index atual, remove o elemento
                vm.billingCycle.debts.splice(index, 1);
                vm.calculateValues(); //chamada à função de cálculos dos valores
            } else { //se só tem um elemento
                //splice, no index atual, remove o elemento
                vm.billingCycle.debts.splice(index, 1);
                //e adicionar um novo elemento vazio para os botoes nao sumirem
                vm.billingCycle.debts.splice(index, 0, {});
                vm.calculateValues(); //chamada à função de cálculos dos valores
            }
        };

        //declarando a função de cálculo de valores
        vm.calculateValues = function() {
            vm.credit = 0; //definindo as variáveis iguais a 0
            vm.debt = 0;

            //se valores válidos
            if (vm.billingCycle) {
                //para cada extração de value via destructured dos créditos
                vm.billingCycle.credits.forEach(function({ value }) {
                    //atribuição aditiva via expressão ternária onde
                    //se o valor não existir (!value) ou não for um numero (isNaN) retorna 0 como padrão
                    //caso contrário, faz um parse double do valor ou seja transforma em um numero float
                    vm.credit += !value || isNaN(value) ? 0 : parseFloat(value);
                });

                //para cada extração de value via destructured dos débitos
                vm.billingCycle.debts.forEach(function({ value }) {
                    //atribuição aditiva via expressão ternária onde
                    //se o valor não existir (!value) ou não for um numero (isNaN) retorna 0 como padrão
                    //caso contrário, faz um parse double do valor ou seja transforma em um numero float
                    vm.debt += !value || isNaN(value) ? 0 : parseFloat(value);
                });
            }

            vm.total = vm.credit - vm.debt;
        };

        vm.refresh(); //chamada à função de atualizar os ciclos de pagamentos
    }
})();
