const omit = require('lodash/omit');

const advancedResult = (model, populate) => async (req, res, next) => {
  //excluding 'select', 'sort', 'page', 'limit'from query object using omit function from lodash
  const reqQuery = omit(req.query, ['select', 'sort', 'page', 'limit']);

  //create query string
  let queryString = JSON.stringify(reqQuery);

  //create operators e.g $in $gt $lt $gte $lte
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/,
    (match) => `$${match}`
  );

  //finding resourses
  let query = model.find(JSON.parse(queryString));

  const total = (await query).length;

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0 && total > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResult;
