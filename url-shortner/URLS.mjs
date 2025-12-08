import mongoose from "mongoose";

const urlSchemaF = new mongoose.Schema({
  currURL: {
    type: String,
    required: true
  },
  redirectURL: {
    type: String,
    required: true
  }
});


const URL = mongoose.model("URL", urlSchemaF);


export default URL;
