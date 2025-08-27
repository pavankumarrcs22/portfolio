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
const toastEl = document.querySelector('#toast');

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(id, message) {
  const el = document.querySelector('#error-' + id);
  if (el) el.textContent = message || '';
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError('name', '');
    setError('email', '');
    setError('message', '');

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let valid = true;
    if (!name) { setError('name', 'Please enter your name.'); valid = false; }
    if (!email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!validateEmail(email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (!message) { setError('message', 'Please enter a message.'); valid = false; }

    if (!valid) return;

    if (statusEl) statusEl.textContent = 'Sending...';

    // Build form data for FormSubmit
    const formData = new FormData(contactForm);
    // Ensure action exists on form
    const action = contactForm.getAttribute('action') || 'https://formsubmit.co/pavankumar56214@gmail.com';

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        if (statusEl) statusEl.textContent = '';
        showToast('Thanks! Your message has been sent.', 'success');
      } else {
        showToast('Sorry, something went wrong. Please try again.', 'error');
        if (statusEl) statusEl.textContent = '';
      }
    } catch (err) {
      showToast('Network error. Please try again later.', 'error');
      if (statusEl) statusEl.textContent = '';
    }
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

// Toast helper
function showToast(message, type) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.className = 'toast ' + (type === 'error' ? 'error' : 'success');
  // force reflow to restart animation if needed
  // eslint-disable-next-line no-unused-expressions
  toastEl.offsetHeight;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}