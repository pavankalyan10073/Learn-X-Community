function initAuthUI() {
  document.querySelectorAll('[data-auth]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const tab = btn.dataset.auth;
      if (tab === 'login') {
        window.location.href = 'login.html';
      } else {
        window.location.href = 'signup.html';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthUI();
});
