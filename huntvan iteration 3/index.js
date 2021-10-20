const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const PORT = process.env.PORT || 5000
var formidable = require('formidable');
var fs = require('fs');
const multer = require('multer');
var cors = require('cors');





const { Pool } = require('pg');
var pool;
pool = new Pool({
  //connectionString: 'postgres://xjccjc:password@localhost/hvlogin'
  connectionString: process.env.DATABASE_URL
})

var app = express();
  app.use(express.json());
  app.use("/", cors());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use("/styles",express.static(__dirname + "/styles"));
  app.use(express.static(__dirname + '/public'));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => res.render('pages/index'))

  //创建session
  app.use(session({
    secret: 'secret',
    cookieName: 'session',
    resave: true,
    saveUninitialized: true,
    duration: 30*60*1000,
    activeDuration: 5 * 60 * 1000,
  }))

  app.use(flash());

  app.get('/register', (req,res) =>{
    res.render("pages/signup");
  })
  app.get('/login', (req,res) =>{
    res.render("pages/login");
  })

  function select_postdata(req, res, next){
    var dbreq = 'SELECT * from postdata';
    pool.query(dbreq, (err,results)=>{
      if (err){
        throw err
      }
      req.postdata = results.rows;
      return next();
    })
  }
  function select_comment(req, res, next){
    var dbreq = 'SELECT * from comment';
    pool.query(dbreq, (err,results)=>{
      if (err){
        throw err
      }
      req.commentdata = results.rows;
      return next();
    })
  }
  function select_user(req, res, next){
    var dbreq = 'SELECT * from users';
    pool.query(dbreq, (err,results)=>{
      if (err){
        throw err
      }
      req.userdata = results.rows;
      return next();
    })
  }
  function select_follower(req,res,next){
    var dbreq = 'SELECT * from follower';
    pool.query(dbreq, (err,results)=>{
      if (err){
        throw err
      }
      req.followerdata = results.rows;
      console.log(req.followerdata);
      next();
    })
  }

  app.get('/homepage', select_postdata, select_comment, select_user, select_follower, (req,res) =>{
    var user = req.session.user;
    console.log(res);
    res.render("pages/homepage",{
        'username': user.name,
        'email': user.email,
        'icon': user.icon,
        'rows':req.postdata,
        'commentrows':req.commentdata,
        'users':req.userdata,
        'follower':req.followerdata});

  })

  app.get('/editprofile',(req,res)=>{
    var user = req.session.user;
    var email = user.email;
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err,results)=>{
      res.render('pages/editprofile', {'rows':results.rows});
    })


  })

  //admin界面提取所有信息
  app.get('/admin', (req,res) => {
    pool.query('SELECT * from postdata', (err,results)=>{
      if (err){
        throw err;
      }
      console.log(results);
      var result = {'rows':results.rows};
      res.render('pages/admin', result );

   })
  })



  app.post('/popup', select_comment,(req,res)=>{
    let {postid, comment_email} = req.body;
    var user = req.session.user;
    pool.query(
      'select * from postdata WHERE id = $1', [postid], (err,results)=>{
        if (err){
          throw err
        }
        //console.log(results);
        res.render("pages/popup",{'email':user.email,'rows':results.rows, 'commentrows':req.commentdata});
      }
    )

  })





  //register
  app.post('/register', (req,res)=>{
    let {name, email, password, password2} = req.body;
    console.log({
      name, email, password, password2
    })

    let errors = [];

    //检查登录信息
    //检查信息是否全部输入
    if (!name || !email || !password || !password2){
      errors.push({message: "Please enter all fields"});
    }
    //检查密码位数
    if(password.length < 6){
      errors.push({message: "Password should be at least 6 character long"});
    }
    //检查密码正确
    if(password != password2){
      errors.push({message: "Password does not match"});
    }
    if(errors.length > 0){
      res.render("pages/signup", {errors})
    }

    //寻找是否已经注册
      pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
          if (err){
            throw err;
          }

          console.log(results.rows);
          if(results.rows.length > 0){
            errors.push({message: "Email already registered"});
            res.render('pages/signup',{errors});
          }else{
            //注册新用户
            pool.query(
              `INSERT INTO users (name, email, password)
              VALUES ($1, $2, $3) RETURNING id, password`,
              [name, email, password], (err, results) =>{
                if (err){
                  throw err;
                }

                console.log(results.rows);
                req.flash('success_msg', "You are now registered. Please log in");
                res.redirect('/login');
              }
            )
          }
        }
      )
  })





//login
  app.post('/login', (req,res)=>{
    let {email, password}= req.body;
    let errors = [];
    if (!password){
      errors.push({message: "Please enter the password"})
      res.render('pages/login',{errors});
    }
    //检查登录信息
    pool.query('SELECT * FROM users WHERE email = $1',[email], (err,results)=>{
      if (err){
        throw err
      }
      //console.log(res.body);
      //console.log(results.rows);
      if (results.rows.length > 0){
        const user = results.rows[0];
        console.log(user);
        if (password == user.password){
          if (email == "huntvan@gmail.com"){
            return res.redirect('/admin');
          }
          req.session.user = user;
          res.redirect('/homepage');
        }else{
          errors.push({message: "Password does not match"});
          res.render('pages/login',{errors});
        }
      }else{
        errors.push({message: "Email is not registered"});
        res.render('pages/login',{errors});
      }
    })
  })

//储存和改变图片格式
  const multerConf = {
    storage : multer.diskStorage({
      destination : function(req, file, next){
        next(null, './public/images');
      },
      filename: function(req, file, next){
        const ext = file.mimetype.split('/')[1];
        next(null,file.fieldname + '-' + Date.now() + '.' +ext);
      }
    }),
    fileFilter: function(req, file, next){
      if(!file){
        next();
      }
      const image = file.mimetype.startsWith('image/');
      if(image){
        next(null,true);
      }else{
        next({message:"File type not supported"},false);
      }
    }

  }



//储存进db
  app.post('/postitem', multer(multerConf).single('photo'), (req,res)=>{
  //text,budget,place部分
    let {username, title, post_text, place, budget, email, latt, lngg, icon} = req.body;

    /*var lat = localStorage.getItem("lat");
    var lng = localStorage.getItem("lng");*/
    console.log({place});

    if (req.file){
      //console.log(req.file);
      let img_name = req.file.filename;
      //console.log(req.img_name);
      var postsql = 'INSERT INTO postdata (post_user,post_text,image_name,title,location,budget,post_email,icon) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)'
      var img_dir = "./images/" + img_name;
      var postsql_params = [username,post_text, img_dir, title, place, budget, email, icon];
      pool.query(postsql,postsql_params,(err,results)=>{
        if (err){
          throw err
        }
        //console.log(results);
      })
    }

    else{
    var postsql = 'INSERT INTO postdata (post_user,post_text,title,location,budget,post_email,icon) VALUES ($1,$2,$3,$4,$5,$6,$7)'
    var postsql_params = [username,post_text,title, place, budget, email, icon];

    pool.query(postsql,postsql_params,(err,results)=>{
      if (err){
        throw err
      }
      //console.log(results);
    })
  }


  res.redirect('/homepage');


})
app.post('/deletepost', (req,res)=>{
    var id = req.body.pid;
    deletequery = `DELETE FROM postdata WHERE id = ($1)`;
    pool.query(deletequery, [id], (err,results)=>{
      if (err){
        throw err
      }
      res.redirect('/admin');
    })
  })


app.post('/commend', (req,res)=>{
  let {postid,comment_email,p_comment,countheart,likes}= req.body;
  console.log({postid,comment_email,p_comment,countheart,likes});

  var intheart = parseInt(countheart);
  var sql = `INSERT INTO comment (post_id,comment_person,content,likes) VALUES ($1,$2,$3,$4)`;
  var sqlparams = [postid,comment_email,p_comment,intheart];
  pool.query(sql,sqlparams, (err,results)=>{
    if (err){
      throw err
    }
    //console.log(results);
    res.redirect('/homepage');
    res.end();
  })

})

app.post('/like', (req,res)=>{
  let {postid,countheart,likes}= req.body;
  console.log({postid,countheart,likes});

  var intheart = parseInt(countheart);
  var intlikes = parseInt(likes);
  console.log(intheart);
  console.log(intlikes);
  if (intheart == 1){
    intlikes++;
    pool.query(`UPDATE postdata SET likes = ($1) WHERE id = ($2)`, [intlikes,postid], (err,results)=>{
      if(err){
        throw err;
      }
    })
  }
  res.end();


})

app.post('/follow', (req,res)=>{
  let {femail,uemail,followsta,username} = req.body;
  //console.log({femail,uemail,followsta,username});
  var followornot = parseInt(followsta);
  if (followornot == 1){
    pool.query(`INSERT INTO follower (uemail,femail,username) VALUES ($1,$2,$3)`, [uemail,femail,username], (err,results)=>{
      if (err){
        throw err
      }

    })

  }
  res.end();
})

app.post('/info',(req,res)=>{
  let {email} = req.body;
  var user = req.session.user;
  console.log(email);
  pool.query(`SELECT * FROM postdata WHERE post_email = $1`, [email], (err,results)=>{
    if (err){
      throw err;
    }
    console.log(results.rows);
    res.render('pages/userinfo',{'email':user.email,'rows':results.rows});
  })
})

app.post('/editprofile', (req,res)=>{
  res.redirect('/editprofile');
})



app.post('/edit',multer(multerConf).single('photo'),(req,res)=>{
  let {email} = req.body;
  if (req.file){
    console.log(req.file);
    let img_name = req.file.filename;
    var img_dir = "./images/" + img_name;
    pool.query(`UPDATE users SET icon = ($1) WHERE email = ($2)`, [img_dir,email], (err,results)=>{
      if (err){
        throw err;
      }

    })

    pool.query(`UPDATE postdata SET icon = ($1) WHERE post_email = ($2)`, [img_dir,email], (err,results)=>{
      if (err){
        throw err;
      }

    })
  }
  res.redirect('/editprofile');
  res.end();

})



  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

  module.exports = app;
