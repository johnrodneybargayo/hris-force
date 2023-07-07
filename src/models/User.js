const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const secretKey = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f'; // Replace with your actual secret key

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, secretKey);
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };