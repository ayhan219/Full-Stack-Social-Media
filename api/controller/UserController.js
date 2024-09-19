const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all information" });
    }
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const isPasswordTrue = await bcrypt.compare(password, findUser.password);
    if (!isPasswordTrue) {
      return res.status(400).json({ message: "password doesnt match" });
    }

    const token = jwt.sign(
      {
        userId: findUser._id,
        username: findUser.username,
        email: findUser.email,
        posts: findUser.posts,
        friends: findUser.friends,
        profilePicture: findUser.profilePicture,
        followers: findUser.followers,
        followings: findUser.followings,
        notifications: findUser.notifications,
        phone: findUser.phone,
        address: findUser.address,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.status(200).json(findUser._id);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all information" });
    }
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPw,
    });

    await newUser.save();

    return res.status(200).json({ message: "user Created" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully logged out" });
};

const profile = async (req, res) => {
  const { userId } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }
    if (image !== null) {
      findUser.profilePicture = image;
    }
    await findUser.save();

    return res.status(200).json(image);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getProfileInformation = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getSearchedUser = async (req, res) => {
  const { username } = req.query;
  try {
    if (!username) {
      return res.status(400).json({ message: "no username" });
    }

    const findUser = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("-password");
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId).select("-password");
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const followUser = async (req, res) => {
  const { followedUserId } = req.params;
  const { userId } = req.query;

  try {
    if (!followedUserId || !userId) {
      return res.status(400).json({ message: "no user id or other user id" });
    }
    const findFollowedUser = await User.findById(followedUserId);
    const findUser = await User.findById(userId);

    if (!findFollowedUser || !findUser) {
      return res.status(400).json({ message: "users not found" });
    }

    if (findFollowedUser.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "this user is already following" });
    }
    findFollowedUser.followers.push(userId);
    findUser.followings.push(followedUserId);
    findFollowedUser.notifications.push({
      userId: null,
      message: `${findUser.username} has started following you`,
    });

    await findFollowedUser.save();
    await findUser.save();

    return res.status(200).json({ message: "succesfully followed" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const unfollowUser = async (req, res) => {
  const { unfollowedUserId } = req.params;
  const { userId } = req.query;

  try {
    if (!unfollowedUserId || !userId) {
      return res.status(400).json({ message: "No id's" });
    }
    const findUnfollowedUser = await User.findById(unfollowedUserId);
    const findUser = await User.findById(userId);

    if (!findUnfollowedUser || !findUser) {
      return res.status(400).json({ message: "user's not found" });
    }

    if (!findUnfollowedUser.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "you are not following this user" });
    }
    findUnfollowedUser.followers = findUnfollowedUser.followers.filter(
      (id) => id.toString() !== userId
    );

    findUser.followings = findUser.followings.filter(
      (id) => id.toString() !== unfollowedUserId
    );

    await findUnfollowedUser.save();
    await findUser.save();
    return res.status(200).json({ message: "unfollowed successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateProfile = async (req, res) => {
  const { userId, email, phone, address } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId);

    if (email !== undefined) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email already exists" });
      }
      findUser.email = email;
    }
    if (phone !== undefined) {
      findUser.phone = phone;
    }
    if (address !== undefined) {
      findUser.address = address;
    }

    findUser.save();

    return res.status(200).json({
      email: findUser.email,
      phone: findUser.phone,
      address: findUser.address,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "no user" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 saat geçerli
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "3bbab4c0e64e34", // kendi mail adresinizi yazın
        pass: "a11a81a2a4b0b5", // kendi mail şifrenizi yazın
      },
    });

    const resetLink = `http://localhost:5173/resetpassword/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: "Social Media Ayhan",
      subject: "reset password",
      text: `press the link if you want to reset password: ${resetLink}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.status(200).send("reset password has sent");
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const forgotPasswordToken = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Token süresi dolmamış mı?
  });

  if (!user) {
    return res.status(400).send("undefined token");
  }

  // Yeni şifreyi hashle ve kaydet
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send("password changed!");
};

const getFollowers = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const UserFollowers = findUser.followings

    let allFollowers = [];

    const findUserFollowers = await Promise.all(
      UserFollowers.map(async(follower)=>{
        const followers = await User.findById(follower).select("username profilePicture _id");
        return followers
      })
    )
    allFollowers = findUserFollowers;
    return res.status(200).json(allFollowers)
    
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  login,
  signup,
  getCurrentUser,
  logoutUser,
  profile,
  getProfileInformation,
  getSearchedUser,
  getUserProfile,
  followUser,
  unfollowUser,
  updateProfile,
  forgotPassword,
  forgotPasswordToken,
  getFollowers,
};
