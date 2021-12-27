const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPost, usersPut, usersDelete } = require('../constrollers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const router = Router();

router.get('/', usersGet );

router.post('/',[
   check('nombre', 'El nombre es valido').not().isEmpty(),
   check('password', 'El password es obligatorio y mas de 6 letras').isLength({ min:6 }),
   // check('correo', 'El correo no es valido').isEmail(),
   check('correo').custom(emailExiste),
   // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
   // check('rol').custom((rol)=> esRoleValido(rol) ), // simplificada es así:
   check('rol').custom( esRoleValido ), //
   validarCampos

], usersPost);

router.put('/:id',[
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom( existeUsuarioPorId ),
   check('rol').custom( esRoleValido ),
   validarCampos
], usersPut );

router.delete('/:id',[
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom( existeUsuarioPorId ),
   validarCampos
] , usersDelete );



module.exports = router;