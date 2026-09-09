# AG-Shop

A RESTful E-Commerce backend API built with Node.js, Express.js, and MongoDB.

AG-Shop is a training-focused e-commerce backend designed to demonstrate how to build a structured REST API with product management, categories, users, authentication, image uploads, and order management.

The project follows a modular backend architecture using Express routers, controllers, middleware, Mongoose models, and utility functions.

>**Note:** This repository is currently a **Work in Progress (WIP)** and not yet suitable for production.

## Features

### Authentication & Users

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Admin role authorization
- Protected admin endpoints
- User management
- User count statistics

### Products

- Create products
- Get all products
- Filter products by category
- Get a single product
- Update products
- Delete products
- Get total product count
- Get featured products
- Upload product main image
- Upload multiple product gallery images
- Category population using Mongoose

### Categories

- Get all categories
- Get a single category
- Create categories
- Update categories
- Delete categories
- Admin-only category management

### Orders

- Create orders
- Calculate order total automatically from product prices and quantities
- Get all orders
- Get a single order
- Get orders for a specific user
- Update order status
- Delete orders
- Get total sales
- Get total order count

### Security

- JWT authentication
- Admin authorization middleware
- Password hashing with bcrypt
- Environment variables for secrets and database configuration
- Centralized error-handling middleware

### File Uploads

- Product image uploads using Multer
- Single image upload for the main product image
- Multiple image uploads for product galleries
- Uploaded files served through Express static middleware

## Tech Stack

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| Node.js      | JavaScript runtime            |
| Express.js 5 | REST API framework            |
| MongoDB      | Database                      |
| Mongoose     | MongoDB ODM                   |
| JWT          | Authentication                |
| bcrypt       | Password hashing              |
| Multer       | Image/file uploads            |
| Morgan       | HTTP request logging          |
| CORS         | Cross-Origin Resource Sharing |
| dotenv       | Environment configuration     |
| Nodemon      | Development server            |

## Project Architecture

The backend is organized into separate layers:

```
Backend/
│
├── controllers/
│   ├── category.js
│   ├── product.js
│   └── user.js
│
├── middleware/
│   ├── error-handler.js
│   ├── jwt.js
│   └── multer.js
│
├── models/
│   ├── category.js
│   ├── order-item.js
│   ├── order.js
│   ├── product.js
│   └── user.js
│
├── routers/
│   ├── categories.js
│   ├── orders.js
│   ├── products.js
│   └── users.js
│
├── utils/
│   ├── appError.js
│   ├── catchAsync.js
│   └── generateToken.js
│
├── public/
│   └── uploads/
│
├── app.js
├── package.json
└── .env
```

### Architecture Flow

```
Client
   │
   ▼
Express Router
   │
   ▼
Middleware
   │
   ├── JWT Authentication
   ├── Admin Authorization
   └── File Upload
   │
   ▼
Controller
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB / MongoDB Atlas
- Git

### 1. Clone the Repository

```
git clone https://github.com/azeez26/AG-Shop.git
```

```
cd AG-Shop
```

### 2. Install Dependencies

```
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the Backend directory:

```
PORT=3000
API_URL=/api/v1

CONNECTION_STRING=your_mongodb_connection_string

SECRET=your_jwt_secret
JWT_SECRET=your_jwt_secret
```

**Important:** The current implementation uses `SECRET` when generating JWTs and `JWT_SECRET` when verifying them. Therefore, both should currently contain the same secret value.

### 4. Start the Server

For development:

```
npm start
```

The project uses Nodemon, so the server automatically restarts when files change.

The API will be available at:

```
http://localhost:3000/api/v1
```

## Authentication

AG-Shop uses JWT Bearer Authentication.

After a successful login, the API returns a token:

```json
{
  "success": true,
  "data": {
    "user": "user@example.com",
    "token": "YOUR_JWT_TOKEN"
  }
}
```

For protected endpoints, send the token using the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The JWT middleware:

1. Extracts the Bearer token.
2. Verifies the token.
3. Finds the associated user.
4. Attaches the user to `req.user`.
5. Allows or denies the request.

Admin-only endpoints additionally verify:

```
req.user.isAdmin === true
```

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Users API

#### Register

`POST /users/signup`

Creates a new user account.

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01012345678",
  "street": "Main Street",
  "apartment": "12",
  "zip": "12345",
  "city": "Cairo",
  "country": "Egypt"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01012345678"
  }
}
```

The password is hashed before being stored in MongoDB.

#### Login

`POST /users/login`

Authenticates a user and returns a JWT.

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "user": "john@example.com",
    "token": "YOUR_JWT_TOKEN"
  }
}
```

#### Get All Users

`GET /users`

Admin only

Returns all registered users without their passwords.

**Response**

```json
{
  "success": true,
  "count": 10,
  "data": []
}
```

#### Get Users Count

`GET /users/get/count`

Admin only

Returns the number of registered users.

#### Delete User

`DELETE /users/:id`

Admin only

Deletes a user by MongoDB ObjectId.

### Products API

#### Get All Products

`GET /products`

Returns all products.

**Response**

```json
{
  "success": true,
  "count": 10,
  "data": []
}
```

#### Filter Products by Categories

`GET /products?categories=CATEGORY_ID`

You can also provide multiple category IDs separated by commas:

```
GET /products?categories=ID_1,ID_2,ID_3
```

The API filters products whose category matches one of the provided IDs.

#### Get Product by ID

`GET /products/:id`

Returns a single product and populates its category.

Example:

```
GET /products/65abc123...
```

#### Create Product

`POST /products`

Creates a new product.

The endpoint expects `multipart/form-data` because the main product image is uploaded using Multer.

**Form Data**

| Field           | Type             |
| --------------- | ---------------- |
| name            | String           |
| description     | String           |
| richDescription | String           |
| brand           | String           |
| price           | Number           |
| category        | MongoDB ObjectId |
| countInStock    | Number           |
| rating          | Number           |
| numReviews      | Number           |
| isFeatured      | Boolean          |
| image           | File             |

The uploaded image is stored under:

```
/public/uploads/
```

and its URL is stored in the product document.

#### Update Product

`PUT /products/:id`

Updates an existing product.

**JSON Body**

```json
{
  "name": "Updated Product",
  "description": "Updated description",
  "richDescription": "Detailed description",
  "image": "https://example.com/image.jpg",
  "brand": "Example Brand",
  "price": 150,
  "category": "CATEGORY_ID",
  "countInStock": 25,
  "rating": 4.5,
  "numReviews": 20,
  "isFeatured": true
}
```

#### Delete Product

`DELETE /products/:id`

Deletes a product by ID.

#### Get Product Count

`GET /products/get/count`

Returns the total number of products.

**Response**

```json
{
  "success": true,
  "data": 25
}
```

#### Get Featured Products

`GET /products/get/featured/:count`

Returns a limited number of featured products.

Example:

```
GET /products/get/featured/5
```

Returns up to 5 products where:

```
isFeatured = true
```

#### Upload Product Gallery Images

`PUT /products/gallery-images/:id`

Uploads multiple images for a product gallery.

The request uses `multipart/form-data`.

**Field**

```
images
```

Maximum number of uploaded images:

```
10
```

### Categories API

#### Get All Categories

`GET /categories`

Returns all categories.

**Response**

```json
{
  "success": true,
  "count": 5,
  "data": []
}
```

#### Get Category by ID

`GET /categories/:id`

Returns a single category.

#### Create Category

`POST /categories`

Admin only

**Request Body**

```json
{
  "name": "Electronics",
  "icon": "laptop",
  "color": "#3498db"
}
```

#### Update Category

`PUT /categories/:id`

Admin only

**Request Body**

```json
{
  "name": "Updated Category",
  "icon": "shopping-bag",
  "color": "#2ecc71"
}
```

#### Delete Category

`DELETE /categories/:id`

Admin only

Deletes a category by ID.

### Orders API

#### Create Order

`POST /order`

Creates an order and automatically calculates its total price based on the current product prices and requested quantities.

**Request Body**

```json
{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    },
    {
      "product": "ANOTHER_PRODUCT_ID",
      "quantity": 1
    }
  ],
  "shippingAddress1": "123 Main Street",
  "shippingAddress2": "Apartment 5",
  "city": "Cairo",
  "zip": "12345",
  "country": "Egypt",
  "phone": "01012345678",
  "status": "Pending",
  "user": "USER_ID"
}
```

#### Order Calculation

The server calculates:

```
Item Total = Product Price × Quantity
```

Then:

```
Order Total = Sum of all Item Totals
```

The calculated value is stored as `totalPrice`.

#### Get All Orders

`GET /order`

Returns all orders sorted by newest first.

User and product/category references are populated where applicable.

#### Get Order by ID

`GET /order/:id`

Returns a specific order with:

- User information
- Order items
- Products
- Product categories

#### Update Order Status

`PUT /order/:id`

Updates the status of an existing order.

**Request Body**

```json
{
  "status": "Shipped"
}
```

#### Delete Order

`DELETE /order/:id`

Deletes an order and its associated order items.

#### Get User Orders

`GET /order/get/userorders/:userid`

Returns all orders belonging to a specific user.

Example:

```
GET /order/get/userorders/USER_ID
```

#### Get Total Sales

`GET /order/get/totalsales`

Calculates the total sales value across all orders.

**Response**

```json
{
  "totalsales": 12500
}
```

#### Get Orders Count

`GET /order/get/count`

Returns the total number of orders.

**Response**

```json
{
  "orderCount": 42
}
```

## Database Models

The project uses five main Mongoose models:

```
User
 │
 ├── Orders
 │
 └── Authentication

Category
 │
 └── Products

Product
 │
 └── OrderItems

OrderItem
 │
 └── Product

Order
 ├── User
 └── OrderItems
```

### User

Contains:

- Name
- Email
- Hashed password
- Phone
- Admin status
- Address information
- Timestamps

### Product

Contains:

- Name
- Description
- Rich description
- Main image
- Gallery images
- Brand
- Price
- Category
- Stock quantity
- Rating
- Number of reviews
- Featured flag
- Creation date

### Category

Contains:

- Name
- Icon
- Color

### OrderItem

Represents a product and its quantity inside an order.

### Order

Contains:

- Order items
- Shipping address
- City
- ZIP code
- Country
- Phone
- Status
- Total price
- User
- Order date

## Authorization Matrix

| Endpoint                          | Public | Authenticated | Admin |
| --------------------------------- | ------ | ------------- | ----- |
| POST /users/signup                | Yes    |               |       |
| POST /users/login                 | Yes    |               |       |
| GET /products                     | Yes    |               |       |
| GET /products/:id                 | Yes    |               |       |
| GET /products/get/count           | Yes    |               |       |
| GET /products/get/featured/:count | Yes    |               |       |
| POST /products                    | Yes*   |               |       |
| PUT /products/:id                 | Yes*   |               |       |
| DELETE /products/:id              | Yes*   |               |       |
| PUT /products/gallery-images/:id  | Yes*   |               |       |
| GET /categories                   | Yes    |               |       |
| GET /categories/:id               | Yes    |               |       |
| POST /categories                  |        |               | Yes   |
| PUT /categories/:id               |        |               | Yes   |
| DELETE /categories/:id            |        |               | Yes   |
| GET /users                        |        |               | Yes   |
| GET /users/get/count              |        |               | Yes   |
| DELETE /users/:id                 |        |               | Yes   |
| POST /order                       | Yes*   |               |       |
| GET /order                        | Yes*   |               |       |
| GET /order/:id                    | Yes*   |               |       |
| PUT /order/:id                    | Yes*   |               |       |
| DELETE /order/:id                 | Yes*   |               |       |
| GET /order/get/userorders/:userid | Yes*   |               |       |
| GET /order/get/totalsales         | Yes*   |               |       |
| GET /order/get/count              | Yes*   |               |       |

\* These routes are currently exposed without JWT middleware in the repository's current implementation. Authentication/authorization can be added later depending on the intended production security model.

## Image Storage

Uploaded product images are served statically through:

```
/public/uploads
```

For example:

```
http://localhost:3000/public/uploads/product-image.jpg
```

The backend automatically builds the image URL using the current request protocol and host.

## Error Handling

The project uses a centralized error-handling approach.

Controllers use asynchronous error handling through the `catchAsync` utility, while application-specific errors are represented through `appError`.

This helps keep controllers cleaner and prevents repetitive try/catch blocks.

## Testing the API

The API can be tested using tools such as:

- Postman
- Insomnia
- Thunder Client
- Frontend applications

### Recommended Testing Flow

```
1. Register a user
       ↓
2. Login
       ↓
3. Save JWT token
       ↓
4. Create an admin account / use an admin user
       ↓
5. Create categories
       ↓
6. Create products
       ↓
7. Upload product images
       ↓
8. Create orders
       ↓
9. Update order status
       ↓
10. Check sales & statistics
```

For protected endpoints, use:

```
Authorization: Bearer <JWT_TOKEN>
```

## API Summary

### Users

```
POST    /users/signup
POST    /users/login
GET     /users
GET     /users/get/count
DELETE  /users/:id
```

### Products

```
POST    /products
GET     /products
GET     /products/:id
PUT     /products/:id
DELETE  /products/:id
GET     /products/get/count
GET     /products/get/featured/:count
PUT     /products/gallery-images/:id
```

### Categories

```
GET     /categories
GET     /categories/:id
POST    /categories
PUT     /categories/:id
DELETE  /categories/:id
```

### Orders

```
POST    /order
GET     /order
GET     /order/:id
PUT     /order/:id
DELETE  /order/:id
GET     /order/get/userorders/:userid
GET     /order/get/totalsales
GET     /order/get/count
```

## Project Purpose

AG-Shop was built as a practical backend training project to apply real-world backend development concepts, including:

- RESTful API design
- MVC-style architecture
- MongoDB data modeling
- Mongoose relationships and population
- JWT authentication
- Role-based authorization
- Password hashing
- File uploads
- Error handling
- Async controller handling
- API filtering
- Aggregation
- Order processing
- Backend project organization

## Current Limitations / Future Improvements

The current version is primarily a training project. Possible future improvements include:

- Add JWT protection to product management endpoints
- Add authentication to order creation and order management
- Validate request bodies using Joi or another validation library
- Add pagination and sorting for products and orders
- Add product search
- Add advanced filtering by price, rating, and stock
- Add rate limiting
- Improve image upload validation
- Add image deletion when products are removed
- Add payment integration
- Add order stock management
- Add API documentation using Swagger / OpenAPI
- Add automated tests
- Add Docker support
- Add production logging and monitoring
- Add refresh-token authentication
- Improve role and permission management

## License

This project is licensed under the ISC License.

## Author

Developed by Mostafa Abdulazeez as a backend training project using the Node.js / Express.js / MongoDB stack.

If you find this project useful, feel free to fork the repository, experiment with the API, and improve the implementation.
