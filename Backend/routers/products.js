const express = require('express')
const router = express.Router()
let {addProduct, getAllProducts, productById, updateProduct, deleteProduct, getProductCount, getFeaturedProducts, updateProductImages} = require('../controllers/product')

const uploadOptions = require('../middleware/multer');


router.post(`/`, uploadOptions.single('image'),addProduct );


router.get('/',getAllProducts )


router.get(`/:id`,productById );


router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);


router.get(`/get/count`, getProductCount);


router.get(`/get/featured/:count`, getFeaturedProducts);


router.put('/gallery-images/:id', uploadOptions.array('images', 10), updateProductImages);


module.exports = router