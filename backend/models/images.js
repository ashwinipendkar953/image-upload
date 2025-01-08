const monggoose = require("mongoose");

const imageSchema = new monggoose.Schema({
  imageUrl: { type: String, required: true },
});

const imageModel = monggoose.model("Image", imageSchema);

module.exports = imageModel;
