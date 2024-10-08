import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(5000, "0.0.0.0", () => {
      console.log(`Server is running at PORT : 5000`);
      console.log("MongoDb connection SUCCESS");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed ", error);
  });
