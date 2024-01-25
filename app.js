require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("./db");

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/users");

const app = express();

app.use("/avatars", express.static("public/avatars"));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/users", authRouter);
app.use("/api/users", authMiddleware, userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
