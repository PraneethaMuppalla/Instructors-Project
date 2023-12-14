const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    description,
    price,
    imageUrl,
  })
    .then((result) => {
      console.log("Product created");
      res.redirect("/");
    })
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  Product.findByPk(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        product: product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
      });
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.update(
    {
      title,
      imageUrl,
      description,
      price,
    },
    {
      where: {
        id: req.body.productId,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((result) =>
      res.render("admin/products", {
        prods: result,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    )
    .catch((err) => console.error(err));
};
exports.deleteProduct = (req, res, next) => {
  Product.destroy({ where: { id: req.body.productId } })
    .then((response) => {
      console.log("delete===>>>" + response);
      res.redirect("/admin/products");
    })
    .catch((e) => console.error(e));
};
