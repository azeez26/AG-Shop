const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get("/", async (req, res) => {
    try {
        const categoryList = await Category.find();
        res.status(200).send(categoryList);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).send(category);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
});


router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        });

        category = await category.save();

        if (!category) {
            return res.status(400).send('The category could not be created');
        }

        res.status(201).send(category);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);

        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "category not found!" });
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
            //new command instead of {new:true}
            { returnDocument: 'after' }
        )
        return res.status(200).send(category);
        if (!category) {
            return res.status(404).json({ success: false, message: "category cannot be updated!" });
        }

    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
})

module.exports = router;
