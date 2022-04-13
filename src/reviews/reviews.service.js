const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  "preferred_name": "critic.preferred_name",
  "surname": "critic.surname",
  "organization_name": "critic.organization_name",
})

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function readWithCritics(reviewId) {
  return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("reviews.*", "critics.*")
    .where({ "reviews.review_id": reviewId })
    .then((updatedRecords) => updatedRecords[0])
    .then(addCritics)
}

function update(updatedReview) {
  return knex("reviews")
    .where({ "review_id": updatedReview.review_id })
    .update(updatedReview)
    .then((updatedRecords) => updatedRecords[0])
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del()
}

module.exports = {
  read,
  readWithCritics,
  update,
  delete: destroy,
}