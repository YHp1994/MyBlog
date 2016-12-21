var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';
/* GET users listing. */
router.get('/login', function(req, res, next) {
    if(req.session.isLogin){
        res.redirect('back');
    }else{
        res.render('admin/login');
    }

});

router.post('/signin', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let user = db.collection('user');
    user.find({username:username,password:password}).toArray((err,result)=>{
        if (result.length){
          //ok，保存登录的标志，然后跳转到首页面
          req.session.isLogin = 1;
          res.redirect("/admin");
        }else{
          //用户名密码错误
            res.redirect('/user/login');
        }
    });
  });
});

//用户注销
router.get('/logout',(req,res,err)=>{
    req.session.isLogin = 0;
    req.session.destroy();
    res.redirect('/users/login');
});


module.exports = router;
