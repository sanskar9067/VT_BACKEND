import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`Connected to the database: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

export default connectDB;