const jwt = require('jsonwebtoken');

const { request, response } = require('express');
const res = require('express/lib/response');

const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next ) =>{
   const token = req.header('x-token');
   console.log(token);

   if(!token){
      return res.status(401).json({
         msg: 'No hay token en la petición'
      });
   }
   
   try {
   
      const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY )
      // console.log(payload);
      req.uid = uid;

      //leer el usuario que corresponde al uid
      const usuarioAuth = await Usuario.findById( uid );
      if( !usuarioAuth ){
         return res.status(401).json({
            msg: 'Token no válido - usuario no existe en bd'
         })
      }


      //verificar si el uid tiene estado en true
      if( !usuarioAuth.estado ){
         return res.status(401).json({
            msg: 'Token no válido - usuario con estado: false'
         })
      }

     
      req.usuarioAuth = usuarioAuth;   
      next();
   
   } catch(error){
      console.log(error);
      res.status(401).json({
         msg: 'token no válido'
      })
   }


}


module.exports = {
   validarJWT
}