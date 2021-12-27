const Role = require('../models/role');
const Usuario = require ('../models/usuario');

const esRoleValido = async(rol = '')=>{
   const existeRol = await Role.findOne({rol});
 
   if( !existeRol ){
      throw new Error (`El rol ${ rol }, no está registrado en la base de datos`)
   }
};

const emailExiste = async ( correo = '' ) =>{
      //verificar si existe el correo
      const existeEmail = await Usuario.findOne({ correo });

      if( existeEmail ){
         
         throw new Error (`El correo: ${correo}, ya está registrado`)
         
      }
   
};

const existeUsuarioPorId = async( id ) => {
   const existeUsuario = await Usuario.findById(id);
   if(!existeUsuario ) {
      throw new Error (`El id ${id}, no existe en la bd`);
   }
}

module.exports = {
   esRoleValido,
   emailExiste,
   existeUsuarioPorId
}