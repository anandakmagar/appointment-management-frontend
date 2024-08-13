document.addEventListener('DOMContentLoaded', () => {
    // Initial token expiration check
    checkTokenExpiration();

    document.getElementById('logoutButton').addEventListener('click', async () => {
        // Clearing tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Notifying the server about the logout
        try {
            await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error during server logout:', error);
        }

        // Redirecting to login page
        window.location.href = 'login.html';
    });

    // Handling form submissions for different user types
    document.getElementById('clientCreateForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await createUser('client');
    });

    document.getElementById('staffCreateForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await createUser('staff');
    });

    document.getElementById('adminCreateForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await createUser('admin');
    });

    // Checking token expiration at regular intervals
    setInterval(checkTokenExpiration, 60000);
});


// Function to check token expiration and trigger logout if expired
function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) {
        logoutUser();
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
        logoutUser();
    }
}

// Function to handle user logout
async function logoutUser() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Attempting to logout from the server (optional)
        await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/logout', {
            method: 'POST'
        });

    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        // Redirecting to the login page after clearing the session
        window.location.href = 'login.html';
    }
}

// Triggering logout manually when the logout button is clicked
document.getElementById('logoutButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default button behavior
    logoutUser();
});

// Checking token expiration on page load
window.addEventListener('load', checkTokenExpiration);

// Checking token expiration at regular intervals (every minute)
setInterval(checkTokenExpiration, 60000);

// Ensuring token expiration is checked before the user leaves the page or closes the browser
window.addEventListener('beforeunload', checkTokenExpiration);


function handleUserTypeChange() {
    const userType = document.getElementById('userType').value;
    document.querySelectorAll('.user-form').forEach(form => form.style.display = 'none');
    if (userType === 'client') {
        document.getElementById('clientForm').style.display = 'block';
    } else if (userType === 'staff') {
        document.getElementById('staffForm').style.display = 'block';
    } else if (userType === 'admin') {
        document.getElementById('adminForm').style.display = 'block';
    }
}

async function createUser(type) {
    let apiUrl = '';
    let payload = {};

    if (type === 'client') {
        apiUrl = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/client/create';
        payload = {
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            phoneNumber: document.getElementById('clientPhoneNumber').value,
            clientAddressDTO: {
                streetAddress: document.getElementById('clientStreetAddress').value,
                city: document.getElementById('clientCity').value,
                state: document.getElementById('clientState').value,
                postalCode: document.getElementById('clientPostalCode').value
            }
        };
    } else if (type === 'staff') {
        apiUrl = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/staff/create';
        payload = {
            name: document.getElementById('staffName').value,
            email: document.getElementById('staffEmail').value,
            phoneNumber: document.getElementById('staffPhoneNumber').value,
            staffAddressDTO: {
                streetAddress: document.getElementById('staffStreetAddress').value,
                city: document.getElementById('staffCity').value,
                state: document.getElementById('staffState').value,
                postalCode: document.getElementById('staffPostalCode').value
            }
        };
    } else if (type === 'admin') {
        apiUrl = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/security/registerAdmin';
        payload = {
            name: document.getElementById('adminName').value,
            email: document.getElementById('adminEmail').value,
            password: document.getElementById('adminPassword').value
        };
    }

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            let idField = '';

            if (type === 'client') {
                idField = `Client created successfully and the clientId is ${data.clientId}.`;
            } else if (type === 'staff') {
                idField = `Staff created successfully and the staffId is ${data.staffId}.`;
            } else if (type === 'admin') {
                idField = `Admin created successfully.`;
            }

            alert(idField);
            document.getElementById(`${type}CreateForm`).reset();
            handleUserTypeChange(); // Hiding all forms and show user type selection
            document.getElementById('userType').value = ''; // Resetting userType selection
        } else {
            alert(`Failed to create ${type}`);
        }
    } catch (error) {
        console.error(`Error creating ${type}:`, error);
        alert(`An error occurred while creating the ${type}`);
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}
