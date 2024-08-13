function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/logout', {
        method: 'POST'
    }).then(response => response.text())
      .then(text => console.log(text))
      .finally(() => {
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

// Checking token expiration at regular intervals (every minute)
setInterval(checkTokenExpiration, 60000);

// Triggering logout manually
document.getElementById('logoutButton').addEventListener('click', logoutUser);

// Ensuring the backend API is called even if the user leaves the page open or closes the browser
window.addEventListener('beforeunload', (event) => {
    checkTokenExpiration();
});



document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = 'login.html';
    });
});
