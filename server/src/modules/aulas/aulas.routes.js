const router = require('express').Router();
const { handle } = require('../../utils/errors');
const { authenticate } = require('../../middleware/auth');
const service = require('./aulas.service');

router.use(authenticate('professor'));
router.get('/:id/qr', handle((req, res) => res.json(service.qr(req.params.id, req.user.id))));
router.get('/:id/painel', handle((req, res) => res.json(service.painel(req.params.id, req.user.id))));
router.post('/:id/encerrar', handle((req, res) => res.json(service.encerrar(req.params.id, req.user.id))));

module.exports = router;
