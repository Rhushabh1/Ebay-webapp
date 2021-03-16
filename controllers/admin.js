const Model = require('../models/prod');


exports.get_test = (req,res,next) => {


    res.render('admin/add_product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });

};

exports.post_test = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Model.Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/admin/add-product');
        })
        .catch(err => console.log(err));
};

exports.get_prods = (req,res2,next) => {

    Model.Prod.get_all()
        .then(res => {

            const result = res.rows;
            // console.log(result);
            res2.render('admin/prods', {
                pageTitle: 'Products',
                path: '/prods',
                editing: false,
                product_list: result
            });

        })
        .catch(err => console.log(err));

};

exports.post_prods = (req,res2,next) => {
    const user_id = 1;
    const item_id = req.body.product_id;
    const quantity = 1;

    console.log("1");
    console.log(item_id);

    const cart = new Model.Cart( user_id, item_id, quantity );
    const ret = cart.select_from_prods()
        .then(res => {
            if(res.rows[0]['quantity']==0){
                console.log("quantity is 0")
                res2.redirect('/prods');
            }
            else{
                cart.update_prods()
                    .then(res => {
                        console.log("prods updated")
                    })
                cart.select_from_cart()
                    .then(res => {
                        if(res.rows.length==0){
                            cart.insert_into_cart()
                                .then(res => {
                                    console.log("inserted to cart")
                                    res2.redirect('/cart');
                                })
                        }
                        else{
                            cart.update_cart()
                                .then(res => {
                                    console.log("cart updated")
                                    res2.redirect('/cart');
                                })
                        }
                    })
            }
        })
};

exports.get_cart = (req,res2,next) => {
    Model.Cart.get_all()
        .then(res => {

            const result = res.rows;
            const ord = new Model.Order(1);
            ord.fetch_credits()
                .then(res => {
                    const credits = res.rows[0]['credit']
                    console.log(credits)
                    res2.render('admin/cart', {
                        pageTitle: 'Cart',
                        path: '/cart',
                        editing: false,
                        product_list: result,
                        tot_credits: credits
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.post_cart = (req,res2,next) => {
    console.log("nice");
    const user_id = 1;
    
    const order = new Model.Order(user_id);
    const ret = order.compute_credits()
        .then(res => {
            const total_bill = res.rows[0]['total']
            order.fetch_credits()
                .then(res => {
                    const balance = res.rows[0]['credit']
                    if(balance<total_bill){
                        console.log('insuff balance')
                        res2.redirect('/cart')
                    }
                    else{
                        order.debit_credits(total_bill)
                        .then(res => {
                            console.log('debited')
                        })
                        order.fetch_cart()
                            .then(res => {
                                const tuples = res.rows
                                order.empty_cart()
                                    .then(res => {
                                        console.log("cart now empty")
                                    })
                                for (const tuple of tuples) {  
                                    order.select_from_order(tuple['item_id'])
                                        .then(res => {
                                            if(res.rows.length==0){
                                                order.insert_into_order(tuple['item_id'], tuple['quantity'])
                                                    .then(res => {
                                                        console.log("inserted to order")
                                                        res2.redirect('/orders')
                                                    })
                                            }
                                            else{
                                                order.update_order(tuple['item_id'], tuple['quantity'])
                                                    .then(res => {
                                                        console.log("updated to order")
                                                        res2.redirect('/orders')
                                                    })
                                            }
                                        })
                                }
                            })
                    }
                    
                })
        })
};

exports.get_orders = (req,res2,next) => {
    Model.Order.get_all()
        .then(res => {
            const result = res.rows;
            res2.render('admin/orders', {
                pageTitle: 'Order',
                path: '/orders',
                editing: false,
                product_list: result,
            });
        })
    .catch(err => console.log(err));
};

exports.post_orders = (req,res,next) => {

};