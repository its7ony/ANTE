var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var mongoCliente = require("mongodb").MongoClient;
var url  = "mongodb://localhost:27017/ANTE_DB";



/* GET home_page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET orders*/
router.get('/orders', function(req, res, next) {
  res.render('orders');
});

/* POST login */
router.post('/home', function(req, res, next) {

  let query = {username: req.body.user, clave: req.body.pwd};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            console.log(result);
            res.json(result);
        });
      });
  
});

/* POST validate */
router.post('/validate', function(req, res, next) {
  let query = {username: req.body.user};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            res.json(result[0].rol);
        });
      });
  
});


/* POST user */
router.post('/getUser', function(req, res, next) {
  let query = {username: req.body.user};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            res.json(result);
        });
      });
});

/*MOVIL*/

/* POST login */
router.post('/login', function(req, response, next) {
    mongoCliente.connect(url, function(err,db){
      if (err) throw err;
    db.collection("usuarios").find({"username":req.body.user}).count(function(err,number){
      if(number == 0)
      {
        response.json(0); 
      }else{
        db.collection("usuarios").find({"username":req.body.user,"clave":req.body.password}).toArray(function(err,user){
          if(user[0] != null){
            if(user[0].clave == req.body.password){
              response.json(1);
            }
            else{
              response.json(2);
            }
          }else{
            response.json(2);
          }
        }); 
      }
    });
  });  
});


/*POST traer_rutas_pendientes*/
router.post('/traerRutasPendientes', function(req, res, next) {
  mongoCliente.connect(url, function(err,db){
    if (err) throw err;
      db.collection("rutas").find({"estatus":1}).toArray(function(err,result){  
        res.json(result); 
      });  
  });
});

/*POST traer_rutas*/
router.post('/traerRutas', function(req, res, next) {
  mongoCliente.connect(url, function(err,db){
    if (err) throw err;
      db.collection("rutas").find({"repartidor":req.body.user,"estatus":0}).count(function(err,number){
      if(number == 0)
      {
        res.json(0); 
      }
      else{
        db.collection("rutas").findOne({"repartidor":req.body.user}).toArray(function(err,ruta){
          res.json(ruta);
        }); 
      }
    });
  });  
});


/* POST edit_user*/
router.post('/editUser', function(req, res, next) {
  let user = req.body.username;
  let query = {username: req.body.username, clave: req.body.clave, nombre: req.body.nombre , apellido_paterno: req.body.apellido_paterno, apellido_materno: req.body.apellido_materno, rol: 0, estatus: 1}
   
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('usuarios').update({username: user}, {$set: query}, function(err, result) {
      if (err) throw err;
      console.log("Documento actualizado");
      res.send("OK");
      db.close();
    });
  });
});

/* POST get_employees*/
router.post('/getEmployees', function(req, res, next) {
  let query = {rol: 1,  estatus:1};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            res.json(result);
        });
      });
});

/* POST get_available*/
router.post('/getEmployeesA', function(req, res, next) {
  let query = {rol: 1,  estatus:1, disponible:true};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            res.json(result);
        });
      });
});


/* POST get_Orders*/
router.post('/getOrders', function(req, res, next) {
  let tablas = [];
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        //PENDIENTES
        db.collection("rutas").find({estatus:0}).toArray(function(err,result){
          tablas.push(result);

          mongoCliente.connect(url, function(err,db){
            if (err) throw err;
            //EN PROCESO
            db.collection("rutas").find({estatus:1}).toArray(function(err,result){
              tablas.push(result);

              mongoCliente.connect(url, function(err,db){
                if (err) throw err;
                //TERMINADAS
                db.collection("rutas").find({estatus:2}).toArray(function(err,result){
                  tablas.push(result);
                    res.json(tablas);
                });
              });
            });
          });
        });
      });
});


/* POST delete_employe*/
router.post('/deleteEmploye', function(req, res, next) {
  let user = req.body.user;
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('usuarios').update({username: user}, {$set: {estatus: 0}}, function(err, result) {
      if (err) throw err;
      console.log("Documento actualizado");
      res.send("OK");
      db.close();
    });
  });
});

/* POST update_employee*/
router.post('/updateEmployee', function(req, res, next) {
  let user = req.body.user;
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('usuarios').update({username: user}, {$set: {disponible: false}}, function(err, result) {
      if (err) throw err;
      console.log("Documento actualizado");
      res.send("OK");
      db.close();
    });
  });
});


/* POST update_order_pending*/
router.post('/updateOrder', function(req, res, next) {
  let user = req.body.user;
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('rutas').update({username: user, estatus:0}, {$set: {estatus: 1}}, function(err, result) {
      if (err) throw err;
      console.log("Documento actualizado");
      res.send("OK");
      db.close();
    });
  });
});


/* POST update_order_done*/
router.post('/updateOrderDone', function(req, res, next) {
  let user = req.body.user;
  let final_time = req.body.time;
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('rutas').update({username: user, estatus:1}, {$set: {estatus: 2, tiempo_Final:final_time}}, function(err, result) {
      if (err) throw err;
      console.log("Documento actualizado");
      res.send("OK");
      db.close();
    });
  });
});

/*POST create_employee*/ 
router.post('/createEmployee', function(req, res, next){
    let query = {username: req.body.username, clave: req.body.clave, nombre: req.body.nombre , apellido_paterno: req.body.apellido_paterno, apellido_materno: req.body.apellido_materno, rol: 1, disponible: req.body.disponible, estatus: 1}
    mongoCliente.connect(url, function(err, db) {
      if (err) throw err;  
      db.collection('usuarios').insert(query, function(err, result) {
        if (err) throw err;
        res.send("OK");
        db.close();
      });
    });
});


/*POST create_route*/ 
router.post('/createRoute', function(req, res, next){
  let ruta = req.body.route;
  ruta = JSON.parse(ruta);

  let query = {id: ruta.id, estatus: ruta.estatus, fecha: ruta.fecha , coordenadas: ruta.coordenadas, descripcion: ruta.descripcion, repartidor: ruta.repartidor, tiempo_Inicial: ruta.tiempo_Inicial, tiempo_Final: ruta.tiempo_Final}
  mongoCliente.connect(url, function(err, db) {
    if (err) throw err;  
    db.collection('rutas').insert(query, function(err, result) {
      if (err) throw err;
      res.send("OK");
      db.close();
    });
  });
});



/* GET tracker*/
router.get('/tracking', function(req, res, next) {
  res.render('tracking');
});

/* GET employees*/
router.get('/employees', function(req, res, next) {
  res.render('employees');
});

/* GET add_order. */
router.get('/add-order', function(req, res, next) {
  res.render('add-order');
});



/* GET add_employees*/
router.get('/add-employee', function(req, res, next) {
  res.render('add-employee');
});


/* GET main. */
router.get('/main', function(req, res, next) {
  res.render('home');
});


/* GET user_edit */
router.get('/user', function(req, res, next) {
  res.render('user-edit');
});


module.exports = router;
