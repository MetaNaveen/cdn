document.addEventListener('DOMContentLoaded', function () {
    var isLoginFormVisible = true;
    var toggleButton = document.getElementById('toggleButton');
    var loginForm = document.getElementById('loginForm');
    var requestToRegisterForm = document.getElementById('requestToRegisterForm');
    var result = document.getElementById('result');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');

    toggleButton.textContent = "Request Login >";

    function toggleForm() {
        isLoginFormVisible = !isLoginFormVisible;
        if (isLoginFormVisible) {
            toggleButton.textContent = "Request Login >";
            loginForm.classList.add('visible');
            requestToRegisterForm.classList.remove('visible');
        } else {
            toggleButton.textContent = "< Login Page";
            loginForm.classList.remove('visible');
            requestToRegisterForm.classList.add('visible');
        }
    }

    function login() {
        var username = emailInput.value;
        var password = passwordInput.value;
        var redirectUriInput = document.querySelector('[name="redirectUri"]');
        var redirectUri = redirectUriInput.value;

        var selectedOption = document.getElementById('redirectOption').value;
        console.log('Selected option value: ' + selectedOption);
        if (selectedOption == 'userPage') redirectUri = "/user/dashboard";
        else if (selectedOption == 'adminPage') redirectUri = "/admin/dashboard";

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

    function clearFields() {
        emailInput.value = '';
        passwordInput.value = '';
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
        var email = document.getElementById('requestEmail').value;
        var fullname = document.getElementById('requestFullname').value;
        var data = {
            email: email,
            fullname: fullname
        };

        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(function () {
                clearFields();
                result.textContent = 'Request successful. You will be notified via email when approved';
            })
            .catch(function (error) {
                clearFields();
                console.log("Error: ", error);
                result.textContent = 'Invalid details or login already requested.';
            });
    }

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
