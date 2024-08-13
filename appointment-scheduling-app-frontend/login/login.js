function logoutUser() {
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




document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = 'home.html';
        } else {
            console.error('Failed to log in:', response.status, response.statusText);
            alert('Failed to log in. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
});

// Checking token expiration on page load
window.addEventListener('load', checkTokenExpiration);

// Also, checking token expiration at regular intervals (every minute)
setInterval(checkTokenExpiration, 60000);

// Triggering logout manually
document.getElementById('logoutButton').addEventListener('click', logoutUser);