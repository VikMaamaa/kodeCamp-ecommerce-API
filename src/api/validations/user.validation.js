const Joi = require('joi');

exports.userValidation= (item) =>{
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(60).required(),
    lastName: Joi.string().min(2).max(60).required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    // price: Joi.number().required(),
  }).unknown();
  
  return schema.validate(item)
}