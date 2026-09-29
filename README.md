# PawCare — Pet Care & Wellness Center

## Project Overview
PawCare is a realistic, full-stack website for a fictional local pet-care business. It is being built for the Digital Marketing & Social Media course and will serve as the foundation for multiple assignments.

The goal is not to create a flashy or overly complex website. PawCare should look and behave like a believable small business website that could genuinely be used by pet owners.

## Core Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: SQLite
- Authentication: only where genuinely useful
- Environment variables: `.env`
- Security: proportional basic web-security practices

## Main Public Pages
- Home
- About
- Services
- Team
- Blog / Pet Care Tips
- FAQ
- Contact
- Appointment

## Main Functionality
- Browse services and business information
- Read pet-care content
- Submit contact enquiries
- Submit appointment requests
- Store submitted data in SQLite
- Basic admin-side management of enquiries/appointments where required

## Reusable Components
Repeated website elements must not be duplicated unnecessarily.

Shared components will be kept separately, for example:
- `public/components/header.html`
- `public/components/footer.html`

If a shared element changes, it should be changed in one place and reflected across the relevant pages.

Other components will only be separated when reuse genuinely makes the project cleaner.

## Visual Direction
PawCare must have a realistic, human-designed business website appearance.

Avoid:
- excessive colors
- random decorative shapes
- unnecessary gradients
- excessive glassmorphism
- huge animated elements
- excessive rounded cards
- decorative elements without a purpose
- the typical "AI/vibe-coded" landing-page appearance

Prefer:
- restrained colors
- strong typography hierarchy
- realistic spacing
- practical navigation
- subtle interaction effects
- authentic-looking photography/imagery
- clear calls to action
- consistent layouts

## Development Rule
The project should be complete enough from the beginning to support the later course assignments, but it must not become unnecessarily large.

Build useful functionality first. Do not add features merely because they are technically possible.

## Documentation
- `README.md` — project overview and rules
- `PROJECT_PLAN.md` — scope, pages, functionality and course reuse
- `ARCHITECTURE.md` — folder structure and technical architecture
- `DESIGN_SYSTEM.md` — visual and UI rules
- `DATABASE.md` — database structure and data rules
