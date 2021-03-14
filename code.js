const express = require("express");
const router = new express.Router();
const fs = require("fs");
const {join} = require("path");
router.all("/path/*",(req,res)=>{
    let mpath = req.path.split("/path")[1];
    let pathname = join(__dirname,mpath);
    if(!fs.existsSync(pathname)) return;
    if(fs.lstatSync(pathname).isDirectory()){
        fs.readdir(pathname,(err,files)=>{
            if(err){
                console.log(err);
                return res.status(400).send(err);
            }
            res.json({file: false,body:files.map(filename=>{
                let path = join(pathname,filename);
                return {
                "name": filename,
                "type": (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) ? "dir" : "file"
            }}).sort((a,b) => ((b.type==="dir")+false)-((a.type==="dir")+false))});
        });
    } else {
        return res.json({
            file: true,
            body: fs.readFileSync(pathname).toString()
        });
    }
});
router.get("*",(req,res)=>{
    req.path.split("")
    res.sendFile(join(__dirname,"/sites/files.html"));
})
module.exports = router;