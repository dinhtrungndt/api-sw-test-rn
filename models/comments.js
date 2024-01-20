const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const comments = new Schema(
  {
    id: { type: ObjectId },
    content: { type: String },
    time: { type: String },
    idUser: { type: ObjectId, ref: "user" },
    idPosts: { type: ObjectId, ref: "posts" },
    idParent: { type: ObjectId },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.comments || mongoose.model("comments", comments);
