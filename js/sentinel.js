var result;
var emailInput;
var passwordInput;
var isLoginFormVisible;

document.addEventListener('DOMContentLoaded', function () {
   isLoginFormVisible = true;
   result = document.getElementById('result');
   emailInput = document.getElementById('email');
   passwordInput = document.getElementById('password');
   var toggleButton = document.getElementById('toggleButtonHeader');
   var toggleButton = document.getElementById('toggleButton');
   var loginForm = document.getElementById('loginForm');
   var requestToRegisterForm = document.getElementById('requestToRegisterForm');

   loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      login();
   });

   requestToRegisterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      requestToRegister();
   });

   toggleButton.addEventListener('click', function () {
      toggleForm();
   });

   loginForm.classList.add('visible');
});

function toggleForm() {
   isLoginFormVisible = !isLoginFormVisible;
   if (isLoginFormVisible) {
      toggleButtonHeader.textContent = "New User?";
      toggleButton.textContent = "Request Login";
      loginForm.classList.add('visible');
      requestToRegisterForm.classList.remove('visible');
   } else {
      toggleButtonHeader.textContent = "Already registered?";
      toggleButton.textContent = "Login Page";
      loginForm.classList.remove('visible');
      requestToRegisterForm.classList.add('visible');
   }
}

function login() {
   var username = emailInput.value;
   var password = passwordInput.value;
   var redirectUriInput = document.querySelector('[name="redirectUri"]');
   var redirectUri = redirectUriInput.value;

   //var selectedOption = document.getElementById('redirectOption')?.value ?? redirectUri;
   //console.log('Selected option value: ' + selectedOption);
   //if (selectedOption == 'userPage') redirectUri = "/user/dashboard";
   //else if (selectedOption == 'adminPage') redirectUri = "/admin/dashboard";

   var data = {
      email: username,
      password: password,
      redirectUri: redirectUri
   };

   fetch('/api/auth/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(function (response) {
         if (response.ok) {
            return response.json();
         }
         throw new Error('API request failed');
      })
      .then(function (response) {
         clearFields();
         result.textContent = 'Login successful. You will be redirected';
         console.log(response);
         console.log(response.message);
         localStorage.setItem('jwtToken', response.message);
         if (redirectUri) {
            console.log("Redirect URI: " + redirectUri);
            console.log(data);
            window.location.href = redirectUri;
         } else {
            console.log("Redirection Failed!!!");
            console.log(data);
            window.location.href = '/';
         }
      })
      .catch(function (error) {
         clearFields();
         console.log("Error: ", error);
         result.textContent = 'Invalid credentials or User not activated';
      });
}

function logoutUser() {
   window.location.href = "/logout";
}

function clearFields() {
   emailInput.value = '';
   passwordInput.value = '';
   requestEmail.value = '';
   requestFullname.value = '';
}

function register() {
   var username = document.getElementById('username').value;
   var password = passwordInput.value;

   var data = {
      username: username,
      password: password
   };

   fetch('/api/auth/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(function (response) {
         //$('#result').text('Registration successful. JWT: ' + response.token);
      })
      .catch(function (error) {
         result.textContent = 'Registration failed. Error: ' + error;
      });
}

function requestToRegister() {
   var data = {
      email: document.getElementById('requestEmail').value,
      fullname: document.getElementById('requestFullname').value
   };

   fetch('/api/auth/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(async function (response) {
         console.log("Response: ", response);
         if (response.ok) return response.json();
         let error = await response.json();
         console.log(error);
         throw new Error(error.message);
      })
      .then(function (d) {
         console.log("Success: ", d);
         clearFields();
         result.textContent = `${d.message}. You will be notified via email when approved`;
      })
      .catch(function (error) {
         console.log(error);
         clearFields();
         console.log("Error: ", error);
         result.textContent = error; // 'Invalid username/email or login already requested.';
      });
}

// ADMIN FUNCTIONS

function approveUser(email) {
   let data = {
      email: email
   };

   fetch('/api/auth/approve', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(data => {
         // Handle the success response
         alert('User account activated!');
         window.location.reload();
      })
      .catch(error => {
         // Handle any errors that occurred during the fetch
         console.error('Error approving user:', error);
         alert('Error approving user: ' + error.message);
      });
}


function promoteUser(email) {
   console.log(`Promoting user ${email}...`);
   var data = {
      email: email,
   };

   fetch('/api/auth/promote', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(function (response) {
         if (response.ok) {
            return response.json();
         }
         throw new Error('API request failed');
      })
      .then(function (response) {
         console.log("User Promoted");
         console.log(response);
         alert('User account promoted!');
         window.location.reload();
      })
      .catch(function (error) {
         clearFields();
         console.log("Error: ", error);
         result.textContent = 'Invalid credentials or User not activated';
      });
}
