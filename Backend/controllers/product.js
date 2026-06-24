const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category');
const multer = require('multer')

let catchAsync = require('../helper/catchAsync')
let appError = require('../helper/appError')



let addProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const file = req.file
        if (!file) return res.status(400).send('No image has been uploaded');
        const filename = req.file.filename
        const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads`
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${baseUrl}${filename}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send('The product cannot be created');
        } else {
            res.status(201).send(product)
        }

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

let allProducts = async (req, res) => {
    try {
        let filter = {}
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') }
        }
        const productList = await Product.find(filter).populate('category')

        res.status(200).send(productList)
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: err.message
        });
    }
}

let productById = catchAsync(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) {
            return next(new appError("Product not found", 404))
        }
        res.send(product);
    }
)


let updateProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { returnDocument: 'after' }
        );

        if (!product) return res.status(500).send('the product cannot be found!');

        res.status(200).send(product)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


let deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            return res.status(200).json({
                success: true,
                message: 'The product is deleted!'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

let productCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();

        res.status(200).send({
            productCount: productCount
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

let featuredCount = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;

        const products = await Product.find({ isFeatured: true }).limit(+count);

        if (!products) {
            return res.status(404).json({ success: false, message: "No featured products found" });
        }

        res.status(200).send(products);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

let updateProductImages = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { returnDocument: 'after' }
        );

        if (!product) return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    } catch (err) {
        res.status(400).json(err.message)
    }
}


module.exports = { addProduct, allProducts, productById, updateProduct, deleteProduct, productCount, featuredCount, updateProductImages }