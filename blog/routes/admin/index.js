/**
 * Created by acer on 2016/12/17.
 */
var express = require('express');
var router = express.Router();

/* 后台首页 */
router.get('/', function(req, res, next) {
    res.render('admin/admin');
});
module.exports = router;