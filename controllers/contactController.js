const ContactRequest = require("../models/ContactRequest");

exports.getContact = (req, res, next) => {
  res.render("contact", { pageTitle: "Contact", path: "/contacts/new" });
};

exports.getContactList = async (req, res, next) => {
  try {
    const contacts = await ContactRequest.find({ response: null });
    res.render("contact-list", {
      pageTitle: "Contact List",
      contacts,
      path: "/contacts",
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { name, email, message, phone, address } = req.body;
    await ContactRequest.create({
      name,
      email,
      message,
      phone,
      address,
    });
    res.render("thanks", { pageTitle: "Thank You!", path: "/contacts/new" });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await ContactRequest.findById(id);
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.render("contact-respond", {
      pageTitle: `${contact.name} - edit`,
      contact,
      path: req.baseUrl,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.editContact = async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;
  try {
    const contact = await ContactRequest.findByIdAndUpdate(id, {
      response,
      dateResponded: new Date(),
    });
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.render("contact-respond", {
      pageTitle: `${contact.name} - edit`,
      contact,
      path: req.baseUrl,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};
