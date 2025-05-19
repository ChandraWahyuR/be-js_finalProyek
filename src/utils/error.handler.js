const validateBookInput = (name, readPage, pageCount) => {
  if (!name) {
    return {
      error: true,
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
      code: 400,
    };
  }

  if (readPage > pageCount) {
    return {
      error: true,
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      code: 400,
    };
  }

  return { error: false };
};

module.exports = { validateBookInput };