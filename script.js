document.getElementById('loginForm').addEventListener('submit', function(event) {
    // You can add form validation here if necessary
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        event.preventDefault();
        document.getElementById('errorMessage').innerText = 'Please fill in both fields.';
    }
});

