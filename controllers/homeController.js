const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


// const getAll = async (req, res) => {
//   const result = await mongodb.getDb().db().collection('contacts').find();
//   result.toArray().then((lists) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(lists);
//   });
// };


// const getAll = async (req, res) => {
// mongodb
// .getDb()
// .db()
// .collection('contacts')
// .find()
// .toArray((err, lists) => {
// if (err) {
//   res.status(400).json({ message: err});
// }
// res.setHeader('Content-Type', 'application/json');
// res.status(200).json(lists);
// });
// };
const getAll = async (req, res) => {
  try {
    const contacts = await mongodb.getDb().db().collection('contacts').find().toArray();

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found' });
    }

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving contacts', error: err.message });
  }
};

// const getAll = async (req, res) => {
//   try {
//     const lists = await mongodb
//       .getDb()
//       .db()
//       .collection('contacts')
//       .find()
//       .toArray();  // Use async/await to handle the result.

//     if (lists.length === 0) {
//       return res.status(404).json({ message: 'No contacts found' });
//     }

//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(lists);  // Return the contacts as a JSON array
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving contacts', error: err });
//   }
// };

// const getIndividual = async (req, res) => {
//   const userId = new ObjectId(req.params.id);
//   const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
//   result.toArray().then((lists) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(lists[0]);
//   });
// };

const getIndividual = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  try {
    const result = await mongodb.getDb()
      .db()
      .collection('contacts')
      .aggregate([
        { $match: { _id: userId } },
        { 
          $lookup: {
            from: 'properties',
            localField: 'interestedPropertyId',
            foreignField: '_id',
            as: 'propertyDetails'
          }
        },
        { $unwind: { path: '$propertyDetails', preserveNullAndEmptyArrays: true } }
      ])
      .toArray();

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
};

const addContact = async (req, res) => {
  try {
    const newContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      address: {
        street: req.body.address?.street,
        city: req.body.address?.city,
        state: req.body.address?.state,
        zip: req.body.address?.zip,
      },
      preapproved: req.body.preapproved,
      interestedPropertyId: req.body.interestedPropertyId
    };

    const result = await mongodb.getDb().db().collection('contacts').insertOne(newContact);

    if (result.acknowledged) {
      res.status(201).json({ message: 'Contact added successfully', id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to add contact' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while adding the contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const updatedContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      address: {
        street: req.body.address?.street,
        city: req.body.address?.city,
        state: req.body.address?.state,
        zip: req.body.address?.zip,
      },
      preapproved: req.body.preapproved,
      interestedPropertyId: req.body.interestedPropertyId
    };

    const result = await mongodb.getDb().db().collection('contacts').updateOne(
      { _id: userId },
      { $set: updatedContact } // ✅ Move $set here
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Contact not found' });
    } else if (result.modifiedCount === 0) {
      res.status(200).json({ message: 'No changes made to the contact' });
    } else {
      res.status(200).json({ message: 'Contact updated successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating the contact' });
  }
};

const deletePerson = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while deleting the contact' });
  }
};


module.exports = {
  getAll,
  getIndividual,
  addContact,
  updateContact,
  deletePerson
};
