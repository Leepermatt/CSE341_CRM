const express = require('express');
const router = express.Router();
//app.use(express.json());  // This is required!
const contactsController = require('../controllers/homeController');
const validate = require('../middleware/validate');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getIndividual);

router.post('/', validate.saveContact, contactsController.addContact);

router.put('/:id', validate.saveContact, contactsController.updateContact);

router.delete('/:id', contactsController.deletePerson);

module.exports = router;