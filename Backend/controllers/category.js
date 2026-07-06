const express = require("express");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const getCategoriesList = catchAsync(async (req, res, next) => {
  const categoryList = await Category.find();
  res.status(200).json({
    success: true,
    count: categoryList.length,
    data: categoryList,
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new appError("This category cannot be found", 404));
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    return next(new appError("The category could not be created", 400));
  }

  res.status(201).json({
    success: true,
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { returnDocument: "after", runValidators: true },
  );

  if (!category) {
    return next(new appError("This category cannot be found or updated!", 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});


const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new appError("This category cannot be found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "The category has been deleted successfully!",
  });
});


module.exports = {
  getCategoriesList,
  getCategory,  
  createCategory,
  updateCategory,
  deleteCategory,
};
