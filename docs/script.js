// Slider functionality for hitos
document.addEventListener('DOMContentLoaded', function() {
    // Sliders
    initSliders();
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    // Fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in');
    function checkFade() {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 150 && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
    window.addEventListener('load', checkFade);
    checkFade();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                const headerHeight = header.offsetHeight;
                const position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // Mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('nav');
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll', nav.classList.contains('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Touch events for sliders on mobile devices
    initTouchEvents();
});

// Timeline navigation function
function scrollToTimelineItem(index) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems[index]) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const position = timelineItems[index].getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: position, behavior: 'smooth' });
    }
}

// Initialize all sliders
function initSliders() {
    // Hitos slider
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideInterval();
        });
    });
    
    function startSlideInterval() {
        slideInterval = setInterval(() => {
            showSlide((currentSlide + 1) % dots.length);
        }, 5000);
    }
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    startSlideInterval();
    
    // Gallery slider
    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    let currentGallerySlide = 0;
    let galleryInterval;
    
    function showGallerySlide(index) {
        gallerySlider.style.transform = `translateX(-${index * 100}%)`;
        galleryDots.forEach(dot => dot.classList.remove('active'));
        galleryDots[index].classList.add('active');
        currentGallerySlide = index;
    }
    
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showGallerySlide(index);
            resetGalleryInterval();
        });
    });
    
    function startGalleryInterval() {
        galleryInterval = setInterval(() => {
            showGallerySlide((currentGallerySlide + 1) % galleryDots.length);
        }, 4000);
    }
    
    function resetGalleryInterval() {
        clearInterval(galleryInterval);
        startGalleryInterval();
    }
    
    startGalleryInterval();
}

// Initialize touch events for mobile devices
function initTouchEvents() {
    // Touch events for hitos slider
    const sliderContainer = document.querySelector('.slider-container');
    let startX, moveX, currentTranslate = 0;
    let isDragging = false;
    
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', touchStart);
        sliderContainer.addEventListener('touchmove', touchMove);
        sliderContainer.addEventListener('touchend', touchEnd);
        
        // Also add mouse events for desktop with touch capability
        sliderContainer.addEventListener('mousedown', touchStart);
        sliderContainer.addEventListener('mousemove', touchMove);
        sliderContainer.addEventListener('mouseup', touchEnd);
        sliderContainer.addEventListener('mouseleave', touchEnd);
    }
    
    function touchStart(e) {
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        sliderContainer.style.cursor = 'grabbing';
        clearAllIntervals();
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        moveX = currentX - startX;
    }
    
    function touchEnd() {
        isDragging = false;
        sliderContainer.style.cursor = 'grab';
        
        if (moveX < -50) {
            // Swipe left - next slide
            const slides = document.querySelectorAll('.slide');
            const currentIndex = parseInt(getComputedStyle(slider).transform.split(',')[4] / -100);
            showSlide((currentIndex + 1) % slides.length);
        } else if (moveX > 50) {
            // Swipe right - previous slide
            const slides = document.querySelectorAll('.slide');
            const currentIndex = parseInt(getComputedStyle(slider).transform.split(',')[4] / -100);
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        }
        
        startX = 0;
        moveX = 0;
        resetAllIntervals();
    }
    
    // Touch events for gallery slider
    const galleryContainer = document.querySelector('.gallery-container');
    let galleryStartX, galleryMoveX;
    let isGalleryDragging = false;
    
    if (galleryContainer) {
        galleryContainer.addEventListener('touchstart', galleryTouchStart);
        galleryContainer.addEventListener('touchmove', galleryTouchMove);
        galleryContainer.addEventListener('touchend', galleryTouchEnd);
        
        // Also add mouse events for desktop with touch capability
        galleryContainer.addEventListener('mousedown', galleryTouchStart);
        galleryContainer.addEventListener('mousemove', galleryTouchMove);
        galleryContainer.addEventListener('mouseup', galleryTouchEnd);
        galleryContainer.addEventListener('mouseleave', galleryTouchEnd);
    }
    
    function galleryTouchStart(e) {
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        isGalleryDragging = true;
        galleryStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        galleryContainer.style.cursor = 'grabbing';
        clearAllIntervals();
    }
    
    function galleryTouchMove(e) {
        if (!isGalleryDragging) return;
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        galleryMoveX = currentX - galleryStartX;
    }
    
    function galleryTouchEnd() {
        isGalleryDragging = false;
        galleryContainer.style.cursor = 'grab';
        
        if (galleryMoveX < -50) {
            // Swipe left - next slide
            const slides = document.querySelectorAll('.gallery-slide');
            const currentIndex = parseInt(getComputedStyle(gallerySlider).transform.split(',')[4] / -100);
            showGallerySlide((currentIndex + 1) % slides.length);
        } else if (galleryMoveX > 50) {
            // Swipe right - previous slide
            const slides = document.querySelectorAll('.gallery-slide');
            const currentIndex = parseInt(getComputedStyle(gallerySlider).transform.split(',')[4] / -100);
            showGallerySlide((currentIndex - 1 + slides.length) % slides.length);
        }
        
        galleryStartX = 0;
        galleryMoveX = 0;
        resetAllIntervals();
    }
}

// Clear all intervals
function clearAllIntervals() {
    const intervalId = window.setInterval(function(){}, 1000);
    while (intervalId >= 0) {
        window.clearInterval(intervalId);
        intervalId--;
    }
}

// Reset all intervals
function resetAllIntervals() {
    // This would need to be implemented based on your specific interval setup
    // For simplicity, we'll just reload the page intervals
    setTimeout(() => {
        initSliders();
    }, 3000);
}

// Prevent zoom on double tap (iOS specific)
let lastTap = 0;
document.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
    }
    lastTap = currentTime;
}, false);

// Handle device orientation changes
window.addEventListener('orientationchange', function() {
    // Timeout needed to allow the orientation to change
    setTimeout(function() {
        // Refresh the fade-in elements check
        const fadeElements = document.querySelectorAll('.fade-in');
        function checkFade() {
            fadeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 150 && rect.bottom > 0) {
                    el.classList.add('visible');
                }
            });
        }
        checkFade();
    }, 200);
});

// Optimize for low-performance devices
if ('connection' in navigator && navigator.connection.saveData === true) {
    // Reduce animation complexity for users with save-data enabled
    document.documentElement.classList.add('save-data');
}

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
}