const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  "critic_id": "critic.critic_id",
  "preferred_name": "critic.preferred_name",
  "surname": "critic.surname",
  "organization_name": "critic.organization_name",
})

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .distinct("movies.*", "movies_theaters.is_showing")
    .where({ "movies_theaters.is_showing": 1 })
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
}

function listReviews(movieId) {
  return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("reviews.*", "critics.*")
    .where({ "reviews.movie_id": movieId })
    .then((results) => Object.values(results))
    .then((results) => results.map(review => addCritics(review)))
}

function listTheaters(movieId) {
  return knex("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
    .select("theaters.*")
    .where({ "movies_theaters.movie_id": movieId })
}

module.exports = {
  list,
  listShowing,
  read,
  listReviews,
  listTheaters,
};