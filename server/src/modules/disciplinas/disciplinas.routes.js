const router = require('express').Router();
const { handle } = require('../../utils/errors');
const { authenticate } = require('../../middleware/auth');
const service = require('./disciplinas.service');
const aulas = require('../aulas/aulas.service');

router.use(authenticate('professor'));
router.post('/', handle((req, res) => res.status(201).json(service.criar(req.user.id, req.body))));
router.get('/:id/relatorio', handle((req, res) => res.json(service.relatorio(req.params.id, req.user.id))));
router.post('/:id/alunos', handle((req, res) => res.json(service.matricular(req.params.id, req.user.id, req.body.email))));
router.delete('/:id/alunos/:alunoId', handle((req, res) => res.json(service.desmatricular(req.params.id, req.user.id, req.params.alunoId))));
router.post('/:id/aulas', handle((req, res) => res.status(201).json(aulas.iniciar(req.params.id, req.user.id, req.body.tema))));

module.exports = router;
