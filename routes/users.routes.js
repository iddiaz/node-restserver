const { Router } = require('express');
const { usersGet, usersPost, usersPut, usersDelete } = require('../constrollers/usuarios.controller');

const router = Router();

router.get('/', usersGet );
router.put('/:id', usersPut )
router.post('/', usersPost)
router.delete('/', usersDelete )



module.exports = router;