var express = require('express');
var app = require('express').createServer();
var mongoose = require('mongoose');
var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set("view options", { layout: false });
app.use(express.bodyParser());
mongoose.connect('mongodb://localhost/crud');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
  ref          : ObjectId,
  user_name    : String,
  age     	   : String,
});

var Post = mongoose.model('User', PostSchema);

app.get('/', function(req,res) {
	existemPosts = false;
	Post.find({}, function (err, rs) {
	totalPosts = rs.length;
	  if(totalPosts) 
	  	existemPosts = true;
      res.render('list.ejs',{existemPosts: existemPosts, posts: rs});
	});
});

app.get('/newpost', function(req,res) {
	console.log("Abrindo formulario de cadastro.");
	res.render('new.ejs');
});

app.post('/newpost', function(req,res) {
	console.log(req.body);
	post = new Post();
	post.user_name = req.body.uname;
	post.age  = req.body.age;
	post.save(function(err) {
		console.log("Novo post cadastrado com sucesso!");
		res.redirect('/');
	});
});

app.get('/editpost/:id', function(req, res) {
	Post.find({_id: req.params.id}, function(err, docs) {
		console.log("Update user details with ID: "+req.params.id);
		res.render('edit.ejs', {posts: docs[0]});	
	});
});

app.post('/editpost', function(req, res) {
	Post.find({_id: req.body.objid}, function(err, docs) {
		console.log(req.body);
		docs[0].user_name = req.body.uname;
		docs[0].age = req.body.age;
		docs[0].save(function(err) {
			console.log("Documento atualizado com sucesso!");
			res.redirect('/');
		});
	});
});

app.get('/deletepost/:id', function(req, res) {
	Post.find({_id: req.params.id}, function(err, docs) {
		docs[0].remove(function() {
			console.log("Documento removido com sucesso!");
			res.redirect('/');
		});
	});
});


app.listen(3000);
console.log("Server running at 127.0.0.1:3000");

