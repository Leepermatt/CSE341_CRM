const validator = require('../helpers/validate');

const saveContact = async (req, res, next) => { 
    console.log("Received Data:", JSON.stringify(req.body, null, 2));  // Debugging
    // const data = req.body;
    const rules = {
        firstName: 'required|string',
        lastName: 'required|string',
        phone: 'required|pattern:/[0-9]{3}-[0-9]{3}-[0-9]{4}/',
        email: 'required|email',
        'address.street': 'required|string',
        'address.city': 'required|string',
        'address.state': 'required|string',
        'address.zip': 'required|pattern:/[0-9]{5}/',
        preapproved: 'required|in:yes,no',   
        interestedPropertyID: 'required|regex:/^[a-fA-F0-9]{24}$/',
    };
    
    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            console.error("Validation Errors:", err);
            // Flatten and extract the errors if necessary
            const errorMessages = Object.values(err).flat();

        res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: err
        });
        } else {
            next();
        // Save the contact to the database
        // res.status(200).json({ message: 'Contact saved' });
        }
    });
    };

    module.exports = {
        saveContact
    };

