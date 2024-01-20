const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const friend = new Schema(
  {
    id: { type: ObjectId },
    time: { type: String },
    status: { type: String },
    idUser1: { type: ObjectId, ref: "user" },
    idUser2: { type: ObjectId, ref: "user" },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.friend || mongoose.model("friend", friend);
