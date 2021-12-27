const {response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usersGet = async( req = request, res = response ) => {

   // const{q, nombre = null,apikey, page=1, limit=1, etc=null } = req.query;
   // console.log('req.query', req.query);
   const {limite = 5, desde= 0 } = req.query;
   const query= { estado: true }

   // const usuarios = await Usuario.find( query )
   //    .skip( Number(desde) )
   //    .limit( Number(limite) );

   // const total = await Usuario.countDocuments( query );

   //Optimización de promesas en cadena
   const [total, usuarios] = await Promise.all([
      Usuario.countDocuments( query ),
      Usuario.find( query )
         .skip( Number(desde) )
         .limit( Number(limite) )
   ])
   
   res.json({
      total,  
      usuarios
      // resp
   });



}

const usersPost = async (req, res = response) => {

   console.log('body', req.body);
   const {nombre, correo, password, rol, google, estado }  = req.body;
   const usuario = new Usuario( {nombre, correo, password, rol, google, estado } );
   console.log('usuario', usuario);

   //Encriptar contraseña
   const salt = bcryptjs.genSaltSync();
   usuario.password = bcryptjs.hashSync(password, salt);

   //guardar en bd
   await usuario.save();

   res.status(201).json({   
    
      usuario
   
   });
   
}


const usersPut = async(req, res = response) => {
  
   const { id } = req.params;
   const { _id, password, google, correo, ...resto } = req.body;  
   // console.log('resto=>>', resto);

   //TODO validar contra BD
   if( password ) {
      //Encriptar contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);

   }

   const usuario = await Usuario.findByIdAndUpdate( id, resto );

   res.json( usuario );
   
}



const usersDelete = async(req, res = response)=> {

   const {id} = req.params;

   //Borrado Fisico del objeto:
   // const usuario = await Usuario.findByIdAndDelete( id );
   
   const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} );

   

   
      res.json({      
         "msg": "usuario borrado",
         usuario
      });
   
}

module.exports = {
   usersGet,
   usersPost,
   usersPut,
   usersDelete
}