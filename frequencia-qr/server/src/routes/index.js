const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/disciplinas', require('../modules/disciplinas/disciplinas.routes'));
router.use('/aulas', require('../modules/aulas/aulas.routes'));
router.use('/presenca', require('../modules/presenca/presenca.routes'));
router.use('/dashboard', require('../modules/dashboard/dashboard.routes'));

module.exports = router;
