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

/*POST create_employee*/ 
router.post('/createEmployee', function(req, res, next){
    let query = {username: req.body.username, clave: req.body.clave, nombre: req.body.nombre , apellido_paterno: req.body.apellido_paterno, apellido_materno: req.body.apellido_materno, rol: 1, estatus: 1}
    mongoCliente.connect(url, function(err, db) {
      if (err) throw err;  
      db.collection('usuarios').insert(query, function(err, result) {
        if (err) throw err;
        res.send("OK");
        db.close();
      });
    });
});

/* GET employees*/
router.get('/employees', function(req, res, next) {
  res.render('employees');
});


/* GET add-employees*/
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
