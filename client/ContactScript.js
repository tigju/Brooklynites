const form = document.querySelector('#contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();

  const data = {
    name,
    email,
    message
  };
});
