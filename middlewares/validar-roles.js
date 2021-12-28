const { request, response } = require("express");

const esAdminRole = ( req = request, res = response, next ) => {

   if( !req.usuarioAuth ){
      return res.status(500).json({
         msg: 'Se quiere verificar el role sin validar el token primero'
      })
   }

   const {rol, nombre } = req.usuarioAuth;

   if(rol !== 'ADMIN_ROLE'){
      return res.status(401).json({
         msg: `${nombre} no es administrador - no puede hacer eso` 
      })
   }

   next();

}

const tieneRole = ( ...roles ) => {

   return ( req = request, res = response, next ) => {
     
      if( !req.usuarioAuth ){
         return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
         })
      }

      if( !roles.includes( req.usuarioAuth.rol ) ){
        
         return res.status(401).json({
            msg : `El servicio requiere uno de estos roles ${roles}`
         })
      }

      console.log(roles, req.usuarioAuth.rol);

      next();
   }

}

module.exports = {
   esAdminRole,
   tieneRole
}