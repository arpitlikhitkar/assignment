const mongoose = require("mongoose");
const { BadRequestError } = require("./appError");

const validateObjectId = (id, fieldName = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${fieldName}`);
  }
};

module.exports = validateObjectId;
