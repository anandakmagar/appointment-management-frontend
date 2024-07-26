document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login/login.html';
    });
});
