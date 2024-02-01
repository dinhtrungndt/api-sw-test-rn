var express = require("express");
var router = express.Router();
var modelUser = require("../models/users");
var modelPosts = require("../models/posts");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

// lấy danh sách người dùng
//http://localhost:9999/user/get-user
router.get("/get-user", async function (req, res, next) {
  var data = await modelUser.find();
  res.json(data);
});

// Đăng ký
// http://localhost:9999/user/add-user
router.post("/add-user", async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu hay không
    const exitstingUser = await modelUser.findOne({ email });

    if (exitstingUser) {
      return res.json({ status: 0, message: "Email đã tồn tại" });
    }

    if (!email || typeof email !== "string") {
      return res.json({ status: 0, message: "Email không hợp lệ" });
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo model
    const Data = {
      name: req.body.name,
        email: email,
        password: hashedPassword,
        gender: req.body.gender,
        date: req.body.date,
        avatar: req.body.avatar,
        coverImage: req.body.coverImage,
    };

    await modelUser.create(Data);
    res.json({ status: 1, message: "Đăng ký thành công", Data });
  } catch (err) {
    console.error(err); 
    res.json({ status: 0, message: "Đăng ký thất bại", error: err.message });
  }
});

// Đăng nhập
//http://localhost:9999/user/login
router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu dựa trên email
    const user = await modelUser.findOne({ email });

    if (!user) {
      return res.json({ status: 0, message: "Người dùng không tồn tại" });
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.json({ status: 0, message: "Mật khẩu không chính xác" });
    }

    // Lấy danh sách bài viết của người dùng
    const posts = await modelPosts.find({ idUser: user._id });

    // Tạo token xác thực
    const token = jwt.sign({ userId: user._id }, "your_secret_key");
    res.json({
      status: 1,
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        sex: user.sex,
        date: user.date,
        avatar: user.avatar,
        coverImage: user.coverImage,
      },
      posts,
      token: token,
    });
  } catch (err) {
    res.json({ status: 0, message: "Đăng nhập thất bại" });
  }
});

// Xóa người dùng
//http://localhost:9999/user/delete/:id
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    // kiểm tra xem id có đúng định dạng ObjectID hay không
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ status: 0, message: "Id không hợp lệ" });
    }

    // Tìm người dùng trong cơ sở dữ liệu dựa trên id
    const user = await modelUser.findById(id);
    if (!user) {
      return res.json({ status: 0, message: "Người dùng không tồn tại" });
    }
    
    // Xóa người dùng dựa vào id trong params
    await modelUser.findByIdAndDelete(id);
    
    res.json({ status: 1, message: "Xóa thành công" });
  } catch (err) {
    console.error(err); 
    res.json({ status: 0, message: "Xóa thất bại" });
  }
});

// Cập nhập người dùng
//http://localhost:9999/user/update/:id
router.put("/update/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    // Các bước cập nhập thông tin người dùng
    console.log(req.body);
    // kiểm tra xem id có đúng định dạng ObjectID hay không
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ status: 0, message: "Id không hợp lệ" });
    }

    // Tìm người dùng trong cơ sở dữ liệu dựa trên id
    const user = await modelUser.findById(id);
    if (!user) {
      return res.json({ status: 0, message: "Người dùng không tồn tại" });
    }

    const { name, email, password, sex, date, avatar, coverImage } = req.body;
    // Cập nhập trường Name nếu có tồn tại trong yếu cầu
    if (name) {
      user.name = name;
    }

    user.email = email || user.email;
    user.sex = sex || user.sex;
    user.date = date || user.date;
    user.avatar = avatar || user.avatar;
    user.coverImage = coverImage || user.coverImage;


    // Hash mật khẩu trước khi cập nhập (nếu có)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ status: 1, message: "Cập nhập thành công", Data: user });
  } catch (err) {
    console.error(err); 
    res.json({ status: 0, message: "Cập nhật thất bại", error: err.message });
  }
});

module.exports = router;
