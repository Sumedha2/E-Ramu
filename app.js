require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({    //to be removed
    name : String ,
    email: {
        type :String,
        required : true
    },
    occupation: String,
    resName : String, 
    resLoc  : String,
    password :{
        type :String,
        required : true
    }
});


userSchema.plugin(encrypt,{secret : process.env.SECRET ,encryptedFields: ['password'] });


const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("index");
 });

 app.get("/index",function(req,res){
    res.render("index");
 });

app.get("/Login",function(req,res){
   res.render("Login");
});


app.get("/Sign_up",function(req,res){
    res.render("Sign_up");
});

app.get("/services",function(req,res){
    res.render("services");
});
            
app.get("/staff_management_login",function(req,res){
    res.render("staff_management_login");
});

app.post("/Sign_up",function(req,res){
    const newUser = new User({
     name :  req.body.Name,
     email: req.body.email,
     occupation : req.body.occupation,
     resName : req.body.resName,
     resLoc:  req.body.resLoc,
     password: req.body.password
    })

    Occ = req.body.occupation;
    newUser.save(function(err){
        if(err){
            console.log(err);
            res.write("<h1>An error occurred while submitting the form :/</h1>");
            res.write("<h2>Try filling the form once again</h2>")
        }else{
            res.render("staff_management");    //Add option for menu and other facilities instead of staff management
        }
    }); 
    
});

app.post("/Login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    // Add option to specify Manager or employee  
    
 
    User.findOne({email : email}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("staff_management");     //Add option for menu and other facilities instead of staff management
                }
            }
        }
    })
    
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
  