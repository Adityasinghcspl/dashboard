const mongoose = require("mongoose");

class MongoSchemas {
   EmployeeSchema = new mongoose.Schema({
      firstName:{
         type:String,
         require:[true,"Please add the user firstName"],
         unique: true,
      },
      lastName:{
         type:String,
         require:[true,"Please add the user lastName"],
      },
      email:{
         type:String,
         require:[true,"Please add the user email address"]
      },
      password:{
         type:String,
         require:[true,"Please add the user password"]
      },
      role:{
         type:String,
         require:[true,"Please defined the user role"]
      },
      department:{
         type:String
      }
   },{ versionKey: false })
}

module.exports = new MongoSchemas();