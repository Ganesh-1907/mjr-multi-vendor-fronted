# Multi-Vendor Ecommerce Platform

## Prerequisites

Install these tools on your new laptop:

| Tool | Version | Download |
|------|---------|----------|
| Java | 21 (JDK) | https://adoptium.net/ |
| Node.js | 20.x or 18.x | https://nodejs.org/ |
| Angular CLI | 19.x | `npm install -g @angular/cli@19` |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| Git | Latest | https://git-scm.com/ |

Verify installations:
```bash
java -version               # Should show 21
node -v                     # Should show v20.x or v18.x
npm -v                      # Should show 10.x+
ng version                  # Should show 19.x
mvn -version                # Should show 3.8+
mysql --version             # Should show 8.0+
```

---

## 1. Database Setup (MySQL)

### Create the database

Open MySQL terminal (or use MySQL Workbench):

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'ganesh';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

> **Note:** If you want a different username/password, copy the example file and edit it:
> ```bash
> cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
> ```
> Then edit the values in `application.properties`.

### Tables are auto-created

The backend uses `spring.jpa.hibernate.ddl-auto=update`, so **no manual SQL is needed** for tables. Hibernate automatically creates all tables when the backend starts.

---

## 2. Seed Data (Auto-Generated on First Run)

When the backend starts for the first time with an empty database, the `DataInitializer` class automatically seeds:

- **3 Roles**: ADMIN, VENDOR, CUSTOMER
- **5 Vendors** with stores
- **8 Categories** (Electronics, Fashion, Home & Kitchen, Sports, Books, Beauty, Toys, Automotive)
- **12 Products** with variants and images
- **Coupons**: WELCOME10 (10% off), MEGA20 (₹200 off)

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@marketplace.com` |
| Password | `password123` |
| Role | Admin |

> **Forgot Password:** Click "Forgot Password" on the login page. An OTP will be sent to the registered email. Email is configured via SMTP (Gmail) in application.properties. If SMTP is not set up, OTP emails may fail - check the backend logs for the OTP.

### Other Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | `john.doe@email.com` | `password123` |
| Vendor 1 | `rajesh.kumar@techstore.com` | `password123` |
| Vendor 2 | `priya.sharma@fashionhub.com` | `password123` |
| Vendor 3 | `amit.patel@homespecial.com` | `password123` |
| Vendor 4 | `suresh.verma@sportzone.com` | `password123` |
| Vendor 5 | `neha.gupta@bookworld.com` | `password123` |

> Run the backend first to generate the seed data, then use these credentials to login.

---

## 3. Running the Backend (Spring Boot)

```bash
cd backend

# Remove old build artifacts (if any)
mvn clean compile

# Start the backend server
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

Wait until you see:
```
Started EcommerceApplication in ... seconds
```

> If you get "Port 8080 already in use": kill the old process with `fuser -k 8080/tcp` or `lsof -ti :8080 | xargs kill -9`

---

## 4. Running the Frontend (Angular)

Open a **new terminal** (keep backend running):

```bash
cd multi-vendor

# Install dependencies (first time only)
npm install

# Start Angular dev server
npx ng serve
```

The frontend starts on **http://localhost:4200**

---

## 5. Swagger API Documentation

Once the backend is running, open your browser:

**http://localhost:8080/swagger-ui/index.html**

Swagger UI lists all REST endpoints grouped by controller. You can:
- View request/response schemas
- Test any API directly from the browser (Authorize with Bearer token for authenticated endpoints)
- See available status codes and parameters

The OpenAPI JSON spec is at: **http://localhost:8080/v3/api-docs**

---

## 6. API Endpoints Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/send-otp` | POST | Public | Send OTP for registration |
| `/api/auth/register` | POST | Public | Register new user |
| `/api/products` | GET | Public | List approved products |
| `/api/products/{slug}` | GET | Public | Product detail |
| `/api/categories` | GET | Public | List categories |
| `/api/cart` | GET | Any User | Get cart |
| `/api/cart/items` | POST | Any User | Add to cart |
| `/api/wishlist` | GET | Any User | Get wishlist |
| `/api/orders` | POST | Customer | Place order |
| `/api/payment/create-order` | POST | Any User | Create Razorpay order |
| `/api/payment/verify` | POST | Any User | Verify Razorpay payment |
| `/api/admin/dashboard` | GET | Admin | Dashboard stats |
| `/api/admin/orders` | GET | Admin | All orders |
| `/api/vendor/orders` | GET | Vendor | Vendor's orders |

---

## 6. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular | 19.0 |
| UI Library | Angular Material | 19.0 |
| Backend | Spring Boot | 3.4.0 |
| Database | MySQL | 8.0+ |
| JPA | Hibernate | 6.6 |
| JWT | jjwt | 0.12.6 |
| Payment | Razorpay | Test Mode |
| Java | OpenJDK | 21 |

---

## 7. Navigation URLs

| Page | URL |
|------|-----|
| Home | http://localhost:4200/ |
| Admin Login | http://localhost:4200/auth/login (select Admin) |
| Admin Dashboard | http://localhost:4200/admin/dashboard |
| Vendor Login | http://localhost:4200/auth/login (select Vendor) |
| Vendor Dashboard | http://localhost:4200/vendor/dashboard |
| Customer Login | http://localhost:4200/auth/login (select Customer) |
| Customer Dashboard | http://localhost:4200/customer/dashboard |
| Products | http://localhost:4200/products |
| Cart | http://localhost:4200/cart |
| Wishlist | http://localhost:4200/wishlist |

---

## 8. Common Issues & Fixes

**Port already in use (8080/4200):**
```bash
fuser -k 8080/tcp     # For backend
fuser -k 4200/tcp     # For frontend
```

**Database connection refused:**
- Make sure MySQL is running: `sudo systemctl start mysql`

**Build fails - dependency issues:**
```bash
cd backend && mvn clean compile
cd multi-vendor && npm install && npx ng build
```

**403 Forbidden on API calls:**
- Backend not running, or restart required after code changes

**Frontend shows blank/white page:**
- Check browser console (F12) for errors
- Ensure backend is running on port 8080
- Hard refresh (Ctrl+Shift+R)
