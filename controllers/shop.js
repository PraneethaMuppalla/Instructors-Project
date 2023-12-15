const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((result) =>
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "All Products",
        path: "/products",
      })
    )
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  // Product.findAll({ where: { id: productId } })
  //   .then(([result]) =>
  //     res.render("shop/product-detail", {
  //       product: result,
  //       pageTitle: result.title,
  //       path: "/products",
  //     })
  //   )
  //   .catch((err) => console.error(err));

  Product.findByPk(productId)
    .then((result) =>
      res.render("shop/product-detail", {
        product: result,
        pageTitle: result.title,
        path: "/products",
      })
    )
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((result) =>
      res.render("shop/index", {
        prods: result,
        pageTitle: "Shop",
        path: "/",
      })
    )
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.error(err));
  // Cart.getCart((cart) => {
  //   if (cart) {
  //     const cartProducts = [];
  //     Product.fetchAll((products) => {
  //       for (let product of products) {
  //         const cardProductData = cart.products.find(
  //           (p) => p.id === product.id
  //         );
  //         if (cardProductData) {
  //           cartProducts.push({
  //             productData: product,
  //             qty: cardProductData.qty,
  //           });
  //         }
  //       }
  //       console.log(cartProducts);
  //       res.render("shop/cart", {
  //         path: "/cart",
  //         pageTitle: "Your Cart",
  //         products: cartProducts,
  //       });
  //     });
  //   }
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      //res.json(products);
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product["cart-item"].quantity + 1;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error("err while posting products===>>>>>" + err));
  // Product.findProduct(prodId, (product) => {
  //   Cart.addProduct(product.id, product.price);
  // });

  // res.redirect("/cart");
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(([product]) => {
      return product["cart-item"].destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error("errrrrr======>>>>>" + err));
  // Product.findProduct(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
