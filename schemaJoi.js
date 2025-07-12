const Joi = require("joi");

module.exports.datalistSchema = Joi.object({
  datalist: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    image: Joi.string(),
  }).required,
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.string().required().min(1).max(4),
  }),
});
