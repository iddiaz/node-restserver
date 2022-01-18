const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models')


const cargarArchivo = async( req, res = response) => {


   try {
     
      // const nombreFichero = await subirArchivo( req.files, ['jpg','txt', 'md'], 'textos' );
      const nombreFichero = await subirArchivo( req.files, undefined, 'images' );
      
         res.json({
            nombre: nombreFichero
         })
         

   } catch(err) {

      res.status(400).json({
         msg: err
      })

   }


}


const actualizarImagen = async(req, res = response ) => {

   const{ id, coleccion } = req.params;

   let modelo;

   switch (coleccion) {
      case 'users':

         modelo = await Usuario.findById(id);
         if(!modelo) {
            return res.status(400).json({
               msg: `No existe ningun usuario con el id ${id}`
            })
         }
         
         break;

      case 'productos':

         modelo = await Producto.findById(id);
         if(!modelo) {
            return res.status(400).json({
               msg: `No existe ningun producto con el id ${id}`
            })
         }
         
         break;
   
      default:
         return res.status(500).json({msg: 'No esta creado este caso de validación'})
   }

   //Limpiar imagnees previas
   
   

   const nombre = await subirArchivo( req.files, undefined, coleccion );
   modelo.img = nombre;

   await modelo.save();
  
   res.json( modelo );

}



module.exports = {
   cargarArchivo,
   actualizarImagen
}