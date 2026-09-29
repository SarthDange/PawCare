# PawCare — Architecture

## 1. Architecture Goal
Keep the project organized, reusable and easy to modify without creating unnecessary complexity.

## 2. Technology
- HTML
- CSS
- JavaScript
- Node.js
- Express
- SQLite
- dotenv
- bcrypt where authentication is used
- Helmet and validation/rate limiting where practical

## 3. Planned Folder Structure

```text
pawcare/
│
├── server/
│   ├── server.js
│   ├── database.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── contact.js
│       └── appointments.js
│
├── database/
│   └── pawcare.db
│
├── public/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── team.html
│   ├── blog.html
│   ├── faq.html
│   ├── contact.html
│   ├── appointment.html
│   │
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── main.js
│   │
│   ├── images/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.ico
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 4. Shared Components
Repeated elements must have a single source of truth.

### Header
`public/components/header.html`

The header contains the shared navigation/branding elements used across public pages.

### Footer
`public/components/footer.html`

The footer contains shared business information, navigation, contact details and other common footer content.

Pages should load these components rather than maintaining separate copies.

## 5. Reuse Rule
Before creating a repeated section, ask:

> "Will this exact element appear on multiple pages and need to be edited consistently?"

If yes, consider making it a shared component.

Do not create separate component files for every small section.

## 6. Data Flow

```text
Browser
   ↓
Public HTML/CSS/JavaScript
   ↓
Express Server
   ↓
Route
   ↓
Validation / Security
   ↓
SQLite Database
```

For forms:

```text
User fills form
      ↓
Frontend validation
      ↓
POST request
      ↓
Express route
      ↓
Server-side validation
      ↓
Parameterized SQL query
      ↓
SQLite
      ↓
Response to user
```

## 7. Separation of Responsibilities
- HTML: page structure/content
- CSS: appearance/layout/responsive behavior
- JavaScript: browser interactions and component loading
- Express: server-side logic/routes
- SQLite: persistent application data
- Middleware: reusable server-side checks/security

## 8. Project Principle
Prefer simple architecture that is easy for a student to understand, maintain and explain during evaluation.
