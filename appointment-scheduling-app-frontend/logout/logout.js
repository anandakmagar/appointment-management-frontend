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

// Checking token expiration on page load
window.addEventListener('load', checkTokenExpiration);

// Also, checking token expiration at regular intervals (every minute)
setInterval(checkTokenExpiration, 60000);

// Triggering logout manually
document.getElementById('logoutButton').addEventListener('click', logoutUser);
