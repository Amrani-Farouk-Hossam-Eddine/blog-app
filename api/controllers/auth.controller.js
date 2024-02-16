const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");
    const q =
      "INSERT INTO users (username, email, password, profilePic) VALUES (?)";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.profilePic,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(409).json("User doesn't exists");
    const passwordVerified = bcrypt.compare(
      req.body.password,
      data[0].password
    );
    if (!passwordVerified)
      return res.status(400).json("Wrong password or username");
    const { password, ...info } = data[0];
    const token = jwt.sign({ id: data[0].id }, process.env.SECRET_KEY);
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(info);
  });
};

const logout = (req, res) => {
  return res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("logout");
};

module.exports = { register, login, logout };
