import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at PORT : ${process.env.PORT}`);
      console.log("MongoDb connection SUCCESS");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed ", error);
  });

