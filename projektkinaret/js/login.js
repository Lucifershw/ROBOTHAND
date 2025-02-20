        // JavaScript for modal switching
        document.addEventListener('DOMContentLoaded', function() {
            var signUpLink = document.getElementById('openSignupModal');
            var loginLink = document.getElementById('openLoginModal');

            // Switch from Login Modal to Signup Modal
            signUpLink.addEventListener('click', function() {
                var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginmodal'));
                var signupModal = new bootstrap.Modal(document.getElementById('signupmodal'));

                loginModal.hide(); // Hide login modal
                signupModal.show(); // Show signup modal
            });

            // Switch from Signup Modal to Login Modal
            loginLink.addEventListener('click', function() {
                var signupModal = bootstrap.Modal.getInstance(document.getElementById('signupmodal'));
                var loginModal = new bootstrap.Modal(document.getElementById('loginmodal'));

                signupModal.hide(); // Hide signup modal
                loginModal.show(); // Show login modal
            });
        });