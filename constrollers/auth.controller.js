const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');

const loginController = async(req, res = response ) => {

   console.log('req=>', req.body );
   const {correo, password } = req.body;

   try {

      //verificar si el email existe
      const usuario = await Usuario.findOne({ correo })
      if(!usuario){
         return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo'
         })
      }
      
      //verificar si elusuario está activo
      if( !usuario.estado ){
         return res.status(400).json({
            msg: 'Usuario / Password no son correctos - estado: false'
         })
      }

      //Verificar la contrseña
      const validPassword = bcryptjs.compareSync( password, usuario.password );
     
      if(!validPassword){
         return res.status(400).json({
            msg: 'Usuario / Password no son correctos - pasword'
         })
      }

      //generar el jwt
      const token = await generarJWT(usuario.id);

      res.json({
         msg: 'login ok',
         usuario,
         token
   
      })



   } catch (error) {
      
      console.log(error);      
      return res.status(500).json({
         msg: 'Algo salió mal'
      })
   }

 
}


module.exports = {
   loginController
}