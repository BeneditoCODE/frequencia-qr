const router = require('express').Router();
const { handle } = require('../../utils/errors');
const { authenticate } = require('../../middleware/auth');
const service = require('./dashboard.service');

router.get('/professor', authenticate('professor'), handle((req, res) => res.json(service.professor(req.user.id))));

module.exports = router;
