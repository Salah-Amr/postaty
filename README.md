# postaty

A fullstack social-style web app that allows users to create, like, and save posts — built by a 4-member team.

## Features

- **Authentication**:
  - Register and Login using secure JWT-based authentication.
  - Passwords are hashed using `bcryptjs`.

- **Home Page**:
  - Displays all public posts from all users.
  - Users can like and save any post.

- **User Profile** (Protected by JWT):
  Divided into 3 sections:
  1. **My Posts** – View, edit, and delete your own posts.
  2. **Liked Posts** – View posts you liked.
  3. **Saved Posts** – View posts you saved.

- **Authorization**:
  - Only the owner of a post can edit or delete it.
  - All profile interactions are protected by token validation.

- **Validation**:
  - All request bodies are validated using `Joi` to ensure data integrity.

---

## Tech Stack

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (Authentication & Authorization)**
- **Joi** for request validation
- **bcryptjs** for password hashing

### Frontend:
- **Vanilla HTML, CSS, JavaScript**

---

## API Endpoints

### Auth
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive token

### Posts
- `GET /api/posts` – Get all posts
- `GET /api/posts/search` – Search for posts
- `POST /api/posts` – Create a new post *(auth required)*
- `PUT /api/posts/:id` – Edit your post *(auth required)*
- `DELETE /api/posts/:id` – Delete your post *(auth required)*
- `PUT /api/posts/:id/like` – Like/unlike a post *(auth required)*
- `PUT /api/posts/:id/save` – Save/unsave a post *(auth required)*

### User Profile
- `GET /api/users/me/posts` – Get your posts
- `GET /api/users/me/liked` – Get liked posts
- `GET /api/users/me/saved` – Get saved posts

---

## Run Locally

1. **Clone the repo**

   ```terminal
   git clone https://github.com/Salah-Amr/posts-app
   cd posts-app
   ```

2. **Install dependencies**

   ```terminal
   npm install
   ```

3. **Create `.env` file**

   ```env
   MONGO_URI=your_mongo_uri
   JWT_SIGN=your_jwt_secret
   PORT=5000
   ```

4. **Run the server**

   ```terminal
   npm start
   ```

5. **Open `index.html` in your browser** from the frontend folder

---

## Team

- 🎨 UI/UX: [ Jehad Ashour ](https://github.com/jehad16)
- 🎨 Frontend Developer: [ Mohammed Nour ](https://github.com/midonour)
- 👨‍💻 Backend Developer: [ Amr Mohammed](https://github.com/El-fnan)
- 👨‍💻 Backend Developer: [ Salah Amr ](https://github.com/Salah-Amr)

---

## 📸 Screenshots

> *You can add UI screenshots here (Home, Profile, etc.)*
