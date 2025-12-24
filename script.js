document.addEventListener("DOMContentLoaded", () => {
  const subjectFilter = document.getElementById("subject-filter");
  const levelFilter = document.getElementById("level-filter");
  const cards = document.querySelectorAll("a[data-subject][data-level]");

  function filterCards() {
    const subject = subjectFilter.value;
    const level = levelFilter.value;

    cards.forEach(card => {
      const cardSubject = card.dataset.subject;
      const cardLevel = card.dataset.level;

      const matchSubject = subject === "all" || cardSubject === subject;
      const matchLevel = level === "all" || cardLevel === level;

      if (matchSubject && matchLevel) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  subjectFilter.addEventListener("change", filterCards);
  levelFilter.addEventListener("change", filterCards);

  // Appel initial
  filterCards();
});

// Initialize form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form[needs-validation]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add validation styles to invalid fields
                const invalidFields = this.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.classList.add('input-error');
                    
                    // Add error message if not exists
                    let errorMessage = field.parentElement.querySelector('.error-message');
                    if (!errorMessage) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = field.validationMessage;
                        field.parentElement.appendChild(errorMessage);
                    }
                });
            }
            
            this.classList.add('was-validated');
        });
        
        // Remove error styles on input
        form.addEventListener('input', function(e) {
            if (e.target.classList.contains('input-error')) {
                e.target.classList.remove('input-error');
                
                // Remove error message
                const errorMessage = e.target.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
}

// Show notification/toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg ${
        type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
        type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
        'bg-blue-50 border border-blue-200 text-blue-800'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="${type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'}"></i>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Replace feather icon
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Feedback Page Specific Functionality
function initFeedbackPage() {
    // Initialize star rating
    const ratingContainer = document.getElementById('ratingStars');
    if (ratingContainer) {
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.dataset.feather = 'star';
            star.className = 'star-rating w-8 h-8 text-gray-300';
            star.dataset.value = i;
            
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                document.getElementById('rating').value = value;
                
                // Update all stars
                ratingContainer.querySelectorAll('.star-rating').forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('active');
                        s.style.color = '#fbbf24';
                    } else {
                        s.classList.remove('active');
                        s.style.color = '#d1d5db';
                    }
                });
                
                feather.replace();
            });
            
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.dataset.value);
                ratingContainer.querySelectorAll('.star-rating').forEach((s, index) => {
                    if (index < value) {
                        s.style.color = '#fbbf24';
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = parseInt(document.getElementById('rating').value);
                ratingContainer.querySelectorAll('.star-rating').forEach((s, index) => {
                    if (index >= currentRating) {
                        s.style.color = '#d1d5db';
                    }
                });
            });
            
            ratingContainer.appendChild(star);
        }
        
        feather.replace();
    }
    
    // Character counter for feedback message
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = `${length} characters`;
            
            if (length < 50) {
                charCount.classList.add('text-red-500');
                charCount.classList.remove('text-green-500');
            } else {
                charCount.classList.remove('text-red-500');
                charCount.classList.add('text-green-500');
            }
        });
    }
    
    // Form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                category: document.getElementById('category').value,
                rating: document.getElementById('rating').value,
                message: document.getElementById('message').value,
                consent: document.getElementById('consent').checked
            };
            
            // Validate minimum characters
            if (formData.message.length < 50) {
                showNotification('Please write at least 50 characters in your feedback message.', 'error');
                return;
            }
            
            // Validate rating
            if (formData.rating === '0') {
                showNotification('Please provide a rating by clicking the stars.', 'error');
                return;
            }
            
            // Simulate API call
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner w-6 h-6 border-2"></div>';
            submitBtn.disabled = true;
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Thank you! Your feedback has been submitted successfully.', 'success');
            
            // Reset form
            this.reset();
            document.getElementById('rating').value = '0';
            ratingContainer.querySelectorAll('.star-rating').forEach(star => {
                star.classList.remove('active');
                star.style.color = '#d1d5db';
            });
            if (charCount) charCount.textContent = '0 characters';
            
            // Update stats
            updateFeedbackStats();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Replace feather icons
            feather.replace();
        });
    }
    
    // Load recent feedback (mock data)
    loadRecentFeedback();
    
    // Initialize stats
    updateFeedbackStats();
}

// Load recent feedback
async function loadRecentFeedback() {
    const container = document.getElementById('recentFeedback');
    if (!container) return;
    
    // Mock data - In a real app, this would come from an API
    const mockFeedback = [
        { name: 'Alex Johnson', rating: 5, comment: 'Absolutely love the new interface! So intuitive and beautiful.', time: '2 hours ago' },
        { name: 'Sam Davis', rating: 4, comment: 'Great features, but would love to see dark mode option.', time: '1 day ago' },
        { name: 'Taylor Smith', rating: 5, comment: 'Customer support team was incredibly helpful and responsive.', time: '3 days ago' }
    ];
    
    container.innerHTML = mockFeedback.map(feedback => `
        <div class="bg-gray-50 rounded-xl p-4 hover-card">
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-100 to-violet-200 flex items-center justify-center">
                        <i data-feather="user" class="w-4 h-4 text-violet-600"></i>
                    </div>
                    <span class="font-medium text-gray-900">${feedback.name}</span>
                </div>
                <div class="flex">
                    ${Array.from({length: 5}).map((_, i) => `
                        <i data-feather="star" class="w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}"></i>
                    `).join('')}
                </div>
            </div>
            <p class="text-gray-600 text-sm mb-2">${feedback.comment}</p>
            <div class="text-xs text-gray-500">${feedback.time}</div>
        </div>
    `).join('');
    
    feather.replace();
}

// Update feedback stats
function updateFeedbackStats() {
    // Mock stats - In a real app, this would come from an API
    const totalSubmissions = Math.floor(Math.random() * 1000) + 500;
    const avgRating = (Math.random() * 1 + 4).toFixed(1);
    
    const totalEl = document.getElementById('totalSubmissions');
    const avgEl = document.getElementById('avgRating');
    
    if (totalEl) totalEl.textContent = totalSubmissions.toLocaleString();
    if (avgEl) avgEl.textContent = avgRating;
}

// Login Page Specific Functionality (will be used in login.html)
function initLoginPage() {
    // Toggle between login and signup
    const toggleForms = document.querySelectorAll('[data-toggle-form]');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (toggleForms.length && loginForm && signupForm) {
        toggleForms.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('data-toggle-form');
                
                if (target === 'signup') {
                    loginForm.classList.add('hidden');
                    signupForm.classList.remove('hidden');
                    document.querySelector('[data-form-title]').textContent = 'Create Your Account';
                } else {
                    signupForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                    document.querySelector('[data-form-title]').textContent = 'Welcome Back!';
                }
                
                // Update active state
                document.querySelectorAll('[data-toggle-form]').forEach(btn => {
                    btn.classList.toggle('text-violet-600', btn.getAttribute('data-toggle-form') === target);
                    btn.classList.toggle('text-gray-500', btn.getAttribute('data-toggle-form') !== target);
                });
            });
        });
    }
    
    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('[data-toggle-password]');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const inputId = this.getAttribute('data-toggle-password');
            const input = document.getElementById(inputId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-feather', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-feather', 'eye');
            }
            
            feather.replace();
        });
    });
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-login-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.getAttribute('data-provider');
            showNotification(`Signing in with ${provider}... (demo)`, 'info');
        });
    });
}
