const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(3).max(30),
});

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const validation = userSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.message);
    }
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({ email, password: passwordHash });
    res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const validation = userSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.message);
  }

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res) {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
}

module.exports = {
  register,
  login,
  logout,
  current,
};
