const express = require('express');
const router = express.Router();
const Product = require('../dao/models/product.model');
const mongoosePaginate = require('mongoose-paginate-v2');

Product.schema.plugin(mongoosePaginate);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const result = await Product.paginate(filter, options);
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    const newProduct = new Product({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      { title, description, code, price, status, stock, category, thumbnails },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res.status(404).send('Produto não encontrado');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/products/view
router.get('/view', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const result = await Product.paginate(filter, options);
    res.render('products', {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products/view?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products/view?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
