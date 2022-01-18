const { Router } = require('express');
const { check } = require('express-validator');
const { route } = require('express/lib/router');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');



const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivo );
router.put('/:coleccion/:id', [
   validarArchivoSubir,
   check('id', 'El id debe ser de mongo').isMongoId(),
   check('coleccion').custom( col => coleccionesPermitidas( col, ['users', 'productos']) ),
   validarCampos

], actualizarImagenCloudinary );
// ], actualizarImagen );

router.get('/:coleccion/:id', [
   check('id', 'El id debe ser de mongo').isMongoId(),
   check('coleccion').custom( col => coleccionesPermitidas( col, ['users', 'productos']) ),
   validarCampos
], mostrarImagen )


module.exports = router;