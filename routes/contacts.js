const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/homeController');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getIndividual);

router.post('/', contactsController.addContact);

// router.put('/:id', contactsController.updateContact);

// router.delete('/:id', contactsController.deletePerson);

module.exports = router;