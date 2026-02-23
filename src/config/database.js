const mongoose=require('mongoose')

const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://mohseenkhan:95j9ky1USqP7EdTJ@cluster0.7z7ktpa.mongodb.net/')
}

module.exports=connectDB;