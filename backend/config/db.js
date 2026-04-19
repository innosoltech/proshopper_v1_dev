import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // const conn = await mongoose.connect(
    //   process.env.NODE_ENV == "development"
    //     ? process.env.MONGO_URI_LOCAL
    //     : process.env.MONGO_URI
    // );
    console.log(` MongoDB Connected: ${conn.connection.host} `.green.inverse);
  } catch (error) {
    console.error(` Error: ${error.message} `.red.inverse);
    process.exit(1);
  }
};

export default connectDB;
