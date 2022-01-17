const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../constrollers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');

const router = Router();

//{{url}}/api/categorias

//obtener todas las categorias - público
router.get('/', obtenerProductos )

//obtener una  categoria por id - público
router.get('/:id', [ 
   check('id', 'No es un id válido').isMongoId(),
   check('id').custom( existeProductoPorId ),
   validarCampos,
], obtenerProducto );


//Crear una categoria - privado - cualquier persona con token válido
router.post('/', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('categoria', 'No es un id de categoria válido').isMongoId(),
   // check('id').custom( existeProductoPorId ),
   // check('categoria').custom( existeCategoriaPorId ),
   validarCampos
], crearProducto );

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
   validarJWT,
   check('categoria', 'No es un id de categoria válido').isMongoId(),
   check('id').custom( existeProductoPorId ),
   validarCampos,
], actualizarProducto );

//Borrar una categora - Admin - 
router.delete('/:id', [
   validarJWT,
   esAdminRole,
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom( existeProductoPorId ),
   validarCampos
] ,borrarProducto )

module.exports = router;  