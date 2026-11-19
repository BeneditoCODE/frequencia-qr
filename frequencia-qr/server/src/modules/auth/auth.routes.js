const router = require('express').Router();
const { handle } = require('../../utils/errors');
const { authenticate } = require('../../middleware/auth');
const service = require('./auth.service');

router.post('/register', handle((req, res) => res.status(201).json(service.registrar(req.body))));
router.post('/login', handle((req, res) => res.json(service.entrar(req.body))));
router.get('/me', authenticate(), handle((req, res) => res.json(service.publico(req.user))));
router.patch('/me', authenticate(), handle((req, res) => res.json(service.atualizarPerfil(req.user, req.body))));
router.put('/password', authenticate(), handle((req, res) => res.json(service.alterarSenha(req.user, req.token, req.body))));

module.exports = router;
