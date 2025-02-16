const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


// const getAll = async (req, res) => {
//   const result = await mongodb.getDb().db().collection('contacts').find();
//   result.toArray().then((lists) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(lists);
//   });
// };


const getAll = async (req, res) => {
mongodb
.getDb()
.db()
.collection('contacts')
.find()
.toArray((err, lists) => {
if (err) {
  res.status(400).json({ message: err});
}
res.setHeader('Content-Type', 'application/json');
res.status(200).json(lists);
});
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
  const userId = new ObjectId(req.params.id); // Convert ID to ObjectId

  try {
    const result = await mongodb.getDb()
      .db()
      .collection('contacts')
      .aggregate([
        {
          $match: { _id: userId } // Match the contact by ID
        },
        {
          $lookup: {
            from: 'properties', // Name of the other collection where properties are stored
            localField: 'interestedPropertyId', // Field in contacts that links to properties
            foreignField: '_id', // Field in properties collection
            as: 'propertyDetails' // Alias to hold the property details
          }
        },
        {
          $unwind: { path: '$propertyDetails', preserveNullAndEmptyArrays: true } // Unwind to flatten the array if the contact has a property
        },
        {
          $addFields: {
            interestedPropertyId: { $toObjectId: "$interestedPropertyId" } // Convert interestedPropertyId to ObjectId
          }
        }
      ])
      .toArray();

    if (result.length === 0) {
      return res.status(400).json({ message: 'Contact not found' });
    }

    res.status(204).json(result[0]); // Return the contact with the property details
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact with property details' });
  }
};

module.exports = {
  getIndividual,
};


const addContact = async (req, res) => {
  try {
    const newContact = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: {
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
        },
        preapproved: req.body.preapproved,
        interestedPropertyId: req.body.interestedPropertyId,
      },
    };
    const result = await mongodb.getDb().db().collection('contacts').insertOne(newContact);

    if (result.acknowledged) {
      res.status(204).json({ message: 'Contact added successfully', id: result.insertedId });
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
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: {
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
        },
        preapproved: req.body.preapproved,
        interestedPropertyId: req.body.interestedPropertyId,
      },
    };

    const result = await mongodb.getDb().db().collection('contacts').updateOne({ _id: userId }, updatedContact);

    if (result.matchedCount === 0) {
      res.status(500).json({ message: 'Contact not found' });
    } else if (result.modifiedCount === 0) {
      res.status(204).json({ message: 'No changes made to the contact' });
    } else {
      res.status(204).json({ message: 'Contact updated successfully' });
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
      return res.status(500).json({ message: 'Contact not found' });
    }

    res.status(204).json({ message: 'Contact deleted successfully' });
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
