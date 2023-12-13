const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      `INSERT INTO products(title,imageUrl,description,price) values(?,?,?,?)`,
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM products`);
  }

  static findProduct(id) {
    return db.execute(`SELECT * FROM products where products.id=?`, [id]);
  }

  static deleteProductById(id) {
    return db.execute(`DELETE FROM products WHERE products.id=?`, [id]);
  }
};
