const routes = require('./routes');
const Hapi = require('@hapi/hapi');
// const connectDB = require('./db/connect');
// require('dotenv').config();


const init = async () => {
  // const alamat = process.env.MONGO_URI;
  // await connectDB(alamat);

  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes:{
      cors: {
        origin: ['*'],
      }
    }
  });
  server.route(routes);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();