const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');


/* GET ALL PRODUCTS */
router.get('/', function (req, res, next) {
  const { startValue, endValue } = getValuePagination(req.query.page, req.query.limit);

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.description',
      'p.image',
      'p.images',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({ id: 1 })
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          data: prods
        })
      } else {
        res.json({
          message: 'No products found'
        });
      }
    })
    .catch(error => console.log('ERROR: ', error));
});


/* GET SINGE PRODUCT */
router.get('/:prodId', function (req, res) {
  const prodId = req.params.prodId;

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.description',
      'p.image',
      'p.images',
      'p.id'
    ])
    .filter({ 'p.id': prodId })
    .get()
    .then(prod => {
      if (prod) {
        res.status(200).json(prod);
      } else {
        res.json({ message: `No product found with productId: ${prodId}` });
      }
    })
    .catch(error => console.log('ERROR: ', error));
})


/* GET ALL PRODUCTS BY CATEGORY */
router.get('/category/:cateName', function (req, res) {
  const { startValue, endValue } = getValuePagination(req.query.page, req.query.limit);
  const cateName = req.params.cateName;

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: `c.id = p.cat_id WHERE c.title LIKE "%${cateName}%"`
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.description',
      'p.image',
      'p.images',
      'p.id'
    ])
    .sort({ id: 1 })
    .slice(startValue, endValue)
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          data: prods
        })
      } else {
        res.json({ message: `No products found with category: ${cateName}` })
      }
    })
    .catch(error => console.log("ERROR: ", error));
});


function getValuePagination(page, limit) {
  page = (page !== undefined && page !== 0) ? page : 1;
  limit = (limit !== undefined && limit !== 0) ? limit : 10;

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  return { startValue, endValue };
}


module.exports = router;
