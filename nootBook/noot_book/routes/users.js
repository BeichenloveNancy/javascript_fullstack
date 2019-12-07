const router = require('koa-router')()
const userService = require('../controllers/mySqlConfig')
//引入utils中的方法
const utils = require('../controllers/utils')

router.prefix('/users') //路由前缀

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.get('/all', async(ctx, next) => {
  await userService.getAllUsers()
  .then((res) => {
    console.log('打印结果' + JSON.stringify(res))
    ctx.body = res
  })
})
// 登录
router.post('/userLogin', async (ctx, next) => {
  var _username = ctx.request.body.username
  var _userpwd = ctx.request.body.userpwd
  console.log(_username, _userpwd)

  await userService.userLogin(_username, _userpwd)
  .then( res => {
    let r = ''
    // console.log(res);
    if(res.length) {
      r = 'ok';
      let result = {
        id: res[0].id,
        nickname: res[0].nickname,
        username: res[0].username
      }
      ctx.body = {
        code: "200",
        data: result,
        mess: '登录成功'
      }
    } else {
      r = 'error';
      ctx.body = {
        code: '404',
        data: r,
        mess: '账号或密码错误'
      }
    }
  })
  .catch((err) => {
    ctx.body = {
      code: '500',
      data: err
    }
  })
})
// 注册
router.post('/userRegister', async (ctx, next) => {
  let username = ctx.request.body.username;
  let userpwd = ctx.request.body.userpwd;
  let nickname = ctx.request.body.nickname;
  if (!username || !userpwd || !nickname) {
    ctx.body = {
      code: '80000',
      mess: '账号、密码和昵称不能为空'
    }
  }
  let user = {
    username: username,
    userpwd: userpwd,
    nickname: nickname
  }
  await userService.findUser(user.username).then(async (res) => {
    // console.log(res);
    if (res.length) {
      try {
        throw Error('用户名已存在')
      }catch(error) {
        console.log(error)
      }
      ctx.body = {
        code: '80003',
        data: 'err',
        mess: '用户名已存在'
      }
    }else {
      await userService.insertUser([user.username, user.userpwd, user.nickname])
      .then( res => {
        // console.log(res)
        let r = ''
        if (res.affectedRows !== 0){
          r = 'ok'
          ctx.body = {
            code: '200',
            data: r,
            mess: '注册成功'
          }
        }
        else {
          r = 'error'
          ctx.body = {
            code: '500',
            data: r,
            mess: '注册失败'
          }

        }
      })
      .catch((err) => {
          ctx.body = {
            code: '505',
            data:err
          }
      })
    }
  })
})

//根据分类名称查找对应的笔记列表
router.post('/findNoteListBytype', async(ctx, next) => {
  //获取前端传过来的
  let note_type = ctx.request.body.note_type
  // console.log(note_type)
  await userService.findNoteListBytype(note_type)
  .then(async (res) => {
    // console.log(res)
    let r = ''
    if (res.length) {
      r = 'ok'
      ctx.body = {
        code: '200',
        data: res,
        mess: '查找成功'
      }
    }else {
      r = 'error'
      ctx.body = {
        code: '404',
        data: r,
        mess: '查找失败'
      }
    }
  })
  .catch((err) => {
    ctx.body = {
      code: '500',
      data: err,
      mess: '服务器出小差了'
    }
  })
})

//根据id查找对应的笔记详情
router.post('/findNoteDetailById', async(ctx, next) => {
  let id = ctx.request.body.id
  await userService.findNoteDetailById(id)
  .then(async (res)=>{
    let r =''
    if(res.length) {
      r = 'ok'
      ctx.body = {
        code: '200',
        data: res[0],
        mess: '查找成功'
      }
    }else{
      r = 'error'
      ctx.body = {
        code: '404',
        data: r,
        mess: '查找失败'
      }
    }
  })
  .catch((err) => {
    ctx.body = {
      code: '8000',
      data: err,
      mess: '服务器出小差了'
    }
  })
})

//提交笔记
router.post('/insertNote', async(ctx, next) => {
  //接受前端发来的参数
  let c_time = utils.getNowFormatDate()
  let m_time = utils.getNowFormatDate()
  let note_content = ctx.request.body.note_content
  let head_img = ctx.request.body.head_img
  let title = ctx.request.body.title
  let note_type = ctx.request.body.note_type
  let useId = ctx.request.body.useId
  let nickname = ctx.request.body.nickname
  await userService.insertNote([c_time,m_time,note_content,head_img,title,note_type,useId,nickname])
  .then(async (res) => {
    //判断是否成功存入数据库
    let r = ''
    console.log(res)
    if (res.affectedRows != 0) {
      r = 'ok'
      ctx.body = {
        code: '200',
        data: r,
        mess: '发表成功'
      }
    }else{
      r = 'error'
      ctx.body = {
        code: '500',
        data: r,
        mess: '发表失败'
      }
    }
  })
  .catch((err) => {
    ctx.body = {
      code: '500',
      data: err
    }
  })
})

module.exports = router