const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!gmailPattern.test(email)) {
    alert('Please enter a valid Gmail address ending with @gmail.com');
    emailInput.focus();
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    passwordInput.focus();
    return;
  }

  window.location.href = 'app.html';
});
