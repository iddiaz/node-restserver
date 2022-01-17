const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');


const coleccionesPermitidas = [
   'usuarios', 'categoria', 'productos', 'roles'
];


const buscarUsuarios = async( termino = '', res = response )=>{

   const esMongoId = ObjectId.isValid( termino ); //TRUE

   if( esMongoId ){
      const usuario = await Usuario.findById( termino );
      return res.json({
         msg: 'Busqueda por id usuario...',
         results: ( usuario ) ? [ usuario ] : []

      });
   }
   // indica que el string no sea sensible a mayusculas y minusculas
   const regex = new RegExp( termino, 'i');


   const usuarios = await Usuario.find({ 
     // $or operador de mongo que indica cualqueira de estas condiciones 
      // $or: [ {nombre: regex, estado: true }, {correo: regex, estado: true} ]
      $or: [ {nombre: regex }, {correo: regex } ],
      $and: [{ estado: true } ] //ambas condiciones tienen que tener esta.
      
   });

   const total = await Usuario.count({      
       $or: [ {nombre: regex }, {correo: regex } ],
       $and: [{ estado: true } ] 
    });

   res.json({
      msg: 'Busqueda Usuarios...',
      total: total,
      results: usuarios

   });



}

buscarCategorias = async( termino = '', res = response ) => {

   const esMongoId = ObjectId.isValid( termino ); //TRUE

   if( esMongoId ){
      const categoria = await Categoria.findById( termino );
      return res.json({
         msg: 'Busqueda por id categoría...',
         results: ( categoria ) ? [ categoria ] : []

      });
   }
   
   const regex = new RegExp( termino, 'i');

   const categorias = await Categoria.find( {nombre: regex, estado: true } );
 
    res.json({
       msg: 'Busqueda Categorias...',
       results: categorias
 
    });

}

buscarProductos = async( termino = '', res = response ) => {

   const esMongoId = ObjectId.isValid( termino ); //TRUE

   if( esMongoId ){
      const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
      return res.json({
         msg: 'Busqueda por id Producto...',
         results: ( producto ) ? [ producto ] : []

      });
   }
   
   const regex = new RegExp( termino, 'i');

   const productos = await Producto.find({      
       $or: [ {nombre: regex }, {descripcion: regex } ],
       $and: [{ estado: true } ]
       
    }).populate('categoria', 'nombre');
 
    res.json({
       msg: 'Busqueda Productos...',
       results: productos
 
    });
   

}

const buscar = (req, res = response ) =>{

   const { coleccion, termino } = req.params;


   if( !coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
         msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
      })
   }

   switch (coleccion) {
      case 'usuarios':
         buscarUsuarios( termino, res );      
         break;

      case 'categoria':
         buscarCategorias( termino, res );         
         break;

      case 'productos':
         buscarProductos( termino, res );         
         break;
   
      default:
         res.status(500).json({
            msg: 'Error no esta implementada esta busqueda'
         })
       
   }



}


module.exports = {
   buscar
}