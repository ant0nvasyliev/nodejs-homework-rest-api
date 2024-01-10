const fs = require("node:fs/promises");
const path = require("node:path");

const filePath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(data);
};

const getById = async (id) => {
  const allContacts = await listContacts();
  const searchedContact = allContacts.find((contact) => contact.id === id);

  return searchedContact;
};

const addContact = async (newContact) => {
  try {
    const allContacts = await listContacts();

    allContacts.push(newContact);

    await fs.writeFile(filePath, JSON.stringify(allContacts, null, 2), {
      encoding: "utf-8",
    });

    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    throw error;
  }
};

const removeContact = async (id) => {
  const allContacts = await listContacts();
  const removedContact = allContacts.find((contact) => contact.id === id);

  if (!removedContact) {
    return null;
  }

  const updatedContacts = allContacts.filter((contact) => contact.id !== id);

  await fs.writeFile(filePath, JSON.stringify(updatedContacts, null, 2), {
    encoding: "utf-8",
  });

  return removedContact;
};

const updateContact = async (id, body) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  allContacts[index] = {
    ...allContacts[index],
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.phone && { phone: body.phone }),
  };

  await fs.writeFile(filePath, JSON.stringify(allContacts, null, 2), {
    encoding: "utf-8",
  });

  return allContacts[index];
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
