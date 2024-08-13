function logoutUser() {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }).then(response => {
        if (response.ok) {
            console.log('Logged out successfully');
        } else {
            console.log('Failed to log out');
        }
    }).finally(() => {
        window.location.href = 'login.html';
    });
}

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

// Checking token expiration on page load
window.addEventListener('load', checkTokenExpiration);

// Also, checking token expiration at regular intervals (every minute)
setInterval(checkTokenExpiration, 60000);

// Triggering logout manually
document.getElementById('logoutButton').addEventListener('click', logoutUser);










document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        checkTokenExpiration();
        window.location.href = 'login.html';
    });

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
});

function handleUserTypeChange() {
    checkTokenExpiration();
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
    checkTokenExpiration();
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
            handleUserTypeChange(); // Hide all forms and show user type selection
            document.getElementById('userType').value = ''; // Reset userType selection
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
