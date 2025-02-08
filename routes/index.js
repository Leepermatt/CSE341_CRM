const express = require('express');

const router = express.Router();
const contactsRoutes = require('./contacts');

router.get('/contacts');
router.use('/', require('./swagger'));
router.use('/contacts', contactsRoutes);

module.exports = router;


