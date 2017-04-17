//modulo para expor a api para a aplicação
const restful = require('node-restful');

//manipulação do banco de dados mongodb
const mongoose = restful.mongoose;

//Mapeamento de como será armazenado o credito no mongodb
const creditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Informe o Nome do Crédito!']
  },
  value: {
    type: Number,
    min: 0,
    required: [true, 'Informe o valor do Crédito!']
  }
});

//Mapeamento de como será armazenado o debito no mongodb
const debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Informe o nome do Débito!']
  },
  value: {
    type: Number,
    min: 0,
    required: [true, 'Informe o valor do débito!']
  },
  status: {
    type: String,
    required: [false, 'Informe o Status do débito!'],
    uppercase: false,
    enum: ['PAGO', 'PENDENTE', 'AGENDADO']
  }
});

//Mapeamento do schema do ciclo de pagamento e validação dos atributos
const billingCycleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Informe o Nome!']
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: [true, 'Informe o Mês!']
  },
  year: {
    type: Number,
    min: 1970,
    max: 2500,
    required: [true, 'Informe o Ano!']
  },
  credits: [creditSchema], //array de créditos apontando para o esquema do créditos
  debts: [debtSchema] //array de débitos apontando para o esquema do débitos
});

//exportando o model BillingCycle do schema billingCycleSchema
module.exports = restful.model('BillingCycle', billingCycleSchema);
