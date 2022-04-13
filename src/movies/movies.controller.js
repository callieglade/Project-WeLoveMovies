const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const [movie] = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  const data = (req.query.is_showing) ? await service.listShowing() : await service.list();
  res.json({ data });
}

async function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function listReviews(req, res, next) {
  const data = await service.listReviews(res.locals.movie.movie_id);
  res.json({ data });
}

async function listTheaters(req, res, next) {
  const data = await service.listTheaters(res.locals.movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
  listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
};