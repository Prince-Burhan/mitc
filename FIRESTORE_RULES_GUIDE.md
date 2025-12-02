# Firestore Security Rules - MITC Web App

## 🔒 Overview

Comprehensive security rules for the MITC Web App that protect data while enabling necessary functionality.

## 📋 Table of Contents

1. [Helper Functions](#helper-functions)
2. [Collections & Access Control](#collections--access-control)
3. [Data Validation](#data-validation)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Security Best Practices](#security-best-practices)

---

## Helper Functions

### Authentication Helpers

```javascript
// Check if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Check if user is admin
function isAdmin() {
  return isAuthenticated() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Check if user owns the document
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
```

### Validation Helpers

```javascript
// Validate product structure
function isValidProduct() {
  return request.resource.data.keys().hasAll([
    'title', 'brand', 'model', 'price', 'condition', 
    'stockCount', 'published', 'createdAt', 'updatedAt'
  ]) &&
  request.resource.data.title is string &&
  request.resource.data.title.size() > 0 &&
  request.resource.data.price is number &&
  request.resource.data.price >= 0 &&
  request.resource.data.stockCount is number &&
  request.resource.data.stockCount >= 0 &&
  request.resource.data.published is bool;
}
```

---

## Collections & Access Control

### 1. Users Collection (`/users/{userId}`)

**Purpose:** Store user profiles and roles

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | User (own profile) or Admin | User can only read their own data |
| **Create** | User (during signup) | Must set role='user', email matches auth |
| **Update** | User (own profile) or Admin | Users cannot change their role |
| **Delete** | Admin only | - |

**Security Features:**
- ✅ Users can only create themselves as 'user' role
- ✅ Users cannot elevate their own role to admin
- ✅ Email must match authentication token
- ✅ Only admins can delete users

**Example Document:**
```json
{
  "uid": "user123",
  "email": "customer@example.com",
  "displayName": "John Doe",
  "role": "user",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

### 2. Products Collection (`/products/{productId}`)

**Purpose:** Store laptop inventory

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Public (published only) or Admin | Unpublished products visible only to admins |
| **Create** | Admin only | Must pass validation |
| **Update** | Admin only | Must pass validation |
| **Delete** | Admin only | - |

**Validation Rules:**
- ✅ Required fields: title, brand, model, price, condition, stockCount, published
- ✅ Title must be non-empty string
- ✅ Price must be number ≥ 0
- ✅ Stock count must be number ≥ 0
- ✅ Published must be boolean

**Security Features:**
- 🔒 Public users only see `published: true` products
- 🔒 All write operations require admin role
- 🔒 Data structure validated on create/update

**Example Document:**
```json
{
  "id": "prod123",
  "title": "HP Pavilion 15",
  "brand": "HP",
  "model": "15-eh2xxx",
  "price": 55000,
  "condition": "New",
  "stockCount": 5,
  "published": true,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

### 3. Customers Collection (`/customers/{customerId}`)

**Purpose:** Track warranty and customer data

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Admin only | - |
| **Create** | Admin only | Must pass validation |
| **Update** | Admin only | Must pass validation |
| **Delete** | Admin only | - |

**Validation Rules:**
- ✅ Required fields: name, phone, email, purchaseDate, warrantyEndDate, status
- ✅ Status must be one of: 'Active', 'Warranty Expired', 'Review Requested', 'Completed'
- ✅ All contact fields must be strings

**Security Features:**
- 🔒 Complete privacy - only admins can access
- 🔒 Validation ensures data consistency
- 🔒 No public access to customer PII

**Example Document:**
```json
{
  "id": "cust123",
  "name": "Ahmad Khan",
  "phone": "+91-98765-43210",
  "email": "ahmad@example.com",
  "purchaseDate": Timestamp,
  "warrantyEndDate": Timestamp,
  "status": "Active",
  "createdAt": Timestamp
}
```

---

### 4. Store Reviews Collection (`/storeReviews/{reviewId}`)

**Purpose:** Customer reviews and ratings

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Public (approved only) or Admin | Pending/Rejected reviews only visible to admins |
| **Create** | Anyone | Must pass validation, status='Pending' |
| **Update** | Admin only | For approval/rejection |
| **Delete** | Admin only | - |

**Validation Rules:**
- ✅ Required fields: customerName, rating, comment, status, createdAt
- ✅ Rating must be number between 1-5
- ✅ Comment must be non-empty string
- ✅ Status must be: 'Pending', 'Approved', or 'Rejected'
- ✅ New reviews always created with status='Pending'

**Security Features:**
- 🔒 Reviews start as 'Pending' (moderation required)
- 🔒 Public only sees 'Approved' reviews
- 🔒 Only admins can approve/reject

**Example Document:**
```json
{
  "id": "review123",
  "customerName": "Sarah Ahmed",
  "rating": 5,
  "title": "Excellent Service",
  "comment": "Great laptop, helpful staff!",
  "status": "Approved",
  "createdAt": Timestamp
}
```

---

### 5. Settings Collection (`/settings/{document}`)

**Purpose:** Site configuration (branding, pages, integrations)

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Public | Anyone can read settings |
| **Create** | Admin only | - |
| **Update** | Admin only | - |
| **Delete** | Admin only | - |

**Security Features:**
- ✅ Public read access for site functionality
- 🔒 Only admins can modify settings
- 🔒 Prevents unauthorized branding changes

**Example Document:**
```json
{
  "branding": {
    "logo": "https://cloudinary.com/...",
    "slogan": "Premium Laptops in Kashmir",
    "phone": "+91-XXXXXXXXXX"
  },
  "pages": {
    "about": { "title": "About Us", "content": "..." }
  }
}
```

---

### 6. Analytics Collection (Optional)

**Purpose:** Track page views and user behavior

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Admin only | - |
| **Write** | Authenticated users | - |

**Use Cases:**
- Track product views
- Monitor popular pages
- User engagement metrics

---

### 7. Contact Submissions (Optional)

**Purpose:** Store contact form submissions

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | Admin only | - |
| **Create** | Anyone | - |
| **Update/Delete** | Admin only | - |

**Use Cases:**
- Contact form submissions
- Product inquiries
- Customer support requests

---

### 8. Notifications (Optional)

**Purpose:** User notifications (warranty reminders, etc.)

**Access Rules:**

| Operation | Who Can Access | Conditions |
|-----------|----------------|------------|
| **Read** | User (own) or Admin | - |
| **Create** | Admin only | - |
| **Update** | User (mark as read) or Admin | Users can only update 'read' field |
| **Delete** | Admin only | - |

**Security Features:**
- ✅ Users can only read their own notifications
- ✅ Users can only mark notifications as read
- 🔒 Cannot modify other fields

---

## Deployment

### 1. Deploy Rules

```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy rules and indexes
firebase deploy --only firestore
```

### 2. Verify Deployment

Go to Firebase Console:
1. Firestore Database → Rules
2. Check "Last deployed" timestamp
3. Review active rules

### 3. Test in Simulator

Firebase Console → Rules Playground:
```javascript
// Test as authenticated user
auth: { uid: 'user123', token: { email: 'user@example.com' } }

// Test as admin
auth: { uid: 'admin123' }
// (Make sure admin123 has role='admin' in Firestore)

// Test as unauthenticated
auth: null
```

---

## Testing

### Manual Tests

**Test 1: Public can read published products**
```javascript
// Unauthenticated
get(/databases/(default)/documents/products/prod123)
// Should ALLOW if published=true
// Should DENY if published=false
```

**Test 2: Users cannot create products**
```javascript
// Regular user (not admin)
create(/databases/(default)/documents/products/new123, { data: {...} })
// Should DENY
```

**Test 3: Admin can manage products**
```javascript
// Admin user
create(/databases/(default)/documents/products/new123, { data: {...} })
// Should ALLOW if data is valid
```

**Test 4: Users can only read their profile**
```javascript
// User with uid='user123'
get(/databases/(default)/documents/users/user456)
// Should DENY

get(/databases/(default)/documents/users/user123)
// Should ALLOW
```

**Test 5: Reviews require approval**
```javascript
// Anyone creates review
create(/databases/(default)/documents/storeReviews/new, {
  data: { status: 'Pending', rating: 5, comment: 'Great!' }
})
// Should ALLOW

// Try to create as 'Approved'
create(/databases/(default)/documents/storeReviews/new, {
  data: { status: 'Approved', rating: 5, comment: 'Great!' }
})
// Should DENY (only 'Pending' allowed on create)
```

---

## Security Best Practices

### ✅ Implemented

1. **Principle of Least Privilege**
   - Users only access what they need
   - Admins have full control
   - Public has read-only where appropriate

2. **Data Validation**
   - All writes validated for structure
   - Type checking enforced
   - Required fields verified

3. **Role-Based Access Control**
   - Clear admin vs user separation
   - Role changes restricted
   - Admin verification on sensitive operations

4. **Privacy Protection**
   - Customer data completely private
   - User profiles protected
   - Review moderation enforced

5. **Default Deny**
   - Explicit allow rules required
   - Unknown collections denied
   - Fallback to deny

### 🔒 Additional Recommendations

1. **Enable App Check** (Firebase Console)
   - Protects against abuse
   - Verifies requests from your app

2. **Monitor Usage** (Firebase Console → Usage)
   - Watch for unusual patterns
   - Set up billing alerts
   - Review audit logs

3. **Regular Audits**
   - Review rules quarterly
   - Check for overly permissive rules
   - Update as features change

4. **Backup Strategy**
   - Export Firestore data regularly
   - Store rules in version control (✅ Done)
   - Document changes

---

## Common Scenarios

### Scenario 1: User Signs Up

1. Firebase Auth creates user
2. App creates document in `/users/{uid}`
3. Rule checks:
   - ✅ User is authenticated
   - ✅ Creating own profile (uid matches)
   - ✅ Role set to 'user'
   - ✅ Email matches auth token
4. **ALLOWED** ✅

### Scenario 2: Admin Adds Product

1. Admin logged in
2. App creates document in `/products/{id}`
3. Rule checks:
   - ✅ User is authenticated
   - ✅ User has role='admin'
   - ✅ Product data is valid
4. **ALLOWED** ✅

### Scenario 3: Public Views Product

1. Unauthenticated user
2. App reads `/products/{id}`
3. Rule checks:
   - ✅ Product has `published: true`
4. **ALLOWED** ✅

### Scenario 4: Customer Submits Review

1. Anyone (guest or user)
2. App creates `/storeReviews/{id}`
3. Rule checks:
   - ✅ Data is valid (rating 1-5, comment exists)
   - ✅ Status set to 'Pending'
4. **ALLOWED** ✅
5. Admin later approves → changes status to 'Approved'
6. Now public can read it

---

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Causes:**
1. User not authenticated
2. User lacks required role
3. Data validation failed
4. Trying to access wrong collection

**Solutions:**
1. Ensure user is logged in
2. Check user role in Firestore
3. Verify data structure matches validation
4. Check collection path spelling

### Error: "PERMISSION_DENIED"

**Debug Steps:**
1. Check Firebase Console → Rules → Playground
2. Test with actual auth token
3. Verify document exists (for reads)
4. Check if trying to modify read-only fields

### Products Not Visible to Public

**Check:**
1. Is `published: true`?
2. Are rules deployed?
3. Is app reading from correct collection?
4. Check browser console for errors

---

## Summary

✅ **Secure:** Admin-only write access to sensitive data
✅ **Validated:** All writes checked for structure and types
✅ **Privacy:** Customer data completely protected
✅ **Public:** Appropriate read access for storefront
✅ **Moderation:** Review system with approval workflow
✅ **Flexible:** Optional collections for future features

**Your data is protected! 🔒**

---

**Last Updated:** December 2, 2025  
**Version:** 1.0
