// ========================================
// IMMEDIATE INITIALIZATION
// ========================================

// Show body after styles are loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ========================================
// CUSTOM CURSOR
// ========================================

const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Check if device has mouse
const hasMouse = matchMedia('(hover: hover)').matches;

if (hasMouse) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, input, .brick-visual, .metric, .result');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('expand');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('expand');
        });
    });
} else {
    cursor.style.display = 'none';
}

// ========================================
// 3D BRICK INTERACTION
// ========================================

const brickVisual = document.getElementById('brickVisual');

if (brickVisual) {
    let mouseXBrick = 0;
    let mouseYBrick = 0;
    let currentXBrick = 0;
    let currentYBrick = 0;
    let isHovering = false;
    
    brickVisual.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    brickVisual.addEventListener('mouseleave', () => {
        isHovering = false;
    });
    
    brickVisual.addEventListener('mousemove', (e) => {
        const rect = brickVisual.getBoundingClientRect();
        mouseXBrick = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseYBrick = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    function animateBrick() {
        if (isHovering) {
            currentXBrick += (mouseXBrick - currentXBrick) * 0.1;
            currentYBrick += (mouseYBrick - currentYBrick) * 0.1;
            
            const rotateY = currentXBrick * 30;
            const rotateX = -currentYBrick * 30;
            
            brickVisual.style.transform = `rotateX(${25 + rotateX}deg) rotateY(${-25 + rotateY}deg) scale(1.1)`;
        }
        
        requestAnimationFrame(animateBrick);
    }
    animateBrick();
}

// ========================================
// CALCULATOR FUNCTIONALITY
// ========================================

const BRICK_PRICE = 78400;
const MONTHLY_RENT_PER_BRICK = 817;
const ANNUAL_ROI = 0.125;
const FUTURE_MULTIPLIER = 1.43; // Growth to 2027

const brickSlider = document.getElementById('brickSlider');
const sliderTrack = document.getElementById('sliderTrack');
const brickCount = document.getElementById('brickCount');
const totalAmount = document.getElementById('totalAmount');
const monthlyRent = document.getElementById('monthlyRent');
const annualReturn = document.getElementById('annualReturn');
const roiPercentage = document.getElementById('roiPercentage');
const futureValue = document.getElementById('futureValue');

function updateCalculator() {
    const bricks = parseInt(brickSlider.value);
    const total = bricks * BRICK_PRICE;
    const monthly = bricks * MONTHLY_RENT_PER_BRICK;
    const annual = monthly * 12;
    const future = total * FUTURE_MULTIPLIER;
    
    // Update display
    brickCount.textContent = bricks;
    totalAmount.textContent = formatNumber(total);
    monthlyRent.textContent = 'COP ' + formatNumber(monthly);
    annualReturn.textContent = 'COP ' + formatNumber(annual);
    roiPercentage.textContent = '12.5%';
    futureValue.textContent = 'COP ' + formatNumber(Math.round(future));
    
    // Update slider track
    const percentage = ((bricks - 1) / (500 - 1)) * 100;
    sliderTrack.style.width = percentage + '%';
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

if (brickSlider) {
    brickSlider.addEventListener('input', updateCalculator);
    updateCalculator();
}

// ======================================== 
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate numbers
            if (entry.target.classList.contains('metric')) {
                animateValue(entry.target.querySelector('.metric-value'));
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-in, .metric, .timeline-item').forEach(el => {
    observer.observe(el);
});

// ========================================
// NUMBER ANIMATION
// ========================================

function animateValue(element) {
    if (!element || element.animated) return;
    element.animated = true;
    
    const text = element.textContent;
    const hasLetter = /[A-Za-z]/.test(text);
    
    if (hasLetter) {
        // Extract number and suffix
        const matches = text.match(/(\d+\.?\d*)([A-Za-z%]+)?/);
        if (!matches) return;
        
        const targetValue = parseFloat(matches[1]);
        const suffix = matches[2] || '';
        let currentValue = 0;
        const increment = targetValue / 50;
        const isPercentage = suffix === '%';
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (isPercentage) {
                element.textContent = currentValue.toFixed(1) + suffix;
            } else {
                element.textContent = Math.round(currentValue) + suffix;
            }
        }, 20);
    }
}

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================

let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Hide/show on scroll (desktop only)
    if (window.innerWidth > 768) {
        if (window.scrollY > lastScrollY && window.scrollY > 500) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollY = window.scrollY;
});

// ========================================
// INITIALIZE ON LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to hero elements
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Start brick animation
    const brick = document.querySelector('.brick-visual');
    if (brick) {
        setTimeout(() => {
            brick.style.opacity = '1';
        }, 800);
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for animations
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply optimizations
window.addEventListener('resize', debounce(() => {
    // Handle resize events
    updateCalculator();
}, 250));

// ========================================
// TIMELINE ANIMATIONS
// ========================================

function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.getElementById('timelineProgress');
    
    if (!timelineItems.length) return;
    
    // Calculate progress based on current date
    const currentDate = new Date('2025-08-21'); // Current project date
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2027-09-30');
    
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    const progressPercentage = (elapsed / totalDuration) * 100;
    
    // Animate timeline items on scroll
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
        
        // Animate progress line
        if (timelineProgress && entries.some(e => e.isIntersecting)) {
            setTimeout(() => {
                timelineProgress.style.height = progressPercentage + '%';
            }, 500);
        }
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// ========================================
// DASHBOARD ANIMATIONS
// ========================================

function initDashboard() {
    const progressBar = document.getElementById('progressBar');
    const metricCards = document.querySelectorAll('.metric-card');
    
    const dashboardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bar
                if (progressBar && !progressBar.classList.contains('animate')) {
                    progressBar.classList.add('animate');
                }
                
                // Animate numbers
                const amounts = entry.target.querySelectorAll('.amount[data-value]');
                amounts.forEach(amount => {
                    if (!amount.animated) {
                        animateCountUp(amount);
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    metricCards.forEach(card => {
        dashboardObserver.observe(card);
    });
}

// ========================================
// COUNT UP ANIMATION
// ========================================

function animateCountUp(element) {
    if (element.animated) return;
    element.animated = true;
    
    const target = parseInt(element.getAttribute('data-value'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = formatNumber(Math.round(current));
    }, 16);
}

// ========================================
// LIVE DATA SIMULATION
// ========================================

function simulateLiveData() {
    const liveIndicator = document.querySelector('.live-indicator span:last-child');
    const updateIntervals = [5, 3, 8, 2, 6];
    let intervalIndex = 0;
    
    setInterval(() => {
        if (liveIndicator) {
            const minutes = updateIntervals[intervalIndex % updateIntervals.length];
            liveIndicator.textContent = `ACTUALIZADO HACE ${minutes} MIN`;
            intervalIndex++;
        }
        
        // Randomly update some metrics
        if (Math.random() > 0.7) {
            const bricksSold = document.querySelector('[data-value="17152"]');
            if (bricksSold && bricksSold.animated) {
                const currentValue = parseInt(bricksSold.textContent.replace(/,/g, ''));
                const newValue = currentValue + Math.floor(Math.random() * 5) + 1;
                bricksSold.setAttribute('data-value', newValue);
                bricksSold.textContent = formatNumber(newValue);
                
                // Flash animation
                bricksSold.style.color = 'var(--accent-primary)';
                setTimeout(() => {
                    bricksSold.style.color = '';
                }, 500);
            }
        }
    }, 5000);
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.brick-container, .timeline-header, .dashboard-header');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                element.style.transform = `translateY(${yPos * 0.3}px)`;
            }
        });
    }, 10));
}

// ========================================
// HOVER EFFECTS FOR METRIC CARDS
// ========================================

function initCardHovers() {
    const cards = document.querySelectorAll('.metric-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--accent-primary-alpha), var(--bg-secondary))`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--accent-primary-alpha), var(--bg-secondary))`;
        });
    });
}

// ========================================
// SMOOTH SCROLL TO SECTIONS
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 100;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// INITIALIZE ALL ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to hero elements
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Start brick animation
    const brick = document.querySelector('.brick-visual');
    if (brick) {
        setTimeout(() => {
            brick.style.opacity = '1';
        }, 800);
    }
    
    // Initialize all modules
    initTimeline();
    initDashboard();
    simulateLiveData();
    initParallax();
    initCardHovers();
    initSmoothScroll();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
    
    // Initialize FAQ interactions
    initFAQ();
    
    // Initialize benefit card animations
    initBenefitCards();
    
    // Initialize charts
    initCharts();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('¡Bienvenido!', 'Pre-venta exclusiva activa. Precio especial por tiempo limitado.', 'success');
    }, 2000);
});

// ========================================
// CHARTS FUNCTIONALITY
// ========================================

function initCharts() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const chartContainers = document.querySelectorAll('.chart-container');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and containers
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            chartContainers.forEach(container => container.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding chart
            const chartType = this.getAttribute('data-chart');
            const targetChart = document.getElementById(`${chartType}-chart`);
            if (targetChart) {
                targetChart.classList.add('active');
                
                // Animate chart elements
                animateChart(chartType);
            }
        });
    });
    
    // Add hover tooltips to data points
    document.querySelectorAll('.data-point').forEach(point => {
        point.addEventListener('mouseenter', function(e) {
            const tooltip = document.getElementById('tooltip');
            const rect = this.getBoundingClientRect();
            
            tooltip.textContent = 'COP 78,400 · Agosto 2025';
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 40 + 'px';
            tooltip.classList.add('active');
        });
        
        point.addEventListener('mouseleave', function() {
            document.getElementById('tooltip').classList.remove('active');
        });
    });
}

function animateChart(type) {
    if (type === 'marketcap') {
        // Animate bars growing
        const bars = document.querySelectorAll('.mc-bars rect');
        bars.forEach((bar, index) => {
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            setTimeout(() => {
                bar.style.transition = 'transform 0.5s ease';
                bar.style.transform = 'scaleY(1)';
            }, index * 100);
        });
    } else if (type === 'roi') {
        // Animate ROI curve
        const path = document.querySelector('.roi-svg path:last-child');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = 'drawPath 2s ease forwards';
        }
    }
}

// Add CSS animation for path drawing
const style = document.createElement('style');
style.textContent = `
    @keyframes drawPath {
        to {
            stroke-dashoffset: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('exit');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.classList.add('exit');
        setTimeout(() => {
            this.remove();
        }, 500);
    });
}

// ========================================
// MODAL SYSTEM
// ========================================

function showModal(title = 'Información del Proyecto', content = null) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (title) modalTitle.textContent = title;
    if (content) modalContent.innerHTML = content;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on background click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// LOADING SYSTEM
// ========================================

function showLoader() {
    document.getElementById('spinnerOverlay').classList.add('active');
}

function hideLoader() {
    document.getElementById('spinnerOverlay').classList.remove('active');
}

// ========================================
// ENHANCED PURCHASE FUNCTION
// ========================================

async function purchaseBricks() {
    const bricks = document.getElementById('brickSlider').value;
    const total = bricks * BRICK_PRICE;
    
    const modalContent = `
        <h4 style="color: var(--text-primary); margin-bottom: 20px;">Confirmar Compra</h4>
        <div style="background: var(--bg-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: var(--text-secondary);">Cantidad de BRICKS:</span>
                <span style="color: var(--text-primary); font-weight: 500;">${bricks}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: var(--text-secondary);">Precio por BRICK:</span>
                <span style="color: var(--text-primary);">COP ${formatNumber(BRICK_PRICE)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                <span style="color: var(--text-secondary); font-weight: 500;">Total a pagar:</span>
                <span style="color: var(--accent-primary); font-size: 18px; font-weight: 500;">COP ${formatNumber(total)}</span>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            <button onclick="processPurchase(${bricks})" style="flex: 1; padding: 12px; background: var(--gradient-primary); border: 1px solid var(--accent-primary); color: var(--text-primary); border-radius: 4px; cursor: pointer;">
                Proceder al Pago
            </button>
            <button onclick="closeModal()" style="flex: 1; padding: 12px; background: transparent; border: 1px solid var(--border-default); color: var(--text-secondary); border-radius: 4px; cursor: pointer;">
                Cancelar
            </button>
        </div>
    `;
    
    showModal('Confirmar Compra', modalContent);
}

async function processPurchase(bricks) {
    closeModal();
    showLoader();
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    hideLoader();
    showNotification(
        '¡Compra Exitosa!',
        `Has adquirido ${bricks} BRICK(s). Recibirás un email con los detalles.`,
        'success'
    );
    
    // Reset slider
    document.getElementById('brickSlider').value = 1;
    updateCalculator();
}

// ========================================
// SELL PROCESS ENHANCED
// ========================================

function sellProcess() {
    const modalContent = `
        <h4 style="color: var(--text-primary); margin-bottom: 20px;">Marketplace</h4>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
            El marketplace permite vender tus BRICKS a otros inversores.
        </p>
        <div style="background: var(--accent-primary-alpha); border: 1px solid var(--accent-primary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: var(--text-primary); font-size: 13px;">
                <strong>Próximamente disponible</strong><br>
                Lanzamiento previsto: Junio 2026
            </p>
        </div>
        <p style="color: var(--text-tertiary); font-size: 12px;">
            Recibirás una notificación cuando el marketplace esté activo.
        </p>
    `;
    
    showModal('Vender BRICKS', modalContent);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K: Focus calculator
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

function logPerformance() {
    if (window.performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time is above 3 seconds');
        }
    }
}

window.addEventListener('load', logPerformance);

// ========================================
// FAQ INTERACTIONS
// ========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            // Toggle expanded state with minimal visual change
            const isExpanded = this.style.borderLeftColor === 'var(--accent-primary)';
            
            if (isExpanded) {
                this.style.borderLeftColor = 'transparent';
                this.style.transform = 'translateX(0)';
                this.style.background = 'transparent';
            } else {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.style.borderLeftColor = 'transparent';
                    otherItem.style.transform = 'translateX(0)';
                    otherItem.style.background = 'transparent';
                });
                
                // Expand this item with subtle effect
                this.style.borderLeftColor = 'var(--accent-primary)';
                this.style.transform = 'translateX(4px)';
                this.style.background = 'var(--bg-elevated)';
            }
        });
        
        // More subtle hover effect
        item.addEventListener('mouseenter', function() {
            if (this.style.borderLeftColor !== 'var(--accent-primary)') {
                this.style.transform = 'translateX(2px)';
                this.style.opacity = '0.95';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (this.style.borderLeftColor !== 'var(--accent-primary)') {
                this.style.transform = 'translateX(0)';
                this.style.opacity = '1';
            }
        });
    });
    
    // Mobile specific: Remove hover effects on touch devices
    if ('ontouchstart' in window) {
        faqItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 100);
            });
        });
    }
}

// ========================================
// BENEFIT CARDS ANIMATIONS
// ========================================

function initBenefitCards() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                    }, index * 100);
                    
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        cardObserver.observe(card);
        
        // Minimal hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.background = 'var(--bg-elevated)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.background = 'transparent';
        });
        
        // Mobile touch feedback
        if ('ontouchstart' in window) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
}

// ========================================
// PARTNER LOGOS HOVER
// ========================================

document.querySelectorAll('[style*="opacity: 0.5"]').forEach(partner => {
    partner.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'all var(--transition-base)';
    });
    
    partner.addEventListener('mouseleave', function() {
        this.style.opacity = '0.5';
        this.style.transform = 'scale(1)';
    });
});

// ========================================
// VISIBILITY CHANGE HANDLER
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.querySelectorAll('[data-animating]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('[data-animating]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

