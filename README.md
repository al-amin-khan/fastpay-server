# FastPay Server

Node/Express API for the FastPay billing platform. It exposes bill catalog data, user-specific bill records, and lightweight administration helpers for updating bill states. The service stores data in MongoDB Atlas and is deployed to Render for public consumption.

## Live API

##### URL: [https://fastpay-server-api.vercel.app/]()

## Features

- MongoDB-backed storage for shared bills (`bills`) and user-owned bills (`myBills`).
- Category filtering, latest bill lookup, and targeted updates by `ObjectId`.
- Slim CORS configuration that only allows trusted front-end origins.
- Configurable via environment variables and ready for deployment on any Node-friendly host.

## Tech Stack

- Node.js + Express 5
- MongoDB Node.js driver
- CORS middleware
- dotenv for configuration management

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Access to a MongoDB Atlas cluster (or any MongoDB-compatible URI)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
PORT=3000                 # Optional: defaults to 3000
mongodb_user=yourUser
mongodb_password=yourStrongPassword
appName=yourMongoAppName  # Atlas appName/connection option
```

The MongoDB URI is assembled from these values inside `index.js`, so keep them synchronized with your Atlas cluster configuration.

### Running the Server

```bash
npm start
```

Express starts on `http://localhost:<PORT>` and immediately connects to MongoDB. A successful connection logs `You successfully connected to MongoDB!`.

## API Reference

All responses are JSON. Unless noted, endpoints return HTTP `200` with either documents or the result object from MongoDB.

| Method | Path                        | Description                               | Notes                                                                                                                           |
| ------ | --------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/`                       | Health check                              | Returns `"FastPay server is running"`.                                                                                        |
| GET    | `/bills?category=<name>`  | List all bills or filter by category      | `category` is case-insensitive; omit or pass `all` to fetch everything.                                                     |
| GET    | `/bills/category`         | Distinct list of bill categories          | Returns `{ "categories": ["Electricity", ...] }`.                                                                             |
| GET    | `/latest-bills`           | Six most recent bills                     | Sorted by `date` descending, limited to projection of `title`, `category`, `location`, `date`.                        |
| GET    | `/bills/:id`              | Fetch a single bill by Mongo `ObjectId` | Returns the bill document or `null` if not found.                                                                             |
| PATCH  | `/bills/:id`              | Update bill status/date                   | Body supports `{ "status": "Paid", "date": "2024-06-01" }`.                                                                   |
| GET    | `/my-bills?email=<email>` | Get user-specific bills                   | Exact email match on `myBills` collection.                                                                                    |
| POST   | `/my-bills`               | Create a user bill record                 | Provide `billId`, `accountNumber`, `amount`, `billingMonth`, `username`, `phone`, `email`, `address`, `date`. |
| PATCH  | `/my-bills/:id`           | Update a user bill record                 | Same payload as POST, plus `updatedAt` is set from `date`.                                                                  |
| DELETE | `/my-bills/:id`           | Remove a user bill record                 | Returns `{ "deletedCount": 1 }` when successful.                                                                              |

### Example Requests

Fetch filtered bills:

```bash
curl "https://fastpay-server-api.onrender.com/bills?category=Electricity"
```

Create a bill for a user:

```bash
curl -X POST https://fastpay-server-api.onrender.com/my-bills \
  -H "Content-Type: application/json" \
  -d '{
    "billId": "E-2024-05-001",
    "accountNumber": "01010101",
    "amount": 1200,
    "billingMonth": "May 2024",
    "username": "Al Amin",
    "phone": "+8801XXXXXXX",
    "email": "user@example.com",
    "address": "Dhaka",
    "date": "2024-05-29T12:00:00.000Z"
  }'
```

Update bill status:

```bash
curl -X PATCH https://fastpay-server-api.onrender.com/bills/6655b6c98905ffae5fa3e0a4 \
  -H "Content-Type: application/json" \
  -d '{ "status": "Paid", "date": "2024-06-10" }'
```

## Deployment Notes

- Configure the same environment variables on Render (or your host).
- Ensure your MongoDB user has read/write permission on `fastPayDB`.
- Update the `allowedOrigins` array in `index.js` when introducing new front-end URLs.

## Troubleshooting

- **CORS errors**: Confirm the requesting origin is present in `allowedOrigins`.
- **Mongo connection failures**: Double-check credentials, IP allow list, and `appName`.
- **404 on `/bills/:id`**: Validate that the supplied `id` is a valid `ObjectId`.
