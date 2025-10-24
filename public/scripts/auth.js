document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = encodeURIComponent(this.username.value);
  const password = encodeURIComponent(this.password.value);
  window.location.href = `/?username=${username}&password=${password}`;
});