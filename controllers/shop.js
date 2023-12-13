const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findProduct(productId)
    .then(([row]) => {
      res.render("shop/product-detail", {
        product: row[0],
        pageTitle: "Product",
        path: "/products",
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, metaData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    if (cart) {
      const cartProducts = [];
      Product.fetchAll((products) => {
        for (let product of products) {
          const cardProductData = cart.products.find(
            (p) => p.id === product.id
          );
          if (cardProductData) {
            cartProducts.push({
              productData: product,
              qty: cardProductData.qty,
            });
          }
        }
        console.log(cartProducts);
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
        });
      });
    }
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProduct(prodId, (product) => {
    Cart.addProduct(product.id, product.price);
  });

  res.redirect("/cart");
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProduct(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
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
