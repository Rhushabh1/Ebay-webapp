
const pool= require('../utils/database');

class Prod{

    constructor( title, image, price, quantity){
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    add_prod(){
        return pool.query('INSERT INTO products(title, price, image, quantity) VALUES ($1, $2, $3, $4);', [this.title, this.price, this.image, this.quantity]);
    }
    static get_all(){
        return pool.query('SELECT * FROM products');
    }

};

class Cart{

    constructor( user_id, item_id, quantity ){
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }

    add_to_cart(){
        const q1 = pool.query('SELECT * FROM products WHERE id = $1', [this.item_id]);
        
        q1.then(res => {
            const tuple = res.rows;
            console.log(tuple);

            if (tuple[0]['quantity'] - this.quantity >= 0) {
                const q2 = pool.query('UPDATE products SET quantity = quantity - $1 where id = $2; INSERT INTO cart (user_id, item_id, quantity) VALUES ($3, $2, $1) ON DUPLICATE KEY UPDATE quantity = quantity + $1;', [this.quantity, this.item_id, this.user_id]);
                
                q2.then(() => {
                    return 0;
                })
                .catch(err => console.log(err));

            } else {
                console.log("add to cart failed");
                return -1;
            }
        })
        .catch(err => console.log(err));
    }

}

module.exports = {
    Prod: Prod,
    Cart: Cart
}