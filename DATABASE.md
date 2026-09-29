# PawCare — Database Design

## 1. Database
PawCare will use **SQLite** for a small, local relational database.

Database file:

```text
database/pawcare.db
```

## 2. Design Goal
The database should store only information that the website genuinely needs.

Avoid creating large numbers of tables simply to make the project look more advanced.

## 3. Core Tables

### users
Used only if authentication/admin functionality is implemented.

| Column | Purpose |
|---|---|
| id | Unique user ID |
| name | User/admin name |
| email | Login email |
| password_hash | Securely stored password hash |
| role | User/admin role |
| created_at | Account creation time |

Passwords must never be stored as plain text.

### appointments
Stores appointment requests submitted by visitors.

| Column | Purpose |
|---|---|
| id | Unique appointment ID |
| name | Customer name |
| email | Customer email |
| phone | Customer phone |
| pet_name | Pet name |
| pet_type | Dog, cat, etc. |
| service | Requested service |
| preferred_date | Requested date |
| preferred_time | Requested time |
| message | Additional information |
| status | Request status |
| created_at | Submission time |

Possible statuses:
- pending
- confirmed
- completed
- cancelled

The exact set can be adjusted during implementation.

### contacts
Stores contact/enquiry form submissions.

| Column | Purpose |
|---|---|
| id | Unique enquiry ID |
| name | Visitor name |
| email | Visitor email |
| subject | Enquiry subject |
| message | Enquiry |
| created_at | Submission time |

## 4. Relationships
The initial database can remain simple.

```text
users
  │
  └── used for authentication/admin access

appointments
  │
  └── independent customer requests

contacts
  │
  └── independent customer enquiries
```

A full customer-account relationship is not required unless the project later genuinely needs it.

## 5. Database Rules
- Use parameterized queries.
- Validate input on the server.
- Use appropriate data types.
- Keep table/column names consistent.
- Do not store unnecessary personal information.
- Do not store plain-text passwords.
- Keep database access in the server/database layer rather than directly inside page files.

## 6. Future Expansion
If later assignments genuinely require additional data, new tables may be added carefully.

Possible future additions:
- blog posts
- services
- analytics/conversion records

These should only be added when they provide a real project benefit.

## 7. Database Principle
The database should support the website, not become a separate project.

Start small, keep it understandable, and expand only when a real feature requires it.
