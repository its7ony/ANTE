var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var mongoCliente = require("mongodb").MongoClient;
var url  = "mongodb://localhost:27017/ANTE_DB";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST login. */
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


/* POST validate */
router.post('/getUser', function(req, res, next) {
  let query = {username: req.body.user};
      mongoCliente.connect(url, function(err,db){
        if (err) throw err;
        db.collection("usuarios").find(query).toArray(function(err,result){
            res.json(result);
        });
      });
  
});

/* GET main. */
router.get('/main', function(req, res, next) {
  res.render('home');
});


/* GET main. */
router.get('/user', function(req, res, next) {
  res.render('user-edit');
});





module.exports = router;
