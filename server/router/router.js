const express = require('express');
const TokenCtrl = require('../controller/token-ctrl');
const IndexCtrl = require('../controller/index-ctrl');
const ApiCtrl = require('../controller/api-ctrl');
const Validator = require('../validation/validator');

const bodyParser = require('body-parser');
const jsonParser =  bodyParser.json();

const router = express.Router();

router.get('/' ,TokenCtrl.ensureTokenInCookie, IndexCtrl.serve);
router.get('/api/entries', TokenCtrl.ensureToken, ApiCtrl.getEntries);

router.post('/api/entries', TokenCtrl.ensureToken, TokenCtrl.ensureCSRF, 
jsonParser, Validator.validateEntry, ApiCtrl.createEntry);
router.post('/api/entries/:date/details', TokenCtrl.ensureToken, TokenCtrl.ensureCSRF, jsonParser, Validator.validateEntry, ApiCtrl.createDetail);

router.delete('/api/entries/:entryId', TokenCtrl.ensureToken, TokenCtrl.ensureCSRF, Validator.validateEntryId, ApiCtrl.deleteEntry);
router.delete('/api/entries/:entryId/details/:detailId', TokenCtrl.ensureToken, TokenCtrl.ensureCSRF, Validator.validateDetailId, ApiCtrl.deleteDetail);

router.post('/api/preferences/', TokenCtrl.ensureToken, TokenCtrl.ensureCSRF, jsonParser, Validator.validatePreferences, ApiCtrl.setPreferences);

router.get('/health', (req, res) => { return res.status(200).send('I\'m happy') });

module.exports = router;