const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  //connectionString: 'postgres://xjccjc:password@localhost/hvlogin'
  connectionString: process.env.DATABASE_URL
})

var app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use("/styles",express.static(__dirname + "/styles"));
  app.use(express.static(__dirname + '/public'));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => res.render('pages/index'))
  app.use(session({
    secret: 'secret',
    cookieName: 'session',
    resave: false,
    saveUninitialized: false,
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

  app.get('/homepage', (req,res) =>{
    var user = req.session.user;
    res.render("pages/homepage",{username: user.name});
  })




  app.post('/register', (req,res)=>{
    let {name, email, password, password2} = req.body;
    console.log({
      name, email, password, password2
    })

    let errors = [];

    if (!name || !email || !password || !password2){
      errors.push({message: "Please enter all fields"});
    }
    if(password.length < 6){
      errors.push({message: "Password should be at least 6 character long"});
    }
    if(password != password2){
      errors.push({message: "Password does not match"});
    }
    if(errors.length > 0){
      res.render("pages/signup", {errors})
    }

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


  app.post('/login', (req,res)=>{
    let {email, password}= req.body;
    let errors = [];
    if (!password){
      errors.push({message: "Please enter the password"})
      res.render('pages/login',{errors});
    }
    /*if (email == "huntvan@gmail.com"){

      //select every posts from database
      /*pool.query('SELECT * from database', (err,results)=>{
      if (error)
        res.end(error);
        var results = {'rows':result.rows}
        res.render('pages/admin',results);
      })

      return res.render('pages/admin');
    }*/
    pool.query('SELECT * FROM users WHERE email = $1',[email], (err,results)=>{
      if (err){
        throw err
      }
      console.log(results.rows);
      if (results.rows.length > 0){
        const user = results.rows[0];
        console.log(user);
        if (password == user.password){
          if (email == "huntvan@gmail.com"){
            return res.render('pages/admin');
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



  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
