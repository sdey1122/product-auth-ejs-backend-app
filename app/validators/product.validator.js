const Joi = require("joi");

//  CREATE PRODUCT VALIDATION
const productCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().required().messages({
    "string.empty": "Product name is required",
  }),

  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),

  size: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().valid("S", "M", "L", "XL")),
      Joi.string().valid("S", "M", "L", "XL"),
    )
    .required()
    .messages({
      "any.required": "Size is required",
    }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
  }),

  stock: Joi.number().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
  }),

  status: Joi.string().valid("active", "inactive").required().messages({
    "any.only": "Invalid status",
  }),
});

//  UPDATE PRODUCT VALIDATION
const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim(),

  description: Joi.string().min(10),

  category: Joi.string(),

  size: Joi.alternatives().try(
    Joi.array().items(Joi.string().valid("S", "M", "L", "XL")),
    Joi.string().valid("S", "M", "L", "XL"),
  ),

  price: Joi.number().positive(),

  stock: Joi.number().min(0),

  status: Joi.string().valid("active", "inactive"),
});

//  VALIDATORS
const validateCreateProduct = (data) => {
  return productCreateSchema.validate(data, { abortEarly: false });
};

const validateUpdateProduct = (data) => {
  return productUpdateSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
