const express = require("express");

const router = express.Router();

const method = require("../../models/contacts");

const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(6).max(18),
});

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await method.listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const searchedContact = await method.getById(id);
    if (!searchedContact) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(searchedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = contactSchema.validate(req.body);

    if (typeof response.error !== "undefined") {
      console.log(response);
      return res.status(400).send(response.error.message);
    }

    const { name, email, phone } = req.body;
    const missingFields = [];

    if (!name) {
      missingFields.push("name");
    }

    if (!email) {
      missingFields.push("email");
    }

    if (!phone) {
      missingFields.push("phone");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `missing required ${missingFields.join(", ")} field `,
      });
    }
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };

    await method.addContact(newContact);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const removedContact = await method.removeContact(id);

    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const response = contactSchema.validate(req.body);
    if (typeof response.error !== "undefined") {
      console.log(response);
      return res.status(400).send(response.error.message);
    }
    const id = req.params.id;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({ message: "missing fields" });
    }

    const updatedContact = await method.updateContact(id, {
      name,
      email,
      phone,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
