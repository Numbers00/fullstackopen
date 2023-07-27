const _uniqById = arr => {
  let seen = new Set();
  return arr.filter(obj => seen.has(obj.id) ? false : seen.add(obj.id));
};

export const updateCache = (cache, query, fnName, addedObj) => {
  switch (fnName) {
  case 'allBooks':
    cache.updateQuery(query, ({ allBooks }) => {
      return { allBooks: _uniqById(allBooks.concat(addedObj)) };
    });
    break;
  default: // DO NOTHING
  }
};
