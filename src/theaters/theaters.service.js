const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const addMovies = reduceProperties("theater_id", {
  "title": ["movies", null, "title"],
  "runtime_in_minutes": ["movies", null, "runtime_in_minutes"],
  "rating": ["movies", null, "rating"],
});

function list() {
  return knex("theaters")
  .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
  .join("movies", "movies_theaters.movie_id", "movies.movie_id")
  .select("theaters.*", "movies.title", "movies.runtime_in_minutes", "movies.rating")
  .then(addMovies)
}

module.exports = {
  list,
}