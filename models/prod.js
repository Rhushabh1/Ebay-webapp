
const pool= require('../utils/database');

class Prod{

    constructor( title, image, price, quantity){
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    add_prod(){
        return pool.query('INSERT INTO products(title, price, image, quantity, id) VALUES ($1, $2, $3, $4, (SELECT max(id)+1 FROM products) );', [this.title, this.price, this.image, this.quantity]);
    }
    static get_all(){
        return pool.query('SELECT * FROM products;');
    }

};

class Cart{

    constructor( user_id, item_id, quantity ){
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }

    select_from_prods(){
        return pool.query('SELECT * FROM products WHERE id = $1;', [this.item_id]);
    }

    update_prods(){
        return pool.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2;', [this.quantity, this.item_id]);
    }

    select_from_cart(){
        return pool.query('SELECT * FROM cart WHERE user_id = $1 AND item_id = $2;', [this.user_id, this.item_id]);
    }

    insert_into_cart(){
        return pool.query('INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3);', [this.user_id, this.item_id, this.quantity]);
    }

    update_cart(){
        return pool.query('UPDATE cart SET quantity = quantity + $3 WHERE user_id = $1 AND item_id = $2;', [this.user_id, this.item_id, this.quantity]);
    }

    static get_all(){
        return pool.query('SELECT p.title title, p.image image, p.price price, c.quantity quantity FROM cart c INNER JOIN products p ON c.item_id = p.id;');
    }

}

class Order{

    constructor( user_id){
        this.user_id = user_id;
    }

    fetch_credits(){
        return pool.query('SELECT credit FROM users WHERE user_id = $1;', [this.user_id]);
    }

    compute_credits(){
        return pool.query('WITH details(p, q) AS (SELECT p.price, c.quantity FROM cart c INNER JOIN products p ON c.item_id = p.id WHERE c.user_id = $1) \
                            SELECT sum(p*q) FROM details;', [this.user_id]);
    }

    fetch_cart(){
        return pool.query('SELECT * FROM cart WHERE user_id = $1;', [this.user_id]);
    }

    empty_cart(){
        return pool.query('DELETE FROM cart WHERE user_id = $1', [this.user_id]);
    }

    select_from_order(item_id){
        return pool.query('SELECT * FROM orders WHERE user_id = $1 AND item_id = $2', [this.user_id, item_id]);
    }

    insert_into_order(item_id, quantity){
        return pool.query('INSERT INTO orders (user_id, item_id, quantity) VALUES ($1, $2, $3);', [this.user_id, item_id, quantity]);
    }

    update_order(item_id, quantity){
        return pool.query('UPDATE orders SET quantity = quantity + $3 WHERE user_id = $1 AND item_id = $2;', [this.user_id, item_id, quantity]);
    }

    static get_all(){
        return pool.query('SELECT p.title title, p.image image, p.price price, o.quantity quantity FROM orders o INNER JOIN products p ON o.item_id = p.id;');
    }

}

module.exports = {
    Prod: Prod,
    Cart: Cart,
    Order: Order
}