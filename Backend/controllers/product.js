const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category');
const multer = require('multer')

let catchAsync = require('../helper/catchAsync')
let appError = require('../helper/appError')



let addProduct = catchAsync(
    async (req, res, next) => {

        const category = await Category.findById(req.body.category);
        if (!category) {
            return next(new AppError('Invalid Category', 400));
        }

        const file = req.file;
        if (!file) {
            return next(new AppError('No image has been uploaded', 400));
        }

        const filename = req.file.filename;
        const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`;

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
            return next(new AppError('The product cannot be created', 500));
        }
        res.status(201).json({
            success: true,
            data: product
        });
    }
);

let getAllProducts = catchAsync(
    async (req, res, next) => {

        let filter = {}
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') }
        }
        const productList = await Product.find(filter).populate('category')

        res.status(200).json({
            success: true,
            count: productList.length,
            data: productList
        })
    }
)

let productById = catchAsync(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) {
            return next(new appError("Product not found", 404))
        }
        res.status(200).json({
            success: true,
            data: product
        })
    }
)


let updateProduct = catchAsync(
    async (req, res, next) => {

        const category = await Category.findById(req.body.category);
        if (!category) {
            return next(new appError('Invalid Category', 400));
        }

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
            { returnDocument: 'after', runValidator: true }
        );

        if (!product) return res.status(500).send('the product cannot be found!');

        res.status(200).json({
            success: true,
            data: product
        })
    }
)


let deleteProduct = catchAsync(
    async (req, res,next) => {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product){
            return next(new appError('Product not found!', 404))
        }

        res.status(200).json({
            success: true,
            message: 'The product is deleted successfully!'
        })
    }
)

let getProductCount = catchAsync(
    async (req, res, next) => {

        const count = await Product.countDocuments();

        res.status(200).json({
            success: true,
            data: count
        })
    }
)

let getFeaturedProducts = catchAsync(
    async (req, res, next) => {

        const count = req.params.count ? req.params.count : 0;

        const products = await Product.find({ isFeatured: true }).limit(+count);

        if (!products || products.length === 0) {
            return next(new appError('No featured products found!', 404));
        }

        res.status(200).json({
            success: true,
            data: products
        });
    }
);


let updateProductImages = catchAsync(
    async (req, res,next) => {

        const files = req.files;
        if(!files || files.length === 0){
            return next(new appError('Please upload at least one image!', 400))
        }
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        const imagesPath = files.map(file => `${basePath}${file.filename}`)
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { returnDocument: 'after' }
        );

        if(!product){
            return next(new appError('the gallery cannot be updated!', 404))
        }

        res.status(200).json({
            success: true,
            data: product
        })
    }
)


module.exports = { addProduct, getAllProducts, productById, updateProduct, deleteProduct, getProductCount, getFeaturedProducts, updateProductImages }