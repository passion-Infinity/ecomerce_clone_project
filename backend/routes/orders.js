const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');


/* GET ALL ORDERS */
router.get('/', function (req, res) {
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([
            'o.id',
            'p.title',
            'p.price',
            'od.quantity',
            'u.username'
        ])
        .sort({ id: 1 })
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json({
                    count: orders.length,
                    orders: orders
                })
            } else {
                res.json({ message: 'No orders found' });
            }
        })
        .catch(error => console.log("ERROR: ", error));
});


/* GET SINGEL ORDER */
router.get('/:orderId', function (req, res) {
    const orderId = req.params.orderId;

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([
            'o.id',
            'p.title',
            'p.price',
            'od.quantity',
            'u.username'
        ])
        .filter({ 'od.order_id': orderId })
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json({ orders: orders });
            } else {
                res.json({ message: `No order found with orderId: ${orderId}` });
            }
        })
        .catch(error => console.log("ERROR", error));
});


/* Create order */
router.post('/new', async function (req, res) {
    const { userId, products } = req.body;

    // check avaiable userId
    if (userId) {
        // compare number of products in cart and in database 
        if (checkNumberOfProducts(products).length > 0) {
            res.json({
                message: `Number of product incart is over.`,
                data: checkNumberOfProducts(products)
            })
            return;
        }

        database.table('orders')
            .insert({
                user_id: userId,
            })
            .then(lastId => {
                if (lastId.insertId) {
                    products.forEach(async (prod) => {
                        let data = await database.table('products')
                            .filter({ id: prod.id })
                            .withFields(['quantity'])
                            .get();

                        let incart = parseInt(prod.incart);

                        // Caculate number of products in database
                        if (data.quantity) {
                            data.quantity = data.quantity - incart;
                        }


                        // insert order_detail
                        database.table('orders_details')
                            .insert({
                                order_id: lastId.insertId,
                                product_id: prod.id,
                                quantity: incart,
                            })
                            .then(newId => {
                                database.table('products')
                                    .filter({ id: prod.id })
                                    .update({
                                        quantity: data.quantity,
                                    })
                                    .catch(error => console.error(error));
                            })
                            .catch(error => console.log("ERROR: ", error))
                    })
                } else {
                    res.json({
                        message: `Failed while adding orders details`,
                        sucess: false,
                    })
                    return;
                }
                res.json({
                    message: `Order successfully placed with order id ${lastId.insertId}`,
                    success: true,
                    order_id: lastId.insertId,
                    products: products
                })

            })
            .catch(error => console.log("ERROR: ", error));
    } else {
        res.json({
            message: `Create order failed with userId: ${userId}`,
            success: false
        })
    }
})


function checkNumberOfProducts(products) {
    const invalidNumbersOfProducts = [];

    console.log(products)

    products.forEach(async (prod) => {
        const data = await database.table('products')
            .withFields(['quantity'])
            .filter({ id: prod.id })
            .get();

        const incart = parseInt(prod.incart);



        if ((data.quantity - incart) < 0) {
            invalidNumbersOfProducts.push({
                isAvaliable: false,
                product_id: prod.id,
                product_quantity: data.quantity,
                incart: incart
            })
        }
    });

    return invalidNumbersOfProducts;
}


module.exports = router;