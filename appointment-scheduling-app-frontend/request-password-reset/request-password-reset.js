document.getElementById('requestResetForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await fetch(`https://appointment-management-da90d3c8d8ca.herokuapp.com/security/send-reset-code?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });

        if (response.ok) {
            window.location.href = 'password-reset.html';
        } else {
            console.error('Failed to send reset code:', response.status, response.statusText);
            alert('Failed to send reset code. Please check the email provided.');
        }
    } catch (error) {
        console.error('Error sending reset code:', error);
        alert('An error occurred while sending the reset code.');
    }
});
