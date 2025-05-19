// const bookController = require('./books.handler');
const bookController = require('./handler');

const route = {
  '/books': {
    GET: bookController.getBookHandler,
    POST: bookController.addBookHandler,
  },
  '/books/{id}': {
    GET: bookController.getBookByIdHandler,
    DELETE: bookController.deleteBookByIdHandler,
    PUT: bookController.editBookByIdHandler,
  },
};

const routes = [];

for (const path in route) {
  const methods = route[path];
  for (const method in methods) {
    routes.push({
      method: method,
      path: path,
      handler: methods[method],
    });
  }
}

module.exports = routes;
