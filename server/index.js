const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
var nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTENDURL],
    credentials: true,
  })
);
app.use(cookieParser());

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json("Token Not Found");
  } else {
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) {
        return res.status(500).json("Something Went Wrong");
      }
      next();
    });
  }
};

app.get("/home", verifyUser, (req, res) => {
  return res.status(200).json("Success");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { email: user.email },
              process.env.SECRETKEY,
              {
                expiresIn: "1d",
              }
            );
            res.cookie("token", token);
            res.status(200).json("Login Success");
          } else {
            res.status(401).json("Password is incorrect");
          }
        });
      } else {
        res.status(401).json("user not found");
      }
    })
    .catch((err) => res.json(err));
});

app.post("/forgotPassword", (req, res) => {
  const { email } = req.body;

  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).json("user not found");
      }
      const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
        expiresIn: "1d",
      });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: process.env.GMAILPORT,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAILPASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });

      var mailOptions = {
        from: process.env.GMAIL,
        to: `${user.email}`,
        subject: "reset your password",
        text: `http://localhost:5173/reset-password/${user._id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(403).json("Mail Not Send");
        } else {
          return res.status(200).json("Mail Has Been Sent");
        }
      });
    })
    .catch((err) => res.json(err));
});

app.post("/signUp", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    userModel
      .create({
        email,
        password: hash,
      })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  });
});

app.post("/resetPassword/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
    if (err) {
      return res.status(403).json("Something Went Wrong");
    } else {
      bcrypt.hash(password, 10).then((hash) => {
        userModel
          .findByIdAndUpdate({ _id: id }, { password: hash })
          .then((user) => res.json(user))
          .catch((err) => res.json(err));
      });
    }
  });
});

mongoose.connect(process.env.DATABASE);
app.listen(process.env.PORT, () => {
  console.log(`Server Is Running on ${process.env.PORT}`);
});
