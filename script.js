// Optimized JavaScript - More efficient and maintainable

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.ticking = false;
    }

    // Unified Lottie animation loader
    loadLottieAnimation(containerId, animationPath, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const config = {
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationPath,
            ...options
        };

        const animation = lottie.loadAnimation(config);
        this.animations.set(containerId, animation);
        return animation;
    }

    // Load all animations at once
    initializeAnimations() {
        const animationConfigs = [
            { id: 'lottieAnimation', path: 'assets/stress-management.json' },
            { id: 'heroLottieAnimation', path: 'assets/hero-animation-c2.json' },
            { id: 'costLottieAnimation', path: 'assets/business-vision.json' },
            { id: 'buyingGroceryLottieAnimation', path: 'assets/buying-grocery.json' },
            { id: 'getInTouchLottieAnimation', path: 'assets/get-in-touch.json' },
            { id: 'animationLottieAnimation', path: 'assets/happy-girl.json' }
        ];

        animationConfigs.forEach(config => {
            this.loadLottieAnimation(config.id, config.path);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }

    observeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => this.observer.observe(element));
    }

    destroyAnimation(containerId) {
        const animation = this.animations.get(containerId);
        if (animation) {
            animation.destroy();
            this.animations.delete(containerId);
        }
    }

    destroyAllAnimations() {
        this.animations.forEach(animation => animation.destroy());
        this.animations.clear();
    }
}

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.querySelector('.main-content');
        this.lottieContainer = document.getElementById('lottie-container');
        this.progressBar = document.getElementById('progress-bar');
        this.animation = null;
    }

    init() {
        this.addLoadingClass();
        this.initAnimation();
        this.startProgressBar();
        this.setupTimers();
        this.preventScrollDuringLoading();
    }

    addLoadingClass() {
        document.body.classList.add('loading');
        document.documentElement.classList.add('loading');
    }

    removeLoadingClass() {
        document.body.classList.remove('loading');
        document.documentElement.classList.remove('loading');
    }

    initAnimation() {
        if (!this.lottieContainer) return;

        this.animation = lottie.loadAnimation({
            container: this.lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/mountain-intro.json'
        });
    }

    startProgressBar() {
        if (!this.progressBar) return;

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 1;
            this.progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 30);
    }

    setupTimers() {
        // Pulse effect
        setTimeout(() => {
            this.lottieContainer?.classList.add('pulse');
        }, 500);

        // Zoom focus animation
        setTimeout(() => {
            this.lottieContainer?.classList.add('zoom-focus');
            this.loadingScreen?.classList.add('zoom-in');
        }, 2500);

        // Complete loading transition
        setTimeout(() => {
            this.completeLoading();
        }, 3000);
    }

    completeLoading() {
        this.lottieContainer?.classList.remove('pulse');
        this.loadingScreen?.classList.add('fade-out');
        this.mainContent?.classList.add('show');
        this.removeLoadingClass();

        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            if (this.animation) {
                this.animation.destroy();
            }
        }, 800);
    }

    preventScrollDuringLoading() {
        const preventScroll = (e) => {
            if (document.body.classList.contains('loading')) {
                e.preventDefault();
            }
        };

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('loading') && 
                [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
            }
        });

        // Wheel and touch events
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
    }
}

class UIEffects {
    constructor() {
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.setupParallax();
        this.setupMouseTracking();
    }

    setupScrollEffects() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Debounce scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleHeaderScroll();
            }, 10);
        });
    }

    handleHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    setupHoverEffects() {
        // Add ripple effect styles
        this.addRippleStyles();

        // Use event delegation for better performance
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.shape, .sphere, .visual-shape, .service-card')) {
                this.createRippleEffect(e.target);
            }
        }, true);
    }

    addRippleStyles() {
        if (document.getElementById('ripple-styles')) return;

        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleEffect {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleEffect 0.6s ease-out',
            pointerEvents: 'none'
        });

        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupParallax() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.shape, .sphere, .visual-shape');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.05 * (index + 1);
                const yPos = scrolled * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    setupMouseTracking() {
        let mouseTimeout;

        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                const shapes = document.querySelectorAll('.shape, .sphere');
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.01;
                    const x = (mouseX - 0.5) * speed * 50;
                    const y = (mouseY - 0.5) * speed * 50;
                    
                    shape.style.transform += ` translate(${x}px, ${y}px)`;
                });
            }, 16); // ~60fps
        });
    }
}

class ContactModal {
    constructor() {
        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.formWrapper = document.getElementById('form-wrapper');
        this.successAnimation = document.getElementById('success-animation');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal close events
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Form submission
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    open() {
        this.modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.submitBtn?.classList.remove('loading');
        if (this.submitBtn) this.submitBtn.textContent = 'Send Message';
        this.modal?.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        if (this.formWrapper) this.formWrapper.style.display = 'block';
        if (this.successAnimation) this.successAnimation.style.display = 'none';
        this.form?.reset();
    }

    async handleSubmit() {
        if (!this.form || !this.submitBtn) return;

        this.submitBtn.classList.add('loading');
        this.submitBtn.textContent = 'Sending...';
        
        const formData = new FormData(this.form);
        formData.append('_captcha', 'false');

        try {
            const response = await fetch('https://formsubmit.co/ajax/sudomountaindev@gmail.com', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Send Message';
        }
    }

    showSuccess() {
        if (this.formWrapper) this.formWrapper.style.display = 'none';
        if (this.successAnimation) this.successAnimation.style.display = 'block';
        
        this.createSuccessAnimation();
        
        setTimeout(() => {
            const container = document.getElementById('success-lottie-container');
            if (container) container.innerHTML = '';
            this.close();
        }, 4500);
    }

    createSuccessAnimation() {
        const container = document.getElementById('success-lottie-container');
        if (!container) return;

        lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'assets/success.json'
        });
    }
}

class ContactActions {
    constructor() {
        this.setupPhoneAction();
        this.setupEmailAction();
    }

    setupPhoneAction() {
        const callLink = document.querySelector('.call-link');
        if (!callLink) return;

        callLink.addEventListener('click', (e) => {
            const phoneNumber = '+918700119968'; // Replace with your actual phone number
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (!isMobile) {
                e.preventDefault();
                this.copyToClipboard(phoneNumber);
            }
        });
    }

    setupEmailAction() {
        const emailBtn = document.getElementById('emailBtn');
        if (!emailBtn) return;

        emailBtn.addEventListener('click', (e) => {
            const emailAddress = 'sudomountaindev@gmail.com';
            const subject = 'Contact Request';
            const body = 'Hi, I would like to get in touch with you.';
            const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = mailtoLink;
            } else {
                const emailWindow = window.open(mailtoLink, '_blank');
                setTimeout(() => {
                    if (!emailWindow || emailWindow.closed) {
                        this.copyToClipboard(emailAddress);
                    }
                }, 1000);
            }
        });
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            this.showCopiedAnimation();
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }

    showCopiedAnimation() {
        const copiedAnimation = document.getElementById('copied-animation');
        const container = document.getElementById('copied-lottie-container');
        
        if (copiedAnimation) copiedAnimation.style.display = 'block';
        
        if (container) {
            lottie.loadAnimation({
                container,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: 'assets/copy-green.json'
            });
        }

        setTimeout(() => {
            if (container) container.innerHTML = '';
            if (copiedAnimation) copiedAnimation.style.display = 'none';
        }, 3000);
    }
}

// Utility functions
const Utils = {
    scrollToNext() {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    },

    setupFooterAnimation() {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Object.assign(entry.target.style, {
                        opacity: '1',
                        transform: 'translateY(0)'
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        const footer = document.querySelector('.footer');
        if (footer) {
            Object.assign(footer.style, {
                opacity: '0',
                transform: 'translateY(50px)',
                transition: 'all 0.8s ease-out'
            });
            footerObserver.observe(footer);
        }
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const animationManager = new AnimationManager();
    const loadingScreen = new LoadingScreen();
    const uiEffects = new UIEffects();
    const contactModal = new ContactModal();
    const contactActions = new ContactActions();

    // Setup animations
    animationManager.initializeAnimations();
    
    // Setup observers for scroll animations
    const elementsToObserve = [
        '.shape, .sphere, .visual-shape',
        '.what-i-do-section, .services-section',
        '.service-card',
        '.art-direction-section',
        '.cube, .floating-sphere'
    ];
    
    elementsToObserve.forEach(selector => {
        animationManager.observeElements(selector);
    });

    // Initialize loading screen
    loadingScreen.init();

    // Setup footer animation
    Utils.setupFooterAnimation();

    // Initial animation for hero shapes
    setTimeout(() => {
        document.querySelectorAll('.hero-container .shape, .hero-container .sphere')
            .forEach(shape => shape.classList.add('animate-in'));
    }, 1000);

    // Expose modal functions globally if needed
    window.openModal = () => contactModal.open();
    window.closeModal = () => contactModal.close();
    window.scrollToNext = Utils.scrollToNext;
});