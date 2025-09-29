# Sports Club Backend - Sports APIs Testing

## Base Configuration

**Base URL:** `https://sports-pass-app-backend.onrender.com/api/`

### Common Headers (Public Requests)
```
Content-Type: application/json
Accept: application/json
```

### Headers for Protected (Admin/Trainer) Routes
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1. List Sports (Public)
**Endpoint:** `GET /sports`

**Query Parameters (optional):**
- `search` (string) – partial match on name or description (case-insensitive)
- `is_active` (true|false) – filter by active state
- `per_page` (int, default 15) – pagination size
- `page` (int) – page number

**Example:** `/api/sports?search=cricket&is_active=true&per_page=10`

**Sample Response (200):**
```json
{
  "status": "success",
  "data": {
    "sports": {
      "current_page": 1,
      "data": [
        {
          "id": "cricket",
          "name": "Cricket",
          "description": "Popular bat-and-ball sport.",
          "icon": "🏏",
          "color": "#3478f6",
          "is_active": true,
          "created_at": "2025-08-13T11:20:00.000000Z",
          "updated_at": "2025-08-13T11:20:00.000000Z"
        }
      ],
      "per_page": 10,
      "total": 1
    }
  }
}
```

---

## 2. List Active Sports (Public)
**Endpoint:** `GET /sports/active`

Returns all sports where `is_active = true` (no pagination).

**Sample Response (200):**
```json
{
  "status": "success",
  "data": {
    "sports": [
      { "id": "cricket", "name": "Cricket", "icon": "🏏", "color": "#3478f6", "is_active": true },
      { "id": "football", "name": "Football", "icon": "⚽", "color": "#34a853", "is_active": true }
    ]
  }
}
```

---

## 3. Show Single Sport (Public)
**Endpoint:** `GET /sports/{sport}`

`{sport}` resolves by the string primary key (slug-style ID) – e.g. `cricket`.

**Sample Response (200):**
```json
{
  "status": "success",
  "data": {
    "sport": {
      "id": "cricket",
      "name": "Cricket",
      "description": "Popular bat-and-ball sport.",
      "icon": "🏏",
      "color": "#3478f6",
      "is_active": true,
      "created_at": "2025-08-13T11:20:00.000000Z",
      "updated_at": "2025-08-13T11:20:00.000000Z"
    }
  }
}
```

**Not Found (404):**
```json
{ "status": "error", "message": "Sport not found" }
```

---

## 4. Create Sport (Protected)
**Endpoint:** `POST /admin/sports`

Requires valid Bearer token (intended for admin/trainer). Authorization middleware/role check should be added in code (not yet enforced in routes).

**Request Body:**
```json
{
  "name": "Table Tennis",
  "description": "Fast-paced indoor racket sport.",
  "icon": "🏓",
  "color": "#ff5722",
  "is_active": true
}
```

Notes:
- `id` (primary key) is auto-generated from the name (slugified) unless you explicitly provide a custom string id in implementation (current model auto-sets if missing).
- `icon` & `color` optional but recommended.

**Sample Response (201):**
```json
{
  "status": "success",
  "message": "Sport created successfully",
  "data": {
    "sport": {
      "id": "table-tennis",
      "name": "Table Tennis",
      "description": "Fast-paced indoor racket sport.",
      "icon": "🏓",
      "color": "#ff5722",
      "is_active": true,
      "created_at": "2025-08-14T07:10:00.000000Z",
      "updated_at": "2025-08-14T07:10:00.000000Z"
    }
  }
}
```

**Validation Error (422) Example:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": { "name": ["The name field is required."] }
}
```

---

## 5. Update Sport (Protected)
**Endpoint:** `PUT /admin/sports/{sport}`

**Request Body (any subset of fields):**
```json
{
  "name": "Table Tennis",
  "description": "Indoor racket sport with a lightweight ball.",
  "icon": "🏓",
  "color": "#ff7043",
  "is_active": false
}
```

**Sample Response (200):**
```json
{
  "status": "success",
  "message": "Sport updated successfully",
  "data": { "sport": { "id": "table-tennis", "name": "Table Tennis", "is_active": false } }
}
```

---

## 6. Toggle Sport Status (Protected)
**Endpoint:** `POST /admin/sports/{sport}/toggle-status`

Toggles `is_active` boolean.

**Sample Response (200):**
```json
{
  "status": "success",
  "message": "Sport status updated",
  "data": { "sport": { "id": "table-tennis", "is_active": true } }
}
```

---

## 7. Delete Sport (Protected)
**Endpoint:** `DELETE /admin/sports/{sport}`

**Sample Response (200):**
```json
{ "status": "success", "message": "Sport deleted successfully" }
```

**If Sport In Use (Example Future Constraint):**
```json
{ "status": "error", "message": "Cannot delete sport currently assigned to sessions" }
```

---

## 8. Error Response Patterns
| Scenario | Status | Structure |
|----------|--------|-----------|
| Validation failure | 422 | `{ "status":"error", "message":"Validation failed", "errors": { ... } }` |
| Unauthorized (no / bad token) | 401 | `{ "message": "Unauthenticated." }` (Laravel default) |
| Forbidden (future role check) | 403 | `{ "status":"error", "message":"Forbidden" }` |
| Not Found | 404 | `{ "status":"error", "message":"Sport not found" }` |
| Server Error | 500 | `{ "status":"error", "message":"Something went wrong" }` |

---

## 9. Postman / Testing Tips
1. Import this file or copy endpoints manually.
2. Create an environment variable `base_url` = `https://sports-pass-app-backend.onrender.com/api`.
3. For protected routes: obtain token from Auth APIs (see `AUTH_APIs.md`) and set a Postman variable `auth_token`.
4. In Authorization tab for protected requests choose type `Bearer Token` and use `{{auth_token}}`.
5. To quickly test slug creation, send multiple create requests with different names and inspect returned `id`.
6. Use query params in the list endpoint to test search & filtering.

---

## 10. Future Enhancements (Recommended)
- Add role/ability middleware to restrict `/admin/sports/*` routes.
- Add caching layer for `/sports/active` (e.g. cache for 5–10 minutes).
- Add soft deletes if historical analytics needed.
- Add image upload endpoint for sport icons/logos (currently simple emoji/string).

---

## Quick Reference
| Purpose | Method | URL |
|---------|--------|-----|
| List (paginated) | GET | /sports |
| List active | GET | /sports/active |
| Show | GET | /sports/{sport} |
| Create | POST | /admin/sports |
| Update | PUT | /admin/sports/{sport} |
| Toggle status | POST | /admin/sports/{sport}/toggle-status |
| Delete | DELETE | /admin/sports/{sport} |

---

If anything needs to be adjusted to match new backend changes, update this document alongside code modifications.


# Tiers API Documentation

This document describes the API endpoints for managing sport tiers in the Sports Club Backend.

## Overview

Tiers represent different membership packages for each sport (e.g., Basic, Pro, Elite). Only administrators can manage tiers through CRUD operations, while all users can view active and available tiers.

## Key Features

- **Time-based Availability**: Tiers can have start and end dates for promotional offers
- **Discount System**: Built-in discount percentage calculation
- **Feature Lists**: JSON array of features included in each tier
- **Auto-calculated Pricing**: Automatically calculates discounted prices
- **Flexible Duration**: Membership duration in days (customizable per tier)

## Authentication

All admin operations require authentication with an admin role. Use the `Authorization: Bearer {token}` header with a valid admin token.

## Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Tiers
```
GET /api/tiers
```

**Query Parameters:**
- `sport_id` (optional): Filter by specific sport ID
- `active` (optional): Filter by active status (true/false)
- `available` (optional): Filter by available tiers (within date range and active)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `search` (optional): Search in tier name, display name, and description
- `sort_by` (optional, default: 'tier_name'): Field to sort by
- `sort_order` (optional, default: 'asc'): Sort order (asc/desc)
- `per_page` (optional, default: 15): Number of items per page

**Example:**
```
GET /api/tiers?sport_id=123&available=true&min_price=50&max_price=150&per_page=10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tiers": [
      {
        "id": "uuid",
        "sport_id": "uuid",
        "tier_name": "pro",
        "display_name": "Basketball Pro",
        "description": "Professional basketball membership with personal training included",
        "price": "85.00",
        "duration_days": 60,
        "discount_percentage": "10.00",
        "discounted_price": "76.50",
        "start_date": null,
        "end_date": null,
        "features": [
          "Court access",
          "Personal training",
          "Equipment rental",
          "Advanced sessions"
        ],
        "is_active": true,
        "is_available": true,
        "created_at": "2025-08-14T10:00:00.000000Z",
        "updated_at": "2025-08-14T10:00:00.000000Z",
        "sport": {
          "id": "uuid",
          "name": "Basketball",
          "display_name": "Basketball"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 15,
      "total": 35
    }
  }
}
```

#### 2. Get Tier by ID
```
GET /api/tiers/{id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tier": {
      "id": "uuid",
      "sport_id": "uuid",
      "tier_name": "pro",
      "display_name": "Basketball Pro",
      "description": "Professional basketball membership with personal training included",
      "price": "85.00",
      "duration_days": 60,
      "discount_percentage": "10.00",
      "discounted_price": "76.50",
      "start_date": null,
      "end_date": null,
      "features": [
        "Court access",
        "Personal training",
        "Equipment rental",
        "Advanced sessions"
      ],
      "is_active": true,
      "is_available": true,
      "created_at": "2025-08-14T10:00:00.000000Z",
      "updated_at": "2025-08-14T10:00:00.000000Z",
      "sport": {
        "id": "uuid",
        "name": "Basketball",
        "display_name": "Basketball"
      }
    }
  }
}
```

#### 3. Get Tiers by Sport
```
GET /api/sports/{sport_id}/tiers
```

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)
- `available` (optional): Filter by available tiers (within date range and active)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `search` (optional): Search in tier name, display name, and description
- `sort_by` (optional, default: 'price'): Field to sort by
- `sort_order` (optional, default: 'asc'): Sort order (asc/desc)
- `per_page` (optional, default: 15): Number of items per page

#### 4. Get Available Tiers by Sport (Recommended for frontend)
```
GET /api/sports/{sport_id}/tiers/available
```

This endpoint returns only active tiers that are currently available (within date range).

**Response:**
```json
{
  "status": "success",
  "data": {
    "sport": {
      "id": "uuid",
      "name": "Basketball",
      "display_name": "Basketball"
    },
    "tiers": [
      {
        "id": "uuid",
        "tier_name": "basic",
        "display_name": "Basketball Basic",
        "description": "Basic basketball membership with access to courts and group sessions",
        "price": "45.00",
        "duration_days": 30,
        "discount_percentage": "0.00",
        "discounted_price": "45.00",
        "features": [
          "Court access",
          "Group training",
          "Basic equipment rental"
        ],
        "is_available": true
      },
      {
        "id": "uuid",
        "tier_name": "pro",
        "display_name": "Basketball Pro",
        "description": "Professional basketball membership with personal training included",
        "price": "85.00",
        "duration_days": 60,
        "discount_percentage": "10.00",
        "discounted_price": "76.50",
        "features": [
          "Court access",
          "Personal training",
          "Equipment rental",
          "Advanced sessions"
        ],
        "is_available": true
      }
    ]
  }
}
```

### Admin Endpoints (Requires Admin Authentication)

#### 1. Create Tier
```
POST /api/admin/tiers
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "sport_id": "uuid",
  "tier_name": "premium",
  "display_name": "Premium Basketball",
  "description": "Premium basketball membership with all features",
  "price": 120.00,
  "duration_days": 90,
  "discount_percentage": 15.00,
  "start_date": "2025-09-01",
  "end_date": "2025-12-31",
  "features": [
    "Premium court access",
    "Personal trainer",
    "All equipment included",
    "Nutrition consultation",
    "Recovery sessions"
  ],
  "is_active": true
}
```

**Validation Rules:**
- `sport_id`: Required, must exist in sports table
- `tier_name`: Required, max 50 characters, unique per sport
- `display_name`: Required, max 100 characters
- `description`: Optional, text
- `price`: Required, numeric, min 0, max 99,999,999.99
- `duration_days`: Optional, integer, min 1, max 3650 (10 years)
- `discount_percentage`: Optional, numeric, min 0, max 100
- `start_date`: Optional, date, must be today or future
- `end_date`: Optional, date, must be after start_date
- `features`: Optional, array of strings
- `is_active`: Optional, boolean, default true

#### 2. Update Tier
```
PUT /api/admin/tiers/{id}
```

All fields are optional in update requests. Same validation rules apply as create.

#### 3. Delete Tier
```
DELETE /api/admin/tiers/{id}
```

#### 4. Toggle Tier Status
```
POST /api/admin/tiers/{id}/toggle-status
```

## Integration with Sports

When fetching sports, tiers are automatically included:

```json
{
  "status": "success",
  "data": {
    "sports": [
      {
        "id": "uuid",
        "name": "Basketball",
        "display_name": "Basketball",
        "description": "Professional basketball training and facilities",
        "number_of_services": 4,
        "active_services_count": 4,
        "active_tiers_count": 3,
        "is_active": true,
        "available_tiers": [
          {
            "id": "uuid",
            "tier_name": "basic",
            "display_name": "Basketball Basic",
            "price": "45.00",
            "discounted_price": "45.00",
            "duration_days": 30,
            "features": ["Court access", "Group training"],
            "is_available": true
          }
        ],
        "active_services": [
          {
            "id": "uuid",
            "service_name": "Personal Training",
            "price": "50.00"
          }
        ]
      }
    ]
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "tier_name": ["The tier name is required."],
    "price": ["The price is required."]
  }
}
```

### Duplicate Tier Name (422)
```json
{
  "status": "error",
  "message": "A tier with this name already exists for this sport"
}
```

## Usage Examples

### Creating a Promotional Tier
```bash
curl -X POST http://localhost:8000/api/admin/tiers \
  -H "Authorization: Bearer your_admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "sport_id": "your_sport_id",
    "tier_name": "summer_special",
    "display_name": "Summer Special Offer",
    "description": "Limited time summer promotion",
    "price": 60.00,
    "duration_days": 45,
    "discount_percentage": 25.00,
    "start_date": "2025-08-15",
    "end_date": "2025-09-30",
    "features": ["All basic features", "Summer events", "Special discount"],
    "is_active": true
  }'
```

### Getting Available Tiers for a Sport
```bash
curl "http://localhost:8000/api/sports/your_sport_id/tiers/available"
```

### Filtering Tiers by Price Range
```bash
curl "http://localhost:8000/api/tiers?min_price=50&max_price=150&available=true"
```
