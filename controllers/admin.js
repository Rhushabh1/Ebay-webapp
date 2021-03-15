const Prod = require('../models/prod');


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
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/admin/add-product');
        })
        .catch(err => console.log(err));
};

exports.get_prods = (req,res2,next) => {

    Prod.get_all()
        .then(res => {

            const result = res.rows;
            console.log(result);
            res2.render('admin/prods', {
                pageTitle: 'Products',
                path: '/prods',
                editing: false,
                product_list: result
            });

        })
        .catch(err => console.log(err));

};

exports.post_prods = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/prods');
        })
        .catch(err => console.log(err));
};

exports.get_cart = (req,res,next) => {


    res.render('admin/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        editing: false
    });


};

exports.post_cart = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.get_orders = (req,res,next) => {


    res.render('admin/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        editing: false
    });


};

exports.post_orders = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};