const path = require("path");
const fs = require("fs");

const rootDir = require("../util/path");
const p = path.join(rootDir, "data", "products.json");

const getAllProducts = function (cb) {
  fs.readFile(p, (err, data) => {
    if (err) {
      return cb([]);
    } else {
      try {
        const products = JSON.parse(data);
        return cb(products);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return cb([]);
      }
    }
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }
  save() {
    getAllProducts((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (error) => {
        console.error(error);
      });
    });
  }
  static fetchAll(cb) {
    getAllProducts(cb);
  }
};
