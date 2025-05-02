import mongoose from "mongoose";

const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI, {
        
  }).then(() => {
      console.log("Connected to the database");
  }).catch((err) => {
      console.log("Some error is occured while connecting to the database", err);
  });
}  

export default connectDB