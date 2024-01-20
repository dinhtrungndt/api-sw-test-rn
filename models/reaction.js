const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reaction = new Schema(
  {
    id: { type: ObjectId },
    type: { type: String },
    idUser: { type: ObjectId, ref: "user" },
    idPosts: { type: ObjectId, ref: "posts" },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.reaction || mongoose.model("reaction", reaction);
