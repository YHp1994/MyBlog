/**
 * Created by acer on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

const ObjectId = require('objectid');

const multiparty = require('multiparty');
const fs = require('fs');

/* 访问后台文章显示页面 */
router.get('/', function(req, res, next) {
    // res.render('posts', { title: 'Express' });
    // res.send('显示文章');
    //res.render('admin/article_list');
//获取所有的文章
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let posts = db.collection('posts');
        posts.find().toArray((err,result) =>{
            if(err) throw err;
            res.render('admin/article_list',{data:result});
        });
    });


});

//后台文章添加页面
router.get("/add", function(req,res,next) {
    // res.send('显示添加文章的表单页面');
    //res.render('admin/article_add');
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let cats = db.collection('cats');
        cats.find().toArray((err,result) =>{
            if(err) throw err;
            res.render('admin/article_add',{cats:result});
        });
    });
});
//完成后台文章添加动作
router.post("/insert",function(req,res,next){
    //console.log(req.body);  //{}
    let form = new multiparty.Form({uploadDir:"public/tmp"});
    form.parse(req,(err,feilds,files) =>{
        //console.log(files);
        //console.log(feilds);
        //将图片从
        fs.renameSync(files.cover[0].path,"public/uploads/"+files.cover[0].originalFilename);


        let article = {
            title:feilds.title[0],
            cate:  feilds.cate[0],
            summary:feilds.summary[0],
            content:feilds.content[0],
            time:new Date(),
            count:Math.ceil( Math.random() * 100),
            cover:"uploads/"+files.cover[0].originalFilename
        };
        console.log(article.count);
        MongoClient.connect(url,(err,db)=>{
            if(err) throw err;
            let posts = db.collection("posts");
            posts.insert(article,(err,result)=>{
                if(err) {res.render("admin/message",{message:"添加文章失败"});}
                else  {res.render("admin/message",{message:"添加文章成功",url:"/admin/posts/add"});}
            });
        });
    });
   /* let cat = req.body.cat;
    let title = req.body.title;
    let summary = req.body.summary;
    let content = req.body.content;
    let time = new Date();
    let count = Math.ceil(Math.random())*100;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let posts = db.collection("posts");
        posts.insert({
            cat:cat,
            title:title,
            summary:summary,
            content:content,
            time:time,
            count:count
        },(err,result)=>{
            if(err) {res.render("admin/message",{message:"添加文章失败"});}
            else  {res.render("admin/message",{message:"添加文章成功",url:"/admin/posts/add"});}

        });
    });*/
});
//显示编辑后边分类的表单页面
//router.get("/edit",function(req,res,next){
//    // res.send("显示后台分类编辑的表单页面");
//    let id = req.query.id;
//    MongoClient.connect(url,(err,db)=>{
//        if(err) throw err;
//        let posts = db.collection('posts');
//        cats.find({_id:ObjectId(id)}).toArray((err,result)=>{
//            //将结果渲染的时候作文参数传递过去
//            if(err) throw err;
//            console.log(result[0].title);
//            //result是一个数组，数组中只包含一个对象
//            res.render('admin/article_edit',{cat:result[0]});
//        });
//    });
//});
//更新操作
//router.post("/update",function(req,res,next){
//    // res.send("显示后台分类编辑的表单页面");
//    let title = req.body.title;
//    let sort = req.body.sort;
//    let id = req.body.id;
//    MongoClient.connect(url,(err,db)=>{
//        if(err) throw err;
//        let cats = db.collection('cats');
//        cats.update({_id:ObjectId(id)},{title:title,sort:sort},(err,result)=>{  //此处不要写res,会覆盖掉serverresponse对象
//            if(err) {res.render("admin/message",{message:"修改文章失败"});}
//            else  {res.render("admin/message",{message:"修改文章成功",url:"/admin/cats/"});}
//        });
//    });
//
//});
//删除文章
router.get("/delete",(req,res,next)=>{
    //需要获取_id
    let id = req.query.id;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let posts = db.collection('posts');
        posts.remove({_id:ObjectId(id)},(err,result)=>{
            //将结果渲染的时候作文参数传递过去
            if(err) {res.render("admin/message",{message:"删除文章失败"});}
            else  {res.render("admin/message",{message:"删除文章成功",url:"/admin/posts/"});}
        });
    });
});

module.exports = router;
