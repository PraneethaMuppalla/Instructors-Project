const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findProduct(productId, (product) => {
    console.log(product);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
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
