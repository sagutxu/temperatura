const express = require('express');
const router = express.Router();
const sagutxu_controller = require("../controllers/sagutxuController");

router.post('/', sagutxu_controller.sagutxu_crear);

module.exports = router;