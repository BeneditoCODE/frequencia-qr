const router = require('express').Router();
const { handle } = require('../../utils/errors');
const { authenticate } = require('../../middleware/auth');
const service = require('./presenca.service');

router.use(authenticate('aluno'));
router.get('/frequencia', handle((req, res) => res.json(service.frequencia(req.user))));
router.get('/abertas', handle((req, res) => res.json(service.chamadasAbertas(req.user))));
router.post('/previa', handle((req, res) => res.json(service.previa(req.user, req.body.codigo))));
router.post('/', handle((req, res) => res.status(201).json(service.registrar(req.user, req.body.codigo))));

module.exports = router;
