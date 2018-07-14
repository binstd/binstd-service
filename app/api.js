const router = require('koa-router')()
var db = require('./utils/mysql');
var crypto = require('crypto');
var moment = require('moment');

router.prefix('/api')

router.get('/', function (req, next) {
  console.log(req.request.body);
  console.log(req.query);
  req.body = 'this is !'
})

router.get('/contact', async (req, next) => {
  var keyinfo, resultData = {};
  let uid = req.query.uid;
  if (req.query.uid) {
    keyinfo = await db.select('user_contact', {
      where: {
        uid: uid
      }
    });
  }
  if (keyinfo.length != 0) {
    resultData = { 'status': 1, 'data': keyinfo };
  } else {
    resultData = { 'status': 0 };
  }
  console.log(resultData);
  req.body = resultData
})
// 获取token列表
router.get('/tokens', async (req, next) => {
  var keyinfo, resultData = {};
  let uid = req.query.uid;
  keyinfo = await db.select('user_token', {
    where: {
      uid: 1,
      showed: 1
    }
  });
  if (keyinfo.length != 0) {
    resultData = { 'status': 1, 'data': keyinfo };
  } else {
    resultData = { 'status': 0 };
  }
  req.body = resultData
})

//注册
router.get('/signup', async (req, next) => {
  let result = {
    status: 0,
    message: '未输入'
  }
  let keyinfo = {}
  let telephone = req.query.telephone;
  let password = req.query.password;
  let privatekey = req.query.privatekey;
  let address = req.query.address;
  let row = {
    telephone: telephone,
    password: password,
    privatekey: privatekey,
    address: address
  };

  if (req.query.telephone && req.query.password) {
    keyinfo = await db.query('SELECT uid,telephone,address,privatekey,username,img_url FROM user WHERE telephone=?', [telephone]);
    console.log(keyinfo);
    if (keyinfo.length == 1) {
      result['status'] = 3;
      result['message'] = '手机号已存在,请登陆';
    } else {
      result = await db.insert('user', row);
      if (result['affectedRows'] == 1) {
        result['status'] = 1;
        result['message'] = '注册成功';
      } else {
        result['status'] = 0;
        result['message'] = '注册失败';
      }
    }
  }
  console.log('登陆后返回:', result);
  req.body = result;
})

//登陆
router.post('/signin', async (req, next) => {
  var keyinfo, resultData = {};
  console.log(req.request.body);

  if (req.request.body.telephone && req.request.body.password) {
    let telephone = req.request.body.telephone;
    let password = req.request.body.password;
    keyinfo = await db.query('SELECT uid,telephone,address,privatekey,username,img_url,pay_password FROM user WHERE telephone=? AND password=?', [telephone, password]);
  }
  console.log(keyinfo);
  if (keyinfo.length == 1) {
    resultData = { 'status': 1, 'data': keyinfo[0] };
  } else {
    resultData = { 'status': 0, 'message': '账号或密码错误' };
  }
  console.log(resultData);
  req.body = await resultData
})


//注册
router.post('/addcontact', async (req, next) => {
  let result = {
    status: 0,
    message: '未输入'
  }

  let keyinfo = {}
  let contact_address = req.query.contact_address;
  let uid = req.query.uid;
  let contact_name = req.query.contact_name;
  let row = {
    uid: uid,
    contact_address: contact_address,
    contact_name: contact_name
  };
  if (req.query.contact_address && req.query.uid) {
    keyinfo = await db.query('SELECT uid,contact_name,contact_uid,contact_address FROM user_contact WHERE contact_address=? AND uid=?', [contact_address, uid]);
    if (keyinfo.length == 1) {
      result['status'] = 3;
      result['message'] = '该联系人已存在';
    } else {
      result = await db.insert('user_contact', row);
      if (result['affectedRows'] == 1) {
        result['status'] = 1;
        result['message'] = '添加成功';
      } else {
        result['status'] = 0;
        result['message'] = '添加失败';
      }
    }
  }

  req.body = result;
})


/* get user name */
router.post('/updatename', async (req, next) => {
  // console.log('get请求参数对象 :',req.query);  
  var keyinfo = {}
  let uid = req.query.uid;
  let username = req.query.username;
  let row = {
    username: username
  };
  // console.log('p:', username);
  console.log('是我呀');
  console.log('row:', row);
  if (req.query.username && req.query.uid) {

    keyinfo = await db.update('user', row, { where: { uid: uid } });
  }
  console.log(keyinfo);

  req.body = keyinfo;
});


router.post('/updatephone', async (req, res) => {
  var keyinfo = {}
  let uid = req.query.uid;
  let telephone = req.query.phone;
  let row = {
    telephone: telephone
  };
  console.log('是我呀');
  console.log('row:', row);
  if (req.query.phone && req.query.uid) {
    keyinfo = await db.update('user', row, { where: { uid: uid } });
  }
  console.log(keyinfo);
  req.body = keyinfo;

});

router.post('/updatepaypassword', async (req, res) => {
  var keyinfo = {}
  let uid = req.query.uid;
  let paypassword = req.query.password;
  let row = {
    pay_password: paypassword
  };
  console.log('row:', row);
  if (req.query.password && req.query.uid) {
    keyinfo = await db.update('user', row, { where: { uid: uid } });
  }
  console.log(keyinfo);
  req.body = keyinfo;
});


router.get('/user', async (req, res) => {
  let rows = await db.select('tags', { columns: ['id', 'name', 'feature_image', 'slug', 'all_child'] });
  console.log(rows);
  req.body = rows;
  // res.send(rows);
});

router.get('/verify', async (req, res) => {
  let rows = {};
  
  rows['code'] =  Math.random().toString().slice(-6);
  console.log(rows);
  var today = moment();
  var time = today.format('YYYYMMDDHHmmss'); /*现在的年*/
  // YYYY-MM-DD HH:mm:ss
  console.log('time:', time);
  let password = 'jhD72SVM';
  let md5password = crypto.createHash('md5').update(password).digest('hex');
  let msgpass = crypto.createHash('md5').update(md5password + time).digest('hex');
  console.log('msgpass:', msgpass);

  

  req.body = rows;
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
