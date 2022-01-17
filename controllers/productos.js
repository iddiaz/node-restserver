const {request, response} = require('express');
const { Producto } = require('../models');

//getProductos
const obtenerProductos = async(req, res = response) => {

   const {limite = 5, desde= 0 } = req.query;
   const query= { estado: true }

   const [total, productos] = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
   ])

   res.json({
      total,
      productos
   })
   
}
//getProducto
const obtenerProducto = async(req, res = response) => {

   const {id} = req.params;

   const producto = await Producto.findById( id )
                                 .populate('usuario', 'nombre')
                                 .populate('categoria', 'nombre');
 

   res.status(201).json({     
      producto
   });

}

const crearProducto = async(req, res = response ) => {
   
   const {estado, usuario, ...body } = req.body;    
   
   const productoDB = await Producto.findOne( { nombre: body.nombre } );

   

   if( productoDB ){
      
      return res.status(400).json({
         msg: `El producto ${ productoDB } ya existe`
      })
      
   }
   
   console.log('productoDB???????22', productoDB );
   const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuarioAuth._id
   }

  

   const producto = new Producto( data );
   await producto.save();
   

   res.status(201).json({
      msg: 'Crear Producto ok',
      producto
    
   })
   
}

const actualizarProducto = async(req, res = response) =>{
   
   const {id} = req.params;

   const { estado, usuario, ...body } = req.body;

   if(body.nombre){
      body.nombre = body.nombre.toUpperCase();
   }

   body.usuario = req.usuarioAuth._id;

   const producto = await Producto.findByIdAndUpdate(id, body, {new: true});

   res.status(201).json(producto);
}


const borrarProducto = async(req, res = response) =>{
   
   const {id} = req.params;
   const productoBorrado = await Producto.findByIdAndUpdate( id, {estado:false}, {new:true} );

   res.status(201).json(productoBorrado);
}

module.exports = {
   obtenerProductos,
   obtenerProducto,
   crearProducto,
   actualizarProducto,
   borrarProducto
}