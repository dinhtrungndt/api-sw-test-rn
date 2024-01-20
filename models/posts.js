const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const typePosts = new Schema(
    {
        id: { type: ObjectId },
        name: { type: String },
    },
    {
        versionKey: false,
    }
    );

const object = new Schema(
  {
    id: { type: ObjectId },
    name: { type: String },
  },
  {
    versionKey: false,
  }
);

const posts = new Schema(
  {
    id: { type: ObjectId },
    content: { type: String },
    time: { type: String },
    idObject: [object],
    idTypePosts: [typePosts],
    idShare: { type: ObjectId },
    idUser: { type: ObjectId, ref: "user" },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.posts || mongoose.model("posts", posts);
