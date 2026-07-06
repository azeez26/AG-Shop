
# توثيق نظام معالجة الأخطاء الشامل (Global Error Handling System)

هذا الدليل يلخص خطوات بناء نظام احترافي ومرن لمعالجة الأخطاء في تطبيق Express و Mongoose، وتوحيد صيغة الردود (Responses) المبعوثة للعميل.

---

## الخطوة 1: إنشاء كلاس الأخطاء المخصص `AppError`
قمنا بإنشاء ملف مخصص للأخطاء التي نتحكم بها في منطق العمل (Operational Errors) لتوحيد بناء الخطأ في سطر واحد.

* **مسار الملف:** `helper/appError.js`
* **الكود:**

```javascript
class appError extends Error {
    constructor(message, statusCode) {
        super(message); // تشغيل الـ constructor الخاص بكلاس Error الأصلي

        this.statusCode = statusCode;
        // تحديد الحالة بناءً على كود الخطأ (4xx تعني fail، و 5xx تعني error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
        // علامة مميزة لتفريق الأخطاء التشغيلية المتوقعة عن أخطاء الـ Bugs
        this.isOperational = true; 

        // إخفاء الـ constructor الداخلي من سجل تتبع الخطأ لتحديد السطر الفعلي المسبب للمشكلة بدقة
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = appError;

```

---

## الخطوة 2: إنشاء مُغلف الدوال غير المتزامنة `catchAsync`

بدلاً من تكرار كتل `try/catch` في كل الكنترولرز، قمنا بعمل دالة وسيطة تستقبل الـ Controller وتلتقط الأخطاء أوتوماتيكياً لتباصيها للدالة `next`.

* **مسار الملف:** `helper/catchAsync.js`
* **الكود:**

```javascript
module.exports = (asyncFn) => {
    return (req, res, next) => {
        // تنفيذ الدالة وفي حال حدوث أي خطأ (Reject) يتم تمريره فوراً إلى next()
        asyncFn(req, res, next).catch(next);
    };
};

```

---

## الخطوة 3: تحديث دالة الـ Controller

قمنا بتطبيق الـ `catchAsync` و الـ `AppError` داخل الكنترولر للتخلص من الـ `try/catch` والتعامل مع الأخطاء المتوقعة بسطر واحد شيك ونضيف.

* **مسار الملف:** `controllers/product.js` (كمثال لدالة جلب منتج بـ ID)
* **الكود بعد التعديل:**

```javascript
const catchAsync = require('../helper/catchAsync');
const AppError = require('../helper/appError');

// تغليف الدالة بالكامل بـ catchAsync وإضافة parameter الـ next
let productById = catchAsync(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id).populate('category');

        // إذا كان الـ ID سليم برمجياً ولكن المنتج غير موجود بالداتا بيز
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    }
);

module.exports = { productById };

```

---

## الخطوة 4: بناء الـ Global Error Handler Middleware

هذا هو المركز الرئيسي الذي تصب فيه جميع أخطاء التطبيق. وظيفته فحص الخطأ، وتنظيف أخطاء المونجوس المعقدة وتحويلها لرسائل مفهومة، ثم إرسال الرد النهائي للعميل.

* **مسار الملف:** `middleware/error-handler.js`
* **الكود:**

```javascript
const AppError = require('../helper/appError');

// 1. دالة التعامل مع الـ ID الغلط (تكوينياً) في مونجوس
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

// 2. دالة التعامل مع القيم المتكررة في الحقول الفريدة (Unique)
const handleDuplicatedFieldsDB = err => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicated field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

// 3. دالة التعامل مع أخطاء التحقق من البيانات (Validation) في الـ Schema
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// الـ Middleware الرئيسي المستدعى في app.js
module.exports = (err, req, res, next) => {
    // وضع كود 500 كقيمة افتراضية إذا لم يتوفر كود خطأ مخصص
    err.statusCode = err.statusCode || 500;

    // عمل نسخة من الخطأ لتأمين نقل الخصائص وتعديلها
    let error = Object.assign(err);
    error.message = err.message; 

    // فحص نوع الخطأ وتحويله باستخدام الدوال الفرعية
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    // السطر المسؤول عن إنهاء الـ Request وإرسال الرد للبوست مان / العميل
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
};

```

---

## الخطوة 5: ربط الـ Error Handler في ملف الـ `app.js` الرئيسي

المرحلة الأخيرة لضمان تفعيل النظام، مع مراعاة **الترتيب الصارم**: يجب وضع الـ `errorHandler` في نهاية الملف تماماً بعد تعريف كافة الراوتات (Routes).

* **مسار الملف:** `app.js`
* **الكود الكلي للربط:**

```javascript
const express = require('express');
const app = express();
const errorHandler = require('./middleware/error-handler');

// ... كل الـ Middlewares الافتراضية (express.json() , cors , الخ)

// تعريف راوتات التطبيق الأساسية
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/order`, orderRouter);

// تفعيل مركز معالجة الأخطاء (يجب أن يكون آخر سطر قبل بدء الاستماع للسيرفر)
app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

```

```