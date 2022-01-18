const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models')

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );


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

   //Limpiar imagenes previas

   if( modelo.img ){
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );

      if( fs.existsSync(pathImagen) ){
         fs.unlinkSync(pathImagen);
      }
   }
   

   const nombre = await subirArchivo( req.files, undefined, coleccion );
   modelo.img = nombre;

   await modelo.save();
  
   res.json( modelo );

}

const mostrarImagen = async(req, res = response ) =>{

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

   //Limpiar imagenes previas

   if( modelo.img ){
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );

      if( fs.existsSync(pathImagen) ){
         return res.sendFile( pathImagen )
      }
   }

   const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
   res.sendFile( pathImagen );
   

}

const actualizarImagenCloudinary = async(req, res = response ) => {

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

   //Limpiar imagenes previas

   if( modelo.img ){
      
      //todo...
   }

   const { tempFilePath } = req.files.archivo;

   const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
   

  
   modelo.img = secure_url;

   await modelo.save();
  
   res.json( modelo );

}




module.exports = {
   cargarArchivo,
   actualizarImagen,
   mostrarImagen,
   actualizarImagenCloudinary
}