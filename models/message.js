const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const message = new Schema(
  {
    id: { type: ObjectId },
    content: { type: String },
    status: { type: String },
    time: { type: String },
    idSender: { type: ObjectId, ref: "user" },
    idReceiver: { type: ObjectId, ref: "user" },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.message || mongoose.model("message", message);
