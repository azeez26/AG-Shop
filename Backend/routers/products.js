const express = require('express')
const router = express.Router()
let {addProduct, allProducts, productById, updateProduct, deleteProduct, productCount, featuredCount, updateProductImages} = require('../controllers/product')

const uploadOptions = require('../middleware/multer');


router.post(`/`, uploadOptions.single('image'),addProduct );


router.get('/',allProducts )


router.get(`/:id`,productById );


router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);


router.get(`/get/count`, productCount);


router.get(`/get/featured/:count`, featuredCount);


router.put('/gallery-images/:id', uploadOptions.array('images', 10), updateProductImages);


module.exports = router