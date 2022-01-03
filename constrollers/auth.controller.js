const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

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


const googleSignIn = async(req= request, res= response)=>{
  
   const { id_token } = req.body;

   try { 
     
      const { nombre, img, correo } = await googleVerify( id_token );

      let usuario = await Usuario.findOne({correo});
      
      if( !usuario ) {
         //hay que crearlo si no existe
         const data =  {
            nombre,           
            correo,
            password: ':P',
            img,
            rol: "USER_ROLE",
            estado: true,
            google: true
            
         }

         usuario = new Usuario(data);
         await usuario.save();

      }

      if(!usuario.estado){
         return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
         })
      }

      //generar el jwt
      const token = await generarJWT(usuario.id);



      res.json({
         usuario,
         token 
      });


   } catch(error) {

      res.status(400).json({
         ok: false,
         msg:'El token no se pudo verificar',
         error
      })
   
   }

}


module.exports = {
   loginController,
   googleSignIn
}