var express = require("express");
var router = express.Router();
var modelPosts = require("../models/posts");

// lấy danh sách bài viết
//http://localhost:9999/posts/get-posts
router.get("/get-posts", async function (req, res, next) {
  var data = await modelPosts.find();
  res.json(data);
});

// đăng bài viết
// http://localhost:9999/posts/add-posts
router.post("/add-posts", async function (req, res, next) {
  try {
    var postData = req.body;
    var newPost = new modelPosts(postData);
    var savedPost = await newPost.save();

    res.json({ status: 1, message: "Đăng bài thành công", data: savedPost });
  } catch (err) {
    console.error(err);
    res.json({ status: 0, message: "Đăng bài thất bại", error: err.message });
  }
});

// Xóa bài viết
// http://localhost:9999/posts/delete/:id
router.delete("/delete/:id", async function (req, res, next) {
  try {
    var id = req.params.id;
    var data = await modelPosts.findByIdAndDelete(id);
    res.json({ status: 1, message: "Xóa bài thành công", data });
  } catch (err) {
    console.error(err);
    res.json({ status: 0, message: "Xóa bài thất bại", error: err.message });
  }
});

module.exports = router;