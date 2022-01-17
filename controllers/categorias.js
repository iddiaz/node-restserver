const { request, response } = require('express');
const { Categoria } = require('../models')


//ObtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response )=>{
  
   const {limite = 5, desde= 0 } = req.query;
   const query= { estado: true }

      
   const [total, categorias] = await Promise.all([
         Categoria.countDocuments(query),
         Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
   ])

   res.json({
      msg: 'GET-OK',
      total,
      categorias
   })
}


//obtenerCategoria - populate {}
const obtenerCategoria = async(req= request, res= response ) => {

   const {id} = req.params;

   const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
 

   res.status(201).json({
      msg:'GET ID -OK',
      categoria

   });



}





const crearCategoria = async(req, res = response ) => {
   
   const nombre = req.body.nombre.toUpperCase(); 
 
   const categoriaDB = await Categoria.findOne({nombre});
   
   if ( categoriaDB ) {
      return res.status(400).json({
         msg: `La categoria ${categoriaDB.nombre}, ya existe.`
      })
   }


   //Generar Data a guardar
   const data = {
      nombre,
      usuario: req.usuarioAuth._id
   }

   console.log(data);

   const categoria = new Categoria(data);
   
   //guardar en DB
   await categoria.save();

   res.status(201).json(categoria); 



}


const actualizarCategoria = async( req, res = response ) => {
   
   const {id} = req.params;
   // console.log('req===========', req);
   const { estado, usuario, ...data } = req.body;

   data.nombre = data.nombre.toUpperCase();
   data.usuario = req.usuarioAuth._id;

   const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

   res.status(201).json(categoria);
}


//BorrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
   const {id} = req.params;
   const categoriaBorrada = await Categoria.findByIdAndUpdate( id, {estado:false}, {new:true} );

   res.status(201).json(categoriaBorrada);
}


module.exports = {
   crearCategoria,
   obtenerCategorias,
   obtenerCategoria,
   actualizarCategoria,
   borrarCategoria
}