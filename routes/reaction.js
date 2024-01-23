var express = require("express");
var router = express.Router();
var modelReaction = require("../models/reaction");

// lấy danh sách bài viết
//http://localhost:9999/reaction/get
router.get("/get", async function (req, res, next) {
  var idPosts = req.query.idPosts;
  var data = await modelReaction.find({idPosts: idPosts});
  res.json({ status: 1, message: "Thành công", data });
});

// Like bài viết
// http://localhost:9999/reaction/like
router.post("/like", async function (req, res, next) {
  try {
    var postData = req.body;

        // Nhấn lần đầu là like nhấn lần 2 là dislike
    var checkLike2 = await modelReaction.findOne({ idUser: postData.idUser, idPosts: postData.idPosts, type: "like" });
    if (checkLike2) {
        await modelReaction.deleteOne({ idUser: postData.idUser, idPosts: postData.idPosts, type: "like" });
        res.json({ status: 1, message: "Dislike bài thành công" });
        return;
        }

    postData.idUser = postData.idUser;
    postData.idPosts = postData.idPosts;
    postData.type = "like";
    var newPost = new modelReaction(postData);
    var savedPost = await newPost.save();

    res.json({ status: 1, message: "Like bài thành công", data: savedPost });
  } catch (err) {
    console.error(err);
    res.json({ status: 0, message: "Like bài thất bại", error: err.message });
  }
});


module.exports = router;