import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import URL from './URLS.mjs';
import { nanoid } from "nanoid";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
const databaseURL = process.env.DATABASE_URL;
mongoose.connect(`${databaseURL}`).then(()=>{
    console.log("dp is connected !!!!");
}).catch((err) => {
    console.error("DB connection failed:", err);
  });
app.use(express.json());

app.get("/test",(req,res)=>{
    res.status(200).send("wake up");
})


app.post("/shorten",async(req,res)=>{
    const {url} =req.body;
   try{
    const elem = await URL.findOne({currURL : url});
    console.log(elem);
    if(elem){
       return  res.status(400).json({message :"url already exist"});
    }
    const uniqueString = nanoid(4);

    const newURL = new URL({
        currURL: url,
        redirectURL : uniqueString
    });
    newURL.save();
    const nnURL = process.env.SERVER_URL;         
    const shortUrl =`${nnURL}/${uniqueString}`;
    res.status(200).json({shortURL : shortUrl});
    
    

   }catch(err){
    console.log(err);
    res.status(404).json({mes:"something went wrong"});
   }
});

app.get("/:sec",async (req,res)=>{
    const {sec} = req.params;
   
    try{
        const urlcontainer =await  URL.findOne({redirectURL : sec});
        console.log(urlcontainer);
        if(urlcontainer){
            const redirURL= urlcontainer.currURL;
            res.redirect(301,redirURL);
        
         
        }else{
            res.status(404).json({msg : "url not found"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({mes:"something went wrong"});
    }
});

app.delete("/urls", async (req, res) => {
    try {
        const result = await URL.deleteMany({});
        res.status(200).json({
            message: "All URLs deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete URLs" });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("listening !!");
});