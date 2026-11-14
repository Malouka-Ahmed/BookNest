# BookNest – Book Discovery & Reading Tracker

A web app for people who love reading and want to track their reading habits.
Built with React, Node.js/Express, and MongoDB.

## Team
- Mahmoud: Authentication
- Nadeen: Books Catalog, Browse & Search
- Amr: Reading Lists & Home
- Malak: Foundation, Layout & Profile

## How to run the project

### Server
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and set `MONGO_URI`
4. Set `JWT_SECRET` to a random value of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. `node server.js`

### Client
1. `cd client`
2. `npm install`
3. `npm run dev`

The client uses the Vite proxy to reach the server on port `3001` by default.
Authentication endpoints are `POST /api/auth/register`, `POST /api/auth/login`,
and `GET /api/auth/me` (the last requires an Authorization header with a valid token).

## Features by team member

### Authentication (Mahmoud)
- What it does:
- Models and API endpoints:
- Screenshots:

### Books Catalog, Browse & Search (Nadeen)
- What it does:
- Models and API endpoints:
- Screenshots:

### Reading Lists & Home (Amr)
- What it does:
- Models and API endpoints:
- Screenshots:

### Layout & Profile (Malak)
- What it does:
- Models and API endpoints:
- Screenshots:

## Planned for the second half
- Reading stats and yearly goals
- Ratings, reviews, and wishlist
- Recommendations and reading challenges
