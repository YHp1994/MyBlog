/**
 * Created by acer on 2016/12/16.
 */
var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';
const ObjectId = require('objectid');

const markdown = require('markdown').markdown;

/* 访问文章页面 */
router.get('/', function(req, res, next) {
    //res.render('home/posts');
    let id = req.query.id;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let posts = db.collection('posts');
        posts.find({_id:ObjectId(id)}).toArray((err,result)=>{
            if(err) throw err;
            //res.render('home/posts',{data:result[0]});
            //res.send(markdown.toHTML(result[0].content));
            let article = {
                title:result[0].title,
                time:result[0].time,
                count:result[0].count,
                summary:result[0].summary,
                content:markdown.toHTML(result[0].content)
            };
            let cats = db.collection('cats');
            cats.find().toArray((err,result1)=>{
                if(err) throw err;
                //获取文章信息
                let posts = db.collection('posts');
                posts.find().toArray((err,result2)=>{
                    if(err) throw err;
                    posts.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
                        res.render('home/posts',{data:article,cats:result1,posts:result2,hot: result3});
                    });

                });
            });
        });
        });
    });

module.exports = router;
