const Ajv = require('ajv').default;
const ajv = new Ajv();
const schema = require("../../model/schema.json").$jsonSchema;
ajv.addSchema(schema,"schema.json");

const addFormats = require("ajv-formats")
addFormats(ajv);

class Validator {
    static validateEntry(req, res, next) {
        if(req.body) {
            if(req.body.date) {
                let entry = req.body;
                entry.email = req.user.email;
                if(ajv.validate(schema, entry))
                    return next();
            } else {
                const schemaUri = 'schema.json#/properties/details/items';
                const validate = ajv.getSchema(schemaUri);
                if(validate(req.body)) {
                    return next();
                }
            } 
            res.status(400).send(`Invalid payload`);
        } else {
            return next();
        }
    }
    static validateEmail(req,res,next) {
        if(req.body && req.body.email) {
            const schemaUri = 'schema.json#/properties/email';
            const validate = ajv.getSchema(schemaUri);
            if(validate(req.body.email)) {
                return next();
            } else {
                return res.status(400).send(`Invalid Email`);
            }
        }
        return next();
    }
    static validatePreferences(req,res,next) {
        if(req.body && req.body.dailyLimit) {
            if(!isNaN(req.body.dailyLimit) && req.body.dailyLimit > 0 && req.body.dailyLimit <= 5000) {
                return next();
            }
        }
        return res.status(400).send("Invalid payload");
    }

    static validateEntryId(req,res,next) {
        if(req && req.params && req.params.entryId) {
            const schemaUri = 'schema.json#/properties/date';
            const validate = ajv.getSchema(schemaUri);
            if(validate(req.params.entryId)) {
                return next();
            } else {
                return res.status(400).send(`Invalid Id`);
            }
        } else {
            res.status(400).send('Invalid Id');
        }
    }

    static validateDetailId(req,res,next) {
        if(req && req.params && req.params.entryId && req.params.detailId) {
            const schemaUri = 'schema.json#/properties/';
            const _validateEntryId = ajv.getSchema(schemaUri+'date');
            const _validateDetailId = ajv.getSchema(schemaUri+'details/items/properties/detailId');
            if(_validateEntryId(req.params.entryId) && _validateDetailId(req.params.detailId)) {
                return next();
            } else {
                return res.status(400).send(`Invalid Id`);
            }
        } else {
            res.status(400).send('Invalid Id');
        }
    }
}

module.exports = Validator;