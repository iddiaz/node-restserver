
const Role = require('../models/role');
const {Usuario, Categoria, Producto } = require ('../models');
;

const esRoleValido = async(rol = '') => {
   
   const existeRol = await Role.findOne({rol});
 
   if( !existeRol ){
      throw new Error (`El rol ${ rol }, no está registrado en la base de datos`)
   }
};

const esAdminRole = (rol = '') => {

};

const emailExiste = async( correo = '' ) =>{
      //verificar si existe el correo
      const existeEmail = await Usuario.findOne({ correo });

      if( existeEmail ){
         
         throw new Error (`El correo: ${correo}, ya está registrado`)
         
      }
   
}

const existeUsuarioPorId = async( id ) => {
   const existeUsuario = await Usuario.findById(id);
   if(!existeUsuario ) {
      throw new Error(`El id no existe ${ id }`);
   }
}

const existeCategoriaPorId = async( id ) => {

   // Verificar si el correo existe
   const existeCategoria = await Categoria.findById(id);
   if ( !existeCategoria ) {
       throw new Error(`El id de la catregoria no existe ${ id }`);
   }
}

const existeProductoPorId = async(id) => {

   const existeProducto = await Producto.findById(id);

   if ( !existeProducto ) {
       throw new Error(`El id del producto no existe ${ id }`);
   }

}

/**
* validar colecciones permitidas
*/ 
const coleccionesPermitidas = ( coleccion='', colecciones=[] ) =>{

   const incluida = colecciones.includes( coleccion );

   if( !incluida ) {
      throw new Error (`La coleccion ${coleccion}, no está permitida, ${colecciones}`)
   }

   return true;


}

module.exports = {
   esRoleValido,
   esAdminRole,
   emailExiste,
   existeUsuarioPorId,
   existeCategoriaPorId,
   existeProductoPorId,
   coleccionesPermitidas
   
}