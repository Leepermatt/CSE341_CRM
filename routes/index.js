// const express = require('express');

// const router = express.Router();
// const contactsRoutes = require('./contacts');

// router.get('/contacts');
// router.use('/', require('./swagger'));
// router.use('/contacts', contactsRoutes);

// module.exports = router;

const express = require('express');

const router = express.Router();
const contactsRoutes = require('./contacts');
//app.use(express.json());  // This is required!
// Handle GET /contacts directly here or rely on contactsRoutes to handle it
router.get('/contacts', (req, res) => {
  // Optionally handle the logic here or pass it to contactsRoutes
  res.status(200).json({ message: 'Retrieve all contacts' });
});

// Use Swagger UI for API documentation (if that's how it's set up)
router.use('/', require('./swagger'));

// Use the contactsRoutes for CRUD operations related to contacts
router.use('/contacts', contactsRoutes);

module.exports = router;


