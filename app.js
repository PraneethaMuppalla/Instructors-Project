const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const db = require("./util/database");
const sequelize = require("./util/database");
const ProductModel = require("./models/product");
const UserModel = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  UserModel.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

ProductModel.belongsTo(UserModel, { constraints: true, onDelete: "CASCADE" });
UserModel.hasMany(ProductModel);

sequelize
  //.sync({ sync: true })
  .sync()
  .then(() => {
    return UserModel.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return UserModel.create({
        name: "Praneetha",
        email: "praneetha@email.com",
      });
    }
    return user;
  })
  .then((user) => {
    //console.log(user);
    app.listen(3000, () => {
      console.log("Server has connected");
    });
  })
  .catch((e) => {
    console.log("=====>>>>>");
    console.error(e);
  });
