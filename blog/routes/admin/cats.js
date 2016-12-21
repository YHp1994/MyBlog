/**
 * Created by acer on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

const ObjectId = require('objectid');
//所有/admin/cats开头的路由，都从这过
//凡是cats后面的/的内容，可以再次进行路由处理
//  /admin/cats 交给/
//  /admin/cats/add   交给/add
//  /admin/cats/edit  交给/edit

//访问后台分类显示页面
router.get('/', function(req, res, next) {
    // res.send('显示分类');
    //需要连接数据库，获取数据库，渲染到模板页面
    MongoClient.connect(url,(err,db)=>{
       if(err) throw err;
       let cats = db.collection('cats');
        cats.find().toArray((err,result)=>{
            if(err) throw err;
            //将结果渲染的时候作文参数传递过去
            res.render('admin/category_list',{data:result});
        });
    });
});
//删除分类
router.get("/delete",(req,res,next)=>{
    //需要获取_id
    let id = req.query.id;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let cats = db.collection('cats');
        cats.remove({_id:ObjectId(id)},(err,result)=>{
            //将结果渲染的时候作文参数传递过去
            if(err) {res.render("admin/message",{message:"删除分类失败"});}
            else  {res.render("admin/message",{message:"删除分类成功",url:"/admin/cats/"});}
        });
    });
});

//后台分类添加页面
router.get("/add", function(req,res,next) {
    // res.send('显示添加分类的表单页面');
    res.render('admin/category_add');
});
//完成后台分类添加动作
router.get("/insert",function(req,res,next){
    res.send("完成添加分类动作")
});
//
router.post("/insert",function(req,res,next){
    //res.send("post完成添加分类动作");
    //console.log(req.body)
    let title = req.body.title;
    let sort = req.body.sort;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let cats = db.collection('cats');
        cats.insert({title:title,sort:sort},(err,result)=>{  //此处不要写res,会覆盖掉serverresponse对象
            if(err) {res.render("admin/message",{message:"添加分类失败"});}
            else  {res.render("admin/message",{message:"添加分类成功",url:"/admin/cats/add"});}
        });
    });

});

//显示编辑后边分类的表单页面
router.get("/edit",function(req,res,next){
    // res.send("显示后台分类编辑的表单页面");
    let id = req.query.id;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let cats = db.collection('cats');
        cats.find({_id:ObjectId(id)}).toArray((err,result)=>{
            //将结果渲染的时候作文参数传递过去
            if(err) throw err;
            console.log(result[0].title);
           //result是一个数组，数组中只包含一个对象
            res.render('admin/category_edit',{cat:result[0]});
        });
    });

});
//更新操作
router.post("/update",function(req,res,next){
    // res.send("显示后台分类编辑的表单页面");
    let title = req.body.title;
    let sort = req.body.sort;
    let id = req.body.id;
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        let cats = db.collection('cats');
        cats.update({_id:ObjectId(id)},{title:title,sort:sort},(err,result)=>{  //此处不要写res,会覆盖掉serverresponse对象
            if(err) {res.render("admin/message",{message:"修改分类失败"});}
            else  {res.render("admin/message",{message:"修改分类成功",url:"/admin/cats/"});}
        });
    });

});


module.exports = router;