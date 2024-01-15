const express = require("express");

const ContactsController = require("../../controllers/contacts");

const router = express.Router();
const jsonParser = express.json();

router.get("/", ContactsController.getContacts);

router.get("/:id", ContactsController.getContact);

router.post("/", jsonParser, ContactsController.createContact);

router.delete("/:id", ContactsController.deleteContact);

router.put("/:id", jsonParser, ContactsController.updateContact);

router.patch(
  "/:id/favorite",
  jsonParser,
  ContactsController.updateStatusContact
);

module.exports = router;
