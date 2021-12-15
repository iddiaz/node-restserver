const {response, request } = require('express');

const usersGet = ( req = request, res = response ) => {

   const{q, nombre = null,apikey, page=1, limit=1, etc=null } = req.query;
   
   res.json({   
      "msg": "get API - controlador",
      q,
      nombre,
      apikey,
      page,
      limit,
      etc
   });

}


const usersPut = (req, res = response) => {
   const id = req.params.id;
  
      res.json({      
         "msg": "put API - controlador",
         id
      });
   
}

const usersPost = (req, res = response) => {

   const {nombre, edad } = req.body;

   res.status(201).json({   
      "msg": "post API- controlador",
      nombre, 
      edad
   });
   
}

const usersDelete = (req, res = response)=> {
   
      res.json({
      
         "msg": "delete API - controlador"
      });
   
}

module.exports = {
   usersGet,
   usersPost,
   usersPut,
   usersDelete
}