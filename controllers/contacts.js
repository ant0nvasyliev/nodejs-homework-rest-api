const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(6).max(18),
  favorite: Joi.boolean(),
});
const Contact = require("../models/contacts");

async function getContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.send(contacts).status(200);
  } catch (error) {
    next(error);
  }
}

async function getContact(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (contact === null) {
    return res.status(404).send({ message: "Not found" });
  }

  res.send(contact).status(200);
}

async function createContact(req, res, next) {
  try {
    const validation = contactSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.message);
    }
    const contact = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };

    const result = await Contact.create(contact);
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  try {
    const result = await Contact.findByIdAndDelete(id);
    if (result === null) {
      return res.status(404).send("Contact not found");
    }
    res.send(`Deleted Contact id: ${id}`);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;

  try {
    const validation = contactSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.message);
    }
    const contact = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };

    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });
    if (result === null) {
      return res.status(404).send("Contact not found");
    }
    res.send(result).status(200);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("message: missing field favorite");
  }
  try {
    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (result === null) {
      return res.status(404).send("Contact not found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
