const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../constrollers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');

const router = Router();

//{{url}}/api/categorias

//obtener todas las categorias - público
router.get('/', obtenerCategorias )

//obtener una  categoria por id - público
router.get('/:id', [ 
   check('id', 'No es un id válido').isMongoId(),
   check('id').custom( existeCategoriaPorId ),
   validarCampos,
], obtenerCategoria );


//Crear una categoria - privado - cualquier persona con token válido
router.post('/', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], crearCategoria );

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('id').custom( existeCategoriaPorId ),
   validarCampos,
], actualizarCategoria );

//Borrar una categora - Admin - 
router.delete('/:id', [
   validarJWT,
   esAdminRole,
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom( existeCategoriaPorId ),
   validarCampos
] ,borrarCategoria )

module.exports = router;  