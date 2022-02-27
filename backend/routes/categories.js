const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');


router.get('/', function (req, res) {
    database.table('categories as c')
        .withFields(['c.title'])
        .getAll()
        .then(categories => {
            if(categories.length) {
                res.status(200).json({
                    count: categories.length,
                    data: categories
                })
            } else {
                res.json({ message: `No categories found`});
            }
        })
});


module.exports = router;