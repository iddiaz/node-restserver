const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
   nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio']
   },
   correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
   },
   img: {
      type: String      
   },
   rol: {
      type: String,
      required: true,
      enum: ['ADMIN_ROLE', 'USER_ROLE' ]     
   },
   estado: {
      type: Boolean,
      dafault: true
          
   },
   google: {
      type: Boolean,
      dafault: false    
   }

});

//control de la visivilidad de la contraseña y __V
UsuarioSchema.methods.toJSON = function() {
   const { __v, password, ...user } = this.toObject();
   return user;
};



module.exports = model('Usuario', UsuarioSchema);