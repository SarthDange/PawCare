// ==========================================
// PAWCARE - MAIN JAVASCRIPT
// ==========================================


// ------------------------------------------
// Load shared components
// ------------------------------------------

async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Unable to load ${filePath}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error("Component loading error:", error);
    }
}


// ------------------------------------------
// Navigation
// ------------------------------------------

function setupNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-navigation");

    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// ------------------------------------------
// Active navigation link
// ------------------------------------------

function setupActiveNavigation() {
    const currentPath = window.location.pathname;

    const navigationLinks = document.querySelectorAll(
        ".main-navigation a"
    );

    navigationLinks.forEach((link) => {
        const linkPath = new URL(
            link.href,
            window.location.origin
        ).pathname;

        if (
            linkPath === currentPath ||
            (currentPath === "/" && linkPath === "/index.html")
        ) {
            link.classList.add("active");
        }
    });
}


// ------------------------------------------
// Form message helper
// ------------------------------------------

function showFormMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `form-message ${type}`;
}


// ------------------------------------------
// Contact form
// ------------------------------------------

function setupContactForm() {
    const form = document.getElementById("contactForm");

    if (!form) {
        return;
    }

    const messageElement = document.getElementById("contactMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message")
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            showFormMessage(
                messageElement,
                result.message,
                "success"
            );

            form.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            showFormMessage(
                messageElement,
                error.message,
                "error"
            );
        }
    });
}


// ------------------------------------------
// Appointment form
// ------------------------------------------

function setupAppointmentForm() {
    const form = document.getElementById("appointmentForm");

    if (!form) {
        return;
    }

    const messageElement = document.getElementById(
        "appointmentMessage"
    );

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            pet_name: formData.get("petName"),
            pet_type: formData.get("petType"),
            service: formData.get("service"),
            preferred_date: formData.get("preferredDate"),
            preferred_time: formData.get("preferredTime"),
            message: formData.get("message")
        };

        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to submit appointment request."
                );
            }

            showFormMessage(
                messageElement,
                result.message,
                "success"
            );

            form.reset();

        } catch (error) {
            console.error("Appointment form error:", error);

            showFormMessage(
                messageElement,
                error.message,
                "error"
            );
        }
    });
}


// ------------------------------------------
// Admin login
// ------------------------------------------

function setupLoginForm() {
    const form = document.getElementById("loginForm");

    if (!form) {
        return;
    }

    const messageElement = document.getElementById("loginMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Login failed."
                );
            }

            showFormMessage(
                messageElement,
                result.message,
                "success"
            );

            window.location.href = "/admin.html";

        } catch (error) {
            console.error("Login error:", error);

            showFormMessage(
                messageElement,
                error.message,
                "error"
            );
        }
    });
}


// ------------------------------------------
// Check admin session
// ------------------------------------------

async function checkAdminSession() {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
        window.location.href = "/login.html";
        return null;
    }

    const result = await response.json();

    if (
        !result.success ||
        !result.user ||
        result.user.role !== "admin"
    ) {
        window.location.href = "/login.html";
        return null;
    }

    return result.user;
}


// ------------------------------------------
// Format database date
// ------------------------------------------

function formatDate(dateString) {
    if (!dateString) {
        return "-";
    }

    const date = new Date(
        dateString.replace(" ", "T")
    );

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ------------------------------------------
// Create appointment status dropdown
// ------------------------------------------

function createStatusSelect(appointment) {
    const select = document.createElement("select");

    select.className =
        `admin-status-select status-${appointment.status}`;

    select.dataset.appointmentId = appointment.id;

    const statuses = [
        {
            value: "pending",
            label: "Pending"
        },
        {
            value: "confirmed",
            label: "Confirmed"
        },
        {
            value: "completed",
            label: "Completed"
        },
        {
            value: "cancelled",
            label: "Cancelled"
        }
    ];

    statuses.forEach((status) => {
        const option = document.createElement("option");

        option.value = status.value;
        option.textContent = status.label;

        if (status.value === appointment.status) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    select.addEventListener("change", () => {

        select.className =
            `admin-status-select status-${select.value}`;

        updateAppointmentStatus(
            appointment.id,
            select.value
        );
    });

    return select;
}


// ------------------------------------------
// Update appointment status
// ------------------------------------------

async function updateAppointmentStatus(
    appointmentId,
    status
) {
    const adminMessage = document.getElementById(
        "adminMessage"
    );

    try {
        const response = await fetch(
            `/api/admin/appointments/${appointmentId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Unable to update appointment status."
            );
        }

        showFormMessage(
            adminMessage,
            "Appointment status updated successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Appointment status update error:",
            error
        );

        showFormMessage(
            adminMessage,
            error.message,
            "error"
        );

        // Reload the appointment list so the
        // dashboard reflects the database state.
        loadAdminAppointments();
    }
}


// ------------------------------------------
// Load admin appointments
// ------------------------------------------

async function loadAdminAppointments() {
    const tableBody = document.getElementById(
        "appointmentsTableBody"
    );

    const countElement = document.getElementById(
        "appointmentCount"
    );

    if (!tableBody) {
        return;
    }

    try {
        const response = await fetch(
            "/api/admin/appointments"
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Unable to load appointments."
            );
        }

        const appointments = result.appointments || [];

        if (countElement) {
            countElement.textContent =
                `${appointments.length} request${appointments.length === 1 ? "" : "s"}`;
        }

        tableBody.innerHTML = "";

        if (appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No appointment requests found.
                    </td>
                </tr>
            `;

            return;
        }

        appointments.forEach((appointment) => {
            const row = document.createElement("tr");

            const ownerCell = document.createElement("td");

            ownerCell.innerHTML = `
                <strong>${escapeHtml(appointment.name)}</strong>
                <small>${escapeHtml(appointment.email)}</small>
                <small>${escapeHtml(appointment.phone)}</small>
            `;

            const petCell = document.createElement("td");

            petCell.innerHTML = `
                <strong>${escapeHtml(appointment.pet_name)}</strong>
                <small>${escapeHtml(appointment.pet_type)}</small>
            `;

            const serviceCell = document.createElement("td");

            serviceCell.textContent =
                appointment.service;

            const dateCell = document.createElement("td");

            dateCell.textContent =
                formatDate(appointment.preferred_date);

            const timeCell = document.createElement("td");

            timeCell.textContent =
                appointment.preferred_time;

            const statusCell = document.createElement("td");

            statusCell.appendChild(
                createStatusSelect(appointment)
            );

            row.appendChild(ownerCell);
            row.appendChild(petCell);
            row.appendChild(serviceCell);
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(
            "Admin appointments error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load appointments.
                </td>
            </tr>
        `;
    }
}


// ------------------------------------------
// Load admin contact enquiries
// ------------------------------------------

async function loadAdminContacts() {
    const tableBody = document.getElementById(
        "contactsTableBody"
    );

    const countElement = document.getElementById(
        "contactCount"
    );

    if (!tableBody) {
        return;
    }

    try {
        const response = await fetch(
            "/api/admin/contacts"
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Unable to load contact enquiries."
            );
        }

        const contacts = result.contacts || [];

        if (countElement) {
            countElement.textContent =
                `${contacts.length} enquir${contacts.length === 1 ? "y" : "ies"}`;
        }

        tableBody.innerHTML = "";

        if (contacts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No contact enquiries found.
                    </td>
                </tr>
            `;

            return;
        }

        contacts.forEach((contact) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");

            nameCell.innerHTML = `
                <strong>${escapeHtml(contact.name)}</strong>
            `;

            const emailCell = document.createElement("td");

            emailCell.textContent =
                contact.email;

            const subjectCell = document.createElement("td");

            subjectCell.textContent =
                contact.subject;

            const messageCell = document.createElement("td");

            messageCell.textContent =
                contact.message;

            const dateCell = document.createElement("td");

            dateCell.textContent =
                formatDate(contact.created_at);

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(subjectCell);
            row.appendChild(messageCell);
            row.appendChild(dateCell);

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(
            "Admin contacts error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load contact enquiries.
                </td>
            </tr>
        `;
    }
}


// ------------------------------------------
// Escape HTML
// ------------------------------------------

function escapeHtml(value) {
    const element = document.createElement("div");

    element.textContent =
        value === null || value === undefined
            ? ""
            : String(value);

    return element.innerHTML;
}


// ------------------------------------------
// Admin dashboard
// ------------------------------------------

async function setupAdminDashboard() {
    const adminPage = document.querySelector(
        ".admin-page"
    );

    if (!adminPage) {
        return;
    }

    const user = await checkAdminSession();

    if (!user) {
        return;
    }

    const welcomeMessage = document.getElementById(
        "adminWelcomeMessage"
    );

    if (welcomeMessage) {
        welcomeMessage.textContent =
            `Signed in as ${user.name} (${user.email})`;
    }

    await Promise.all([
        loadAdminAppointments(),
        loadAdminContacts()
    ]);

    const logoutButton = document.getElementById(
        "logoutButton"
    );

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            async () => {
                try {
                    const response = await fetch(
                        "/api/auth/logout",
                        {
                            method: "POST"
                        }
                    );

                    const result =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.message ||
                            "Unable to log out."
                        );
                    }

                    window.location.href =
                        "/login.html";

                } catch (error) {
                    console.error(
                        "Logout error:",
                        error
                    );

                    const adminMessage =
                        document.getElementById(
                            "adminMessage"
                        );

                    showFormMessage(
                        adminMessage,
                        error.message,
                        "error"
                    );
                }
            }
        );
    }
}


// ------------------------------------------
// Initialize PawCare
// ------------------------------------------

async function initializePawCare() {

    await Promise.all([
        loadComponent(
            "header",
            "/components/header.html"
        ),
        loadComponent(
            "footer",
            "/components/footer.html"
        )
    ]);

    setupNavigation();
    setupActiveNavigation();

    setupContactForm();
    setupAppointmentForm();
    setupLoginForm();

    setupAdminDashboard();
}


// ------------------------------------------
// Start application
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    initializePawCare
);