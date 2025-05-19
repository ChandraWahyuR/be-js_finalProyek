const { nanoid } = require('nanoid');
const { validateBookInput, validateBookEditInput } = require('./utils/error.handler');
const books = require('./books');

const addBookHandler = async (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Eror respons
  const validationResult = validateBookInput(name, readPage, pageCount);
  if (validationResult.error) {
    const response = h.response({
      status: 'fail',
      message: validationResult.message,
    });
    response.code(validationResult.code);
    return response;
  }
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt
  };

  books.push(newBook);
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

// Get all books
const getBookHandler = async (req, h) => {
  const { reading, finished, name } = req.query;
  let filterBooks = [...books];

  // filter parameter untuk 3 (reading dst)
  if (reading !== undefined) {
    filterBooks = filterBooks.filter((book) => book.reading === (reading === '1'));
  }
  if (finished !== undefined) {
    filterBooks = filterBooks.filter((book) => book.finished === (finished === '1'));
  }
  if (name !== undefined) {
    filterBooks = filterBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  const responseBooks = filterBooks.map(({ id, name, publisher }) => ({
    id, name, publisher
  }));
  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};

// Get by ID
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((b) => b.id === id);
  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
  return h.response({
    status: 'success',
    data: { book },
  }).code(200);
};

// Edit
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const validationResult = validateBookEditInput(name, readPage, pageCount);
  if (validationResult.error) {
    return h.response({
      status: 'fail',
      message: validationResult.message,
    }).code(validationResult.code);
  }

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};


// Delete
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};



module.exports = { addBookHandler, getBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };