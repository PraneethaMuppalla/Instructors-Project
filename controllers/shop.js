const Product = require("../models/product");
//const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.find()
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
  console.log(productId);
  // Product.findAll({ where: { id: productId } })
  //   .then(([result]) =>
  //     res.render("shop/product-detail", {
  //       product: result,
  //       pageTitle: result.title,
  //       path: "/products",
  //     })
  //   )
  //   .catch((err) => console.error(err));

  Product.findById(productId)
    .then((result) => {
      console.log(result);
      res.render("shop/product-detail", {
        product: result,
        pageTitle: result.title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
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
  console.log(req.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
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
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error("errrrrr======>>>>>" + err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.error(err));
};

exports.postOrders = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
