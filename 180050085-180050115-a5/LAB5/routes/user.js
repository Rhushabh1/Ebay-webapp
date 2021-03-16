const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/prods',adminCon.get_prods);
router.post('/prods',adminCon.post_prods);

router.get('/cart',adminCon.get_cart);
router.post('/cart',adminCon.post_cart);

router.get('/orders',adminCon.get_orders);
router.post('/orders',adminCon.post_orders);

module.exports = router;
