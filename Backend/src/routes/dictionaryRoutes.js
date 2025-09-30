const { Router } = require('express');
const { lookup, recent } = require('../controllers/dictionaryController');

const router = Router();

router.get('/lookup', lookup);
router.get('/recent', recent);

module.exports = router; 
