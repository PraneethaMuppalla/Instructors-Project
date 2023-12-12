const path = require("path");
const fs = require("fs");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      try {
        if (!err) {
          cart = JSON.parse(data);
        }
      } catch (e) {
        console.error(e);
      }
      const existingProductIndex = cart.products.findIndex(
        (eachProd) => eachProd.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      if (existingProduct) {
        let updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        let newProduct = { id: id, qty: 1 };
        cart.products.push(newProduct);
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(cart), (e) => {
        console.error("writeFile=>>>" + e);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(data);
      const product = cart.products.find((product) => id === product.id);
      console.log(product);
      if (product) {
        const productQty = product.qty;
        cart.products = cart.products.filter((each) => each.id !== id);
        cart.totalPrice -= productQty * price;
        fs.writeFile(p, JSON.stringify(cart), (e) => {
          console.error(e);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cb(null);
      }
      try {
        const cart = JSON.parse(fileContent);
        cb(cart);
      } catch (e) {
        cb(null);
      }
    });
  }
};
