const navToggleButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const yearSpan = document.querySelector('#year');
const copyEmailButton = document.querySelector('#copy-email');
const emailLink = document.querySelector('#email-link');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

if (navToggleButton && nav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

if (copyEmailButton && emailLink) {
  copyEmailButton.addEventListener('click', async () => {
    const email = emailLink.textContent?.trim() || '';
    try {
      await navigator.clipboard.writeText(email);
      const original = copyEmailButton.textContent;
      copyEmailButton.textContent = 'Copied!';
      setTimeout(() => { copyEmailButton.textContent = original; }, 1200);
    } catch (e) {
      window.location.href = emailLink.getAttribute('href');
    }
  });
}

// Contact form handling
const contactForm = document.querySelector('#contact-form');
const statusEl = document.querySelector('#form-status');

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(id, message) {
  const el = document.querySelector('#error-' + id);
  if (el) el.textContent = message || '';
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setError('name', '');
    setError('email', '');
    setError('message', '');

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();

    let valid = true;
    if (!name) { setError('name', 'Please enter your name.'); valid = false; }
    if (!email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!validateEmail(email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (!message) { setError('message', 'Please enter a message.'); valid = false; }

    if (!valid) return;

    const subject = encodeURIComponent('New message from portfolio: ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

    if (statusEl) {
      statusEl.textContent = 'Opening your email app...';
    }

    window.location.href = 'mailto:pavankumar56214@gmail.com?subject=' + subject + '&body=' + body;
  });
}

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Find the button that was clicked
    const buttons = document.querySelectorAll('.copy-btn');
    buttons.forEach(btn => {
      if (btn.textContent === 'Copy') {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
} 