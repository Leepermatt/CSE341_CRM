const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My CRM API',
    description: 'CRM API'
  },
  host: 'cse341-crm.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);