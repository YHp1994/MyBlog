var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';
const ObjectId = require('objectid');

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats = db.collection('cats');
    cats.find().toArray((err,result1)=>{
      if(err) throw err;
      //获取文章信息
      let posts = db.collection('posts');
      posts.find().toArray((err,result2)=>{
        if(err) throw err;
        posts.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
          res.render('home/index',{cats:result1,posts:result2,hot: result3});
        });

      });
    });
  });

});

module.exports = router;
