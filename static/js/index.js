window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Lightweight CSS scroll-snap carousel (one slide at a time, fully responsive).
// Replaces bulma-carousel for the results section, which mismeasured slide widths
// and crashed at narrow widths via its default breakpoints.
function initScrollCarousels() {
    document.querySelectorAll('.rc').forEach(function (rc) {
        var track = rc.querySelector('.rc-track');
        var slides = rc.querySelectorAll('.rc-slide');
        var dotsBox = rc.querySelector('.rc-dots');
        var prev = rc.querySelector('.rc-prev');
        var next = rc.querySelector('.rc-next');
        if (!track || slides.length === 0) return;

        var dots = [];
        slides.forEach(function (_, i) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'rc-dot' + (i === 0 ? ' is-active' : '');
            d.setAttribute('aria-label', 'Go to result ' + (i + 1));
            d.addEventListener('click', function () { goTo(i); });
            if (dotsBox) { dotsBox.appendChild(d); }
            dots.push(d);
        });

        function current() { return Math.round(track.scrollLeft / track.clientWidth); }
        function goTo(i) {
            var n = slides.length;
            i = (i + n) % n;
            track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
        }

        if (prev) { prev.addEventListener('click', function () { goTo(current() - 1); }); }
        if (next) { next.addEventListener('click', function () { goTo(current() + 1); }); }

        var raf = null;
        track.addEventListener('scroll', function () {
            if (raf) { return; }
            raf = requestAnimationFrame(function () {
                raf = null;
                var c = current();
                dots.forEach(function (d, i) { d.classList.toggle('is-active', i === c); });
            });
        });

        // Autoplay that pauses on hover / focus / touch.
        var timer = null;
        function play() { stop(); timer = setInterval(function () { goTo(current() + 1); }, 5000); }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        rc.addEventListener('mouseenter', stop);
        rc.addEventListener('mouseleave', play);
        rc.addEventListener('focusin', stop);
        rc.addEventListener('touchstart', stop, { passive: true });
        play();
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize any remaining bulma carousels (none on the results section anymore)
    var carousels = bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// Results carousel runs independently of jQuery so it works even if the CDN is slow.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollCarousels);
} else {
    initScrollCarousels();
}
