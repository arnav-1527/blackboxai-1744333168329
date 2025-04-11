/**
 * MediTrack - Login Script
 * Handles user authentication for the MediTrack system
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        try {
            // Validate form inputs
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }
            
            // Authenticate user
            if (authenticate(username, password)) {
                
                // Store user info in session storage (for demo purposes)
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('username', username);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An unexpected error occurred. Please try again.');
        }
    });
    
    // Function to display error messages
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // Add shake animation
        errorMessage.classList.add('shake');
        setTimeout(() => {
            errorMessage.classList.remove('shake');
        }, 500);
    }
    
    // Add some simple animation for the error message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
});
