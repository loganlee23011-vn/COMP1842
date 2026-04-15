const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
require("./api/models/todoListModel");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./api/routes/todoListRoutes");
routes(app);

mongoose
  .connect("mongodb://localhost/Tododb")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(
        "Le Ngoc Tan Hien - todo list RESTful API server started on: " + port,
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
