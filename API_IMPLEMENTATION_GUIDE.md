# Frontend API Implementation Guide

## API Endpoints Overview

### 1. **complaintApi.getAll()** - Used in: AdminComplaints, AdminBookings

- **Endpoint**: `GET /api/complaints`
- **Query Parameters**:
  - `status` (optional): Filter by status (Pending, Booked, In-Progress, Replaced, Rejected)
  - `search` (optional): Search by ticket_no, customer_name, or serial_no
  - `limit` (optional, default: 50): Number of records per page
  - `offset` (optional, default: 0): Pagination offset

**Response**:

```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": 1,
        "ticket_no": "RCMS-000001",
        "agent_id": 5,
        "customer_name": "John Doe",
        "customer_phone": "+1234567890",
        "customer_email": "john@example.com",
        "customer_address": "123 Main St",
        "serial_no": "CAM-2024-001",
        "device_model": "XYZ Camera",
        "issue_description": "Device not working",
        "purchase_date": "2024-01-15",
        "warranty_expiry": "2025-01-15",
        "warranty_valid": true,
        "status": "Pending",
        "priority": "high",
        "created_at": "2026-04-12T10:30:00Z",
        "updated_at": "2026-04-12T10:30:00Z"
      }
    ],
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

**Frontend Implementation Example**:

```javascript
// apiService.ts or similar
export const complaintApi = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `http://localhost:5000/api/complaints?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};

// In AdminComplaints component
useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const { complaints, total } = await complaintApi.getAll({
        status: selectedStatus,
        search: searchTerm,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      setComplaints(complaints);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };
  fetchComplaints();
}, [selectedStatus, searchTerm, currentPage]);
```

---

### 2. **bookingApi.getAll()** - Used in: AdminComplaints, AdminBookings

- **Endpoint**: `GET /api/manufacturer-updates`
- **Query Parameters**:
  - `limit` (optional, default: 50): Number of records per page
  - `offset` (optional, default: 0): Pagination offset

**Response**:

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "complaint_id": 5,
        "booking_id": "BOOKING-2024-001",
        "booked_date": "2026-04-10",
        "manufacturer_status": "In Transit",
        "reference_no": "REF-12345",
        "notes": "Device under warranty",
        "updated_at": "2026-04-12T15:45:00Z"
      }
    ],
    "total": 45
  }
}
```

**Frontend Implementation Example**:

```javascript
export const bookingApi = {
  getAll: async (limit = 50, offset = 0) => {
    const response = await fetch(
      `http://localhost:5000/api/manufacturer-updates?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};

// In AdminBookings component
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const { bookings, total } = await bookingApi.getAll(
        pageSize,
        (currentPage - 1) * pageSize,
      );
      setBookings(bookings);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };
  fetchBookings();
}, [currentPage]);
```

---

### 3. **bookingApi.create()** - Used in: AdminComplaints

- **Endpoint**: `POST /api/manufacturer-updates`
- **Request Body**:

```json
{
  "complaintId": 5,
  "bookingId": "BOOKING-2024-001",
  "bookedDate": "2026-04-10",
  "manufacturerStatus": "In Transit",
  "referenceNo": "REF-12345",
  "notes": "Device under warranty"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": 1,
      "complaint_id": 5,
      "booking_id": "BOOKING-2024-001",
      ...
    }
  }
}
```

**Frontend Implementation Example**:

```javascript
export const bookingApi = {
  create: async (bookingData) => {
    const response = await fetch(
      "http://localhost:5000/api/manufacturer-updates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data.booking;
  },
};

// In AdminComplaints component - when creating a booking for a complaint
const handleCreateBooking = async (complaintId) => {
  try {
    const booking = await bookingApi.create({
      complaintId: complaintId,
      bookingId: `BOOKING-${Date.now()}`,
      bookedDate: new Date().toISOString().split("T")[0],
      manufacturerStatus: "Pending",
      referenceNo: "",
      notes: "",
    });

    // Refresh complaints list to show updated status
    refetchComplaints();
    showMessage("Booking created successfully");
  } catch (error) {
    console.error("Failed to create booking:", error);
    showError(error.message);
  }
};
```

---

### 4. **complaintApi.updateStatus()** - Used in: AdminComplaints

- **Endpoint**: `PATCH /api/complaints/:id/status`
- **Request Body**:

```json
{
  "status": "Booked" // or "In-Progress", "Replaced", "Rejected"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Status updated",
  "data": {
    "complaint": {
      "id": 5,
      "ticket_no": "RCMS-000001",
      "status": "Booked",
      ...
    }
  }
}
```

**Frontend Implementation Example**:

```javascript
export const complaintApi = {
  updateStatus: async (complaintId, newStatus) => {
    const response = await fetch(
      `http://localhost:5000/api/complaints/${complaintId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data.complaint;
  },
};

// In AdminComplaints component - status dropdown/button
const handleStatusChange = async (complaintId, newStatus) => {
  try {
    const updated = await complaintApi.updateStatus(complaintId, newStatus);

    // Update UI
    setComplaints(complaints.map((c) => (c.id === complaintId ? updated : c)));

    showMessage(`Status updated to ${newStatus}`);
  } catch (error) {
    console.error("Failed to update status:", error);
    showError(error.message);
  }
};
```

---

## Complete API Service Example

```typescript
// services/apiService.ts
const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const complaintApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/complaints?${params}`, {
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data.complaint;
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data.complaint;
  },
};

export const bookingApi = {
  getAll: async (limit = 50, offset = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/manufacturer-updates?limit=${limit}&offset=${offset}`,
      { headers: getAuthHeader() },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  create: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/manufacturer-updates`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data.booking;
  },
};
```

---

## Usage in Components

### AdminComplaints Component

```jsx
function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Fetch complaints
    complaintApi
      .getAll({
        ...filters,
        limit: 50,
        offset: (page - 1) * 50,
      })
      .then((data) => {
        setComplaints(data.complaints);
      });

    // Fetch bookings
    bookingApi.getAll(50, (page - 1) * 50).then((data) => {
      setBookings(data.bookings);
    });
  }, [filters, page]);

  return (
    <div>
      {/* Complaints Table */}
      <table>
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.ticket_no}</td>
              <td>{complaint.customer_name}</td>
              <td>
                <select
                  value={complaint.status}
                  onChange={(e) =>
                    handleStatusChange(complaint.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Booked</option>
                  <option>In-Progress</option>
                  <option>Replaced</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleCreateBooking(complaint.id)}>
                  Create Booking
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bookings Table */}
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Complaint ID</th>
            <th>Status</th>
            <th>Booked Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.booking_id}</td>
              <td>{booking.complaint_id}</td>
              <td>{booking.manufacturer_status}</td>
              <td>{booking.booked_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Summary Table

| API Method                    | Endpoint                     | Method | Used In                        | Purpose                                 |
| ----------------------------- | ---------------------------- | ------ | ------------------------------ | --------------------------------------- |
| `complaintApi.getAll()`       | `/api/complaints`            | GET    | AdminComplaints, AdminBookings | Fetch all complaints with filtering     |
| `bookingApi.getAll()`         | `/api/manufacturer-updates`  | GET    | AdminComplaints, AdminBookings | Fetch all bookings/manufacturer updates |
| `bookingApi.create()`         | `/api/manufacturer-updates`  | POST   | AdminComplaints                | Create a new booking for a complaint    |
| `complaintApi.updateStatus()` | `/api/complaints/:id/status` | PATCH  | AdminComplaints                | Update complaint status                 |
