const express = require('express');
const router = express.Router();
const { authValidation, validate } = require('../middleware/validation');
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);

router.post('/login', validate(authValidation.login), authController.postLogin);
router.post('/register', validate(authValidation.register), authController.postRegister);

router.post('/logout', authController.logout);

module.exports = router;
