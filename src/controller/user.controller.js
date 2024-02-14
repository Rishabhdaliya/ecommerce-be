import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadImage from "../middleware/uploadImage.js";

const signUp = async (req, res) => {
  try {
    // Use uploadImage middleware to handle profile picture upload
    uploadImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res
          .status(500)
          .send({ message: "Profile picture upload failed." });
      } else if (err) {
        // An unknown error occurred when uploading
        return res.status(500).send({ message: "Internal server error." });
      }

      if (!req.body.email) {
        return res.status(400).send({ message: "Please provide an email." });
      }

      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).send({ message: "Email already exists." });
      }

      let pass = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(pass, salt);

      // Get profile picture filename from req.file
      const profilePicture = req.file ? req.file.filename : null;

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: pass,
        encryptedPassword: encryptedPassword,
        role: req.body.role || "user",
        profilePicture: profilePicture, // Add profilePicture to user object
      });

      const savedUser = await newUser.save();

      res.status(200).send({
        message: "Successfully created new user.",
        data: savedUser,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "Email not registered." });
    }

    if (!bcrypt.compareSync(req.body.password, user.encryptedPassword)) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ _id: user._id }, "secret");

    res.status(200).send({
      message: "Logged in successfully.",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        token: token,
        isAuthenticated: true,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateUserById = (req, res) => {
  const userId = req.params._id;
  if (!userId) {
    res.status(400).send({ message: "Please provide a user ID." });
    return;
  }

  let updates = {};

  if (req.body.password) {
    const salt = bcrypt.genSaltSync(10);
    updates.password = req.body.password;
    updates.encryptedPassword = bcrypt.hashSync(req.body.password, salt);
  }

  if (req.body.name) {
    updates.name = req.body.name;
  }

  if (req.body.address) {
    updates.address = req.body.address;
  }

  if (req.body.profilePicture) {
    updates.profilePicture = req.body.profilePicture;
  }

  User.findByIdAndUpdate(userId, { $set: updates }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      res.status(200).send({
        message: `User with ID ${userId} updated successfully.`,
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal server error." });
      console.log(err);
    });
};

const allUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send({
        message: "Fetched all users successfully.",
        data: users,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal server error." });
      console.log(err);
    });
};

const deleteUserById = (req, res) => {
  const userId = req.params._id;
  if (!userId) {
    res.status(400).send({ message: "Please provide a user ID." });
    return;
  }

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      res.status(200).send({
        message: `User with ID ${userId} deleted successfully.`,
        data: deletedUser,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal server error." });
      console.log(err);
    });
};

const userById = (req, res) => {
  const userId = req.params._id;
  if (!userId) {
    res.status(400).send({ message: "Please provide a user ID." });
    return;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      res.status(200).send({
        message: `Fetched user with ID ${userId} successfully.`,
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal server error." });
      console.log(err);
    });
};

export { signUp, login, updateUserById, allUsers, deleteUserById, userById };
