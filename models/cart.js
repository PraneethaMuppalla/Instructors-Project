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
};
