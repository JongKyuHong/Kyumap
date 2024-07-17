import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME, // 환경 변수에서 데이터베이스 이름을 가져옴
    });

    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

export default dbConnect;
