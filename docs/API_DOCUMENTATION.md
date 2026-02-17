# SlideToTheWorld - Public API Documentation

**Base URL**: `http://localhost:8080` (Go backend)
**Frontend Proxy**: `/api/*` proxied from `:4200` to `:8080` in development

All public endpoints require **no authentication**.

---

## GET /api/health

Health check endpoint.

**Response** `200 OK`:
```json
{
  "status": "ok",
  "service": "sttw-backend",
  "version": "1.0.0",
  "time": "2026-02-17T12:00:00Z"
}
```

---

## GET /api/listings

Browse all property listings with cursor-based pagination.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cursor` | string | - | Pagination cursor (listing ID of last item) |
| `limit` | int | 20 | Items per page (max 100) |

**Response** `200 OK`:
```json
{
  "data": [
    {
      "listingId": 12345,
      "name": "Seaside Villa",
      "city": "Antalya",
      "country": "Turkey",
      "maxGuests": 6,
      "baseCurrency": "USD",
      "thumbnailUrl": "https://..."
    }
  ],
  "nextCursor": "12345"
}
```

**Notes**:
- `nextCursor` is empty string when there are no more results
- `thumbnailUrl` may be empty if no image is available

**Example**:
```bash
curl http://localhost:8080/api/listings?limit=6
curl http://localhost:8080/api/listings?cursor=12345&limit=20
```

---

## GET /api/listings/:listingId

Get detailed information about a specific listing.

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `listingId` | int | Hostaway Listing ID |

**Response** `200 OK`:
```json
{
  "listingId": 12345,
  "name": "Seaside Villa",
  "city": "Antalya",
  "country": "Turkey",
  "maxGuests": 6,
  "baseCurrency": "USD",
  "thumbnailUrl": "https://...",
  "description": "Beautiful seaside villa with ocean views...",
  "address": "123 Beach Road, Antalya, Turkey",
  "amenities": ["WiFi", "Pool", "Kitchen", "Air Conditioning"],
  "images": ["https://img1.jpg", "https://img2.jpg"],
  "checkInTime": "15:00",
  "checkOutTime": "11:00"
}
```

**Error Responses**:
- `400` - Invalid listingId format
- `404` - Listing not found

**Example**:
```bash
curl http://localhost:8080/api/listings/12345
```

---

## GET /api/listings/:listingId/availability

Get availability calendar and pricing for a listing over a date range.

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `listingId` | int | Hostaway Listing ID |

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `start` | string | Yes | Start date (YYYY-MM-DD) |
| `end` | string | Yes | End date (YYYY-MM-DD) |

**Response** `200 OK`:
```json
{
  "listingId": 12345,
  "start": "2026-03-01",
  "end": "2026-03-31",
  "currency": "USD",
  "days": [
    {
      "date": "2026-03-01",
      "isAvailable": true,
      "price": 150.00,
      "minimumStay": 2
    },
    {
      "date": "2026-03-02",
      "isAvailable": false,
      "reason": "booked"
    }
  ]
}
```

**Notes**:
- `price` is per night in the listing's base currency
- `minimumStay` is the minimum number of nights for check-in on that date
- `reason` is optional and explains why a date is unavailable
- Data comes from Hostaway Calendar API in real-time

**Error Responses**:
- `400` - Invalid listingId or missing start/end parameters
- `502` - Failed to fetch from Hostaway API

**Example**:
```bash
curl "http://localhost:8080/api/listings/12345/availability?start=2026-03-01&end=2026-03-31"
```

---

## POST /api/bookings

Create a new booking/reservation.

**Headers**:
| Header | Required | Description |
|--------|----------|-------------|
| `Idempotency-Key` | Yes | Unique key for safe retries (UUID recommended) |
| `Content-Type` | Yes | `application/json` |

**Request Body**:
```json
{
  "listingId": 12345,
  "checkIn": "2026-03-15",
  "checkOut": "2026-03-20",
  "guests": 4,
  "guest": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "payment": {
    "mode": "pay_at_property",
    "provider": "none",
    "paymentIntentId": "none"
  },
  "notes": "Late check-in around 10pm"
}
```

**Response** `201 Created`:
```json
{
  "bookingId": "abc-123-def",
  "hostawayReservationId": 98765,
  "status": "new",
  "listingId": 12345,
  "checkIn": "2026-03-15",
  "checkOut": "2026-03-20",
  "currency": "USD",
  "total": 750.00,
  "createdAt": "2026-02-17T14:30:00Z"
}
```

**Error Responses**:
- `400` - Invalid request body or missing Idempotency-Key
- `409` - Idempotency key conflict (duplicate request with different payload)
- `502` - Failed to create reservation in Hostaway

**Notes**:
- The `Idempotency-Key` header ensures safe retries. If the same key is sent again with the same payload, the original response is returned.
- Payment currently defaults to "pay_at_property" mode. Stripe/PayPal integration will be added later.
- The booking is created directly in Hostaway via their API.

**Example**:
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "listingId": 12345,
    "checkIn": "2026-03-15",
    "checkOut": "2026-03-20",
    "guests": 4,
    "guest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "payment": {
      "mode": "pay_at_property",
      "provider": "none",
      "paymentIntentId": "none"
    }
  }'
```

---

## Data Types Reference

### ListingSummary
| Field | Type | Description |
|-------|------|-------------|
| listingId | number | Hostaway listing ID |
| name | string | Property name |
| city | string? | City |
| country | string? | Country |
| maxGuests | number? | Maximum guest capacity |
| baseCurrency | string? | Currency code (e.g., "USD") |
| thumbnailUrl | string? | Thumbnail image URL |

### ListingDetails (extends ListingSummary)
| Field | Type | Description |
|-------|------|-------------|
| description | string? | Property description |
| address | string? | Full address |
| amenities | string[]? | List of amenity names |
| images | string[]? | List of image URLs |
| checkInTime | string? | Check-in time (e.g., "15:00") |
| checkOutTime | string? | Check-out time (e.g., "11:00") |

### AvailabilityDay
| Field | Type | Description |
|-------|------|-------------|
| date | string | Date in YYYY-MM-DD format |
| isAvailable | boolean | Whether the date is available for booking |
| price | number? | Price per night |
| minimumStay | number? | Minimum nights for check-in on this date |
| reason | string? | Reason for unavailability |

### BookingRequest
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| listingId | number | Yes | Hostaway listing ID |
| checkIn | string | Yes | Check-in date (YYYY-MM-DD) |
| checkOut | string | Yes | Check-out date (YYYY-MM-DD) |
| guests | number | Yes | Number of guests |
| guest.firstName | string | Yes | Guest first name |
| guest.lastName | string | Yes | Guest last name |
| guest.email | string | Yes | Guest email |
| guest.phone | string | No | Guest phone |
| payment.mode | string | Yes | Payment mode |
| payment.provider | string | Yes | Payment provider |
| payment.paymentIntentId | string | Yes | Payment intent ID |
| notes | string | No | Special requests |

### BookingResponse
| Field | Type | Description |
|-------|------|-------------|
| bookingId | string | Internal booking ID |
| hostawayReservationId | number | Hostaway reservation ID |
| status | string | Reservation status |
| listingId | number | Listing ID |
| checkIn | string | Check-in date |
| checkOut | string | Check-out date |
| currency | string? | Currency code |
| total | number? | Total price |
| createdAt | string | ISO 8601 timestamp |
