# Node.js + MongoDB Assignment API

Simple backend API built with Node.js, Express and MongoDB for an assignment demo. The project includes JWT authentication, class-based error handling, pagination, aggregation with `$lookup`, search, and a clean folder structure.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT

## Features

- 4 collections: Users, Posts, Comments, Categories
- Required 10+ APIs
- Pagination in all list APIs
- Aggregation with `$lookup`
- Search posts by title or content
- Class-based custom error handling
- JWT auth for protected routes
- Bonus: top 3 users with most posts
- Bonus: latest posts first sorting
- Bonus: `$group` and `$facet` aggregation usage

## Folder Structure

```bash
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  utils/
  app.js
  server.js
```

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/assignment_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. Start the server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start server with watch mode
- `npm start` - start server normally

## Main APIs

### Auth

- `POST /api/auth/register` - Register user and get token
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get logged in user profile

### Users

- `POST /api/users` - Create User
- `GET /api/users?page=1&limit=10` - Get All Users
- `GET /api/users/:id` - Get Single User
- `DELETE /api/users/:id` - Delete User
- `GET /api/users/top-posters` - Top 3 users with most posts

### Categories

- `POST /api/categories` - Create Category
- `GET /api/categories?page=1&limit=10` - Get All Categories

### Posts

- `POST /api/posts` - Create Post
- `GET /api/posts?page=1&limit=10` - Get All Posts
- `GET /api/posts/:id` - Get Post by ID with user, category and comments
- `PATCH /api/posts/:id` - Update Post
- `GET /api/posts/search?query=node&page=1&limit=10` - Search posts

### Comments

- `POST /api/comments` - Add Comment
- `GET /api/comments/post/:postId?page=1&limit=10` - Get Comments by Post

## Protected Routes

Use JWT token in header:

```bash
Authorization: Bearer your_token_here
```

Protected routes:

- `GET /api/auth/me`
- `POST /api/categories`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `POST /api/comments`

## Example Request Body

### Create User

```json
{
  "name": "Arpit",
  "email": "arpit@example.com",
  "password": "123456"
}
```

### Create Category

```json
{
  "name": "Technology",
  "description": "Tech related posts"
}
```

### Create Post

```json
{
  "title": "Node Assignment",
  "content": "This is a sample post content",
  "category": "category_object_id_here"
}
```

### Add Comment

```json
{
  "content": "Nice post",
  "postId": "post_object_id_here"
}
```

## Assignment Mapping

- User APIs: done
- Post APIs: done
- Comment APIs: done
- Search API: done
- Pagination: done
- Aggregation with `$lookup`: done
- Error handling: done
- JWT: added
- Bonus features: done
