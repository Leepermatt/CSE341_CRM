const validator = require('../helpers/validate');

const saveContact = async (req, res, next) => { 
    console.log("Received Data:", req.body);  // Debugging

    if (!Object.keys(req.body).length) {
        return res.status(400).json({ success: false, message: "Request body is empty!" });
    }

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
        interestedPropertyID: 'required|regex:/^[a-f0-9]{24}$/i',  // Fix regex for case-insensitive match
    };

    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            console.error("Validation Errors:", err);

            // Flatten the error object to avoid nested structures
            const errorMessages = {};
            for (const key in err) {
                errorMessages[key] = err[key];  // Keep errors at one level
            }

            return res.status(422).json({
                success: false,
                message: "Validation failed",
                errors: errorMessages  // Ensure no double-nested "errors"
            });
        } 
        
        next();  // Proceed if validation is successful
    });
};

module.exports = {
    saveContact
};

