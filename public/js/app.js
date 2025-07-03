// public/js/app.js

console.log('--- app.js iniciado ---'); // <-- Confirma que el archivo se está cargando

// Función para mostrar mensajes de éxito o error en la interfaz de usuario
function displayMessage(divElement, message, type) {
    if (!divElement) {
        console.warn('Elemento de mensaje no encontrado:', divElement);
        return;
    }
    divElement.textContent = message;
    divElement.className = `message ${type}`; // Asigna clases CSS para estilo (ej. .success, .error)
    divElement.style.display = 'block'; // Asegura que el mensaje sea visible

    setTimeout(() => {
        divElement.style.display = 'none';
        divElement.textContent = '';
        divElement.className = 'message'; // Limpia las clases
    }, 5000); // El mensaje desaparece después de 5 segundos
}

// Función para el registro de usuarios
async function registerUser() {
    const usernameInput = document.getElementById('reg-username'); 
    const passwordInput = document.getElementById('reg-password'); 
    const registerMessageDiv = document.getElementById('registerMessage');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            displayMessage(registerMessageDiv, data.message, 'success');
            usernameInput.value = '';
            passwordInput.value = '';
        } else {
            displayMessage(registerMessageDiv, data.message, 'error');
        }
    } catch (error) {
        console.error('Error de red al registrar:', error);
        displayMessage(registerMessageDiv, 'No se pudo conectar con el servidor. Inténtalo de nuevo.', 'error');
    }
}

// Función para el inicio de sesión de usuarios
async function loginUser() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const loginMessageDiv = document.getElementById('loginMessage');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('authToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('loggedInUser', data.user.username);
            displayMessage(loginMessageDiv, data.message, 'success');
            setTimeout(() => {
                window.location.href = `welcome.html?user=${encodeURIComponent(data.user.username)}`;
            }, 1000);
        } else {
            displayMessage(loginMessageDiv, data.message, 'error');
        }
    } catch (error) {
        console.error('Error de red al iniciar sesión:', error);
        displayMessage(loginMessageDiv, 'No se pudo conectar con el servidor. Inténtalo de nuevo.', 'error');
    }
}

// Función para cerrar la sesión
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Función para cambiar la contraseña
async function changePassword() {
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const passwordMessageDiv = document.getElementById('passwordMessage');

    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const token = localStorage.getItem('authToken');

    if (!oldPassword || !newPassword) {
        displayMessage(passwordMessageDiv, 'Por favor, completa ambos campos de contraseña.', 'error');
        return;
    }

    try {
        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        const data = await res.json();
        if (res.ok) {
            displayMessage(passwordMessageDiv, data.message, 'success');
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
        } else {
            displayMessage(passwordMessageDiv, data.message, 'error');
        }
    } catch (error) {
        console.error('Error de red al cambiar contraseña:', error);
        displayMessage(passwordMessageDiv, 'No se pudo conectar con el servidor. Inténtalo de nuevo.', 'error');
    }
}

// Función para la recuperación (insegura) de contraseña (solo para demo)
async function retrievePassword() {
    const usernameInput = document.getElementById('forgot-username');
    const retrievePasswordMessageDiv = document.getElementById('retrievePasswordMessage');

    const username = usernameInput.value;

    if (!username) {
        displayMessage(retrievePasswordMessageDiv, 'Por favor, ingresa tu nombre de usuario.', 'error');
        return;
    }

    try {
        const res = await fetch(`/api/auth/retrieve-password?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        if (res.ok) {
            displayMessage(retrievePasswordMessageDiv, `${data.message} Contraseña simulada para demo: ${data.password}`, 'success');
        } else {
            displayMessage(retrievePasswordMessageDiv, data.message, 'error');
        }
    } catch (error) {
        console.error('Error de red al recuperar contraseña:', error);
        displayMessage(retrievePasswordMessageDiv, 'No se pudo conectar con el servidor. Inténtalo de nuevo.', 'error');
    }
}

// Cuando el DOM esté completamente cargado, adjuntamos los event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('--- DOMContentLoaded en app.js ---'); // <-- Confirma que el DOMContentLoaded se dispara

    // Para el formulario de registro
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita el envío por defecto del formulario
            registerUser();
        });
    } else {
        console.warn('Formulario de registro (ID: registration-form) no encontrado.');
    }

    // Para el formulario de inicio de sesión
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita el envío por defecto del formulario
            loginUser();
        });
    } else {
        console.warn('Formulario de inicio de sesión (ID: login-form) no encontrado.');
    }

    // Para el botón de recuperar contraseña (en forgot-password.html)
    const retrievePasswordButton = document.getElementById('retrieve-password-button');
    if (retrievePasswordButton) {
        retrievePasswordButton.addEventListener('click', retrievePassword);
    } else {
        console.warn('Botón de recuperar contraseña (ID: retrieve-password-button) no encontrado.');
    }

    // Para el botón de cerrar sesión (en welcome.html)
    const logoutButton = document.querySelector('.logout-button'); // Asumiendo que ahora es una clase en welcome.html
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.warn('Botón de cerrar sesión (clase: logout-button) no encontrado.');
    }
    
    // Para el botón de actualizar contraseña (en welcome.html)
    const changePasswordButton = document.querySelector('#change-password-section button'); // Selector más específico
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', changePassword);
    } else {
        console.warn('Botón de cambiar contraseña no encontrado en welcome.html.');
    }
});