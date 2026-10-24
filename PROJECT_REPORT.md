# HomeFix Project Report

**Project type:** Full-stack home-services booking platform  
**Prepared:** 22 October 2026

## 1. Executive summary

HomeFix is a web application that connects people seeking household repairs and maintenance with technicians offering those services. Customers can browse service categories and technician profiles, create an account, request an appointment, review their bookings, and access the payment flow. Technicians can register with a service profile and use a dashboard to manage incoming work and availability.

The application is implemented as a React single-page frontend and an Express/Node.js API backed by MongoDB through Mongoose. Authentication uses JSON Web Tokens (JWT), and the payment routes integrate with Razorpay.

## 2. Problem statement

Finding a suitable local home-service provider and coordinating an appointment can involve scattered information and manual communication. HomeFix provides a central interface for discovering technicians by service and location, submitting booking details, and tracking work through defined booking statuses.

## 3. Objectives

- Provide a searchable catalogue of home-service categories and technicians.
- Support customer and technician registration and login.
- Let customers submit and view service bookings.
- Give technicians a dedicated view for handling bookings and availability.
- Store profile, booking, and review data in a persistent database.
- Provide an online payment workflow through Razorpay.

## 4. Scope and user roles

### Customer

- Browse service categories and technician listings.
- View technician details and ratings.
- Register, log in, and create bookings.
- View and cancel bookings.
- Submit reviews through the review API.

### Technician

- Register with professional details, service category, location, skills, and rate.
- Access the technician dashboard.
- View assigned bookings and update booking status.
- Toggle availability and maintain a technician profile.

### Administrator

The data model defines an `admin` role and the server exports admin authorization middleware. The current frontend route list does not define an administrator dashboard.

## 5. Functional modules

1. **Authentication and access control** — account registration, technician registration, login, JWT issuance, and protected routes.
2. **Service catalogue** — predefined service categories including plumbing, electrician, carpenter, painting, cleaning, AC repair, appliance repair, and pest control.
3. **Technician discovery** — technician listing filters include category, city, and minimum rating; individual technician profiles can be retrieved by ID.
4. **Booking management** — booking creation, customer booking history, technician booking list, status updates, detail lookup, and cancellation.
5. **Reviews and ratings** — review submission and technician rating/review-count updates.
6. **Payments** — Razorpay order creation, signature verification, and booking payment-status lookup.
7. **Frontend navigation** — public pages for discovery and registration, customer-protected booking pages, and a technician-only dashboard route.

## 6. Technology stack

| Area | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express |
| Database / ODM | MongoDB, Mongoose |
| Authentication | JSON Web Token, bcryptjs |
| Payments | Razorpay |
| Development | npm, nodemon, concurrently |

## 7. System architecture

The browser-based React application communicates with the Express API using HTTP requests through a shared Axios API client. The client attaches a stored JWT to API requests. Express mounts route groups under `/api`, applies JSON parsing and CORS, and connects to MongoDB. Mongoose schemas define the stored records and references between users, technicians, bookings, and reviews.

**High-level request flow:**

`Customer or technician → React UI → Axios API client → Express route → Mongoose model → MongoDB`

Payment requests additionally use the Razorpay SDK and payment-signature verification.

## 8. Data model overview

- **User:** name, unique email, password hash, contact/location fields, role, profile image, and creation time.
- **Technician:** user reference, service category, experience, hourly rate, skills, availability, city/area, verification flag, rating, and job/review totals.
- **Booking:** customer and technician references, service details, appointment date/time, address, status, estimate/final cost, payment fields, notes, and timestamps.
- **Review:** booking, customer, and technician references, rating (1–5), comment, and creation time.

## 9. API overview

All routes are mounted under `/api`.

| Route group | Representative operations |
|---|---|
| `/auth` | `POST /register`, `POST /login`, `POST /register-technician` |
| `/services` | `GET /` |
| `/technicians` | `GET /`, `GET /:id`, `PUT /profile`, `PATCH /availability` |
| `/bookings` | `POST /`, `GET /my-bookings`, `GET /technician-bookings`, `PATCH /:id/status`, `GET /:id`, `DELETE /:id` |
| `/reviews` | `POST /`, `GET /technician/:id` |
| `/payment` | `POST /create-order`, `POST /verify`, `GET /status/:bookingId` |

Operations that require a signed-in user use bearer-token authentication.

## 10. Running the project

The repository has a root-level `install-all` script that installs server and client dependencies, and `dev` starts both applications concurrently.

1. Configure environment variables locally (do not commit credentials):
   - Server: `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and optionally `PORT`.
   - Client: `REACT_APP_API_URL` and, where needed by the UI, `REACT_APP_RAZORPAY_KEY_ID`.
2. Install dependencies using `npm run install-all` from the repository root.
3. Start both applications using `npm run dev`.
4. Alternatively, run the server and client separately using `npm run server` and `npm run client`.

The client build expects `REACT_APP_API_URL` to point to the server origin; the API client appends `/api`.

## 11. Verification status

The React production build completed successfully during the project review. This confirms that the current frontend compiles; it is not a substitute for end-to-end verification of database connectivity, authentication, booking authorization, or live Razorpay payments. No automated test suite was identified in the reviewed project files.

## 12. Limitations and recommended next steps

- Add automated API and UI tests, especially for booking ownership, technician authorization, and payment verification.
- Enforce authorization at the API level so users can only read or modify bookings they are entitled to access.
- Use a strong `JWT_SECRET` supplied through deployment configuration; avoid relying on a predictable code-level fallback.
- Validate and constrain request data, including amounts, booking status transitions, and technician profile updates.
- Confirm payment ownership and server-side order amount against the target booking before marking it paid.
- Add pagination and bounded query results to technician and booking listings as the dataset grows.
- Add a documented administrator workflow if administrative functions are in scope.
- Keep environment files and generated build/dependency directories out of version control.

## 13. Conclusion

HomeFix provides the core structure of a home-services marketplace: customer and technician accounts, technician discovery, booking lifecycle management, ratings, and payment integration. The React/Express/MongoDB stack is suitable for extending the application. The next development priorities should be stronger API authorization and validation, secure deployment configuration, and automated tests around critical booking and payment flows.
