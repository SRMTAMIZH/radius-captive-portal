document.getElementById('loginForm').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        event.preventDefault();
        document.getElementById('errorMessage').innerText = 'Please fill in both fields.';
    } else {
        document.getElementById('errorMessage').innerText = '';
    }
});
