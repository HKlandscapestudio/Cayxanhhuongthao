// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PRELOADER & TEXT REVEAL ANIMATION (using GSAP)
    const tl = gsap.timeline();
    
    // Show logo in preloader
    tl.to('.loader-logo', { opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to('.progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
      .to('.preloader', { opacity: 0, duration: 0.8, delay: 0.5, onComplete: () => {
          document.querySelector('.preloader').style.display = 'none';
          document.body.classList.remove('loading');
      }})
      // Reveal Hero Text
      .to('.hero-title .word', {
          y: '0%',
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out'
      }, "-=0.5")
      // Reveal Services
      .to('.hero-services', {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
      }, "-=0.5");

    // 2. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Small delay for follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effects for cursor
    const hoverTargets = document.querySelectorAll('a, button, .magnetic, .hover-target');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorFollower.classList.add('hovering');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            cursorFollower.classList.remove('hovering');
            gsap.to(target, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); // Reset magnetic
        });
    });

    // 3. MAGNETIC EFFECT
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const strength = btn.dataset.strength || 20;
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
            
            gsap.to(btn, {
                x: x,
                y: y,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // 4. PARALLAX & 3D TILT EFFECT
    const bgWrapper = document.getElementById('bg-wrapper');
    const tiltContent = document.getElementById('tilt-content');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / windowWidth - 0.5;
        const mouseY = e.clientY / windowHeight - 0.5;

        // Background Parallax
        gsap.to(bgWrapper, {
            x: mouseX * -30,
            y: mouseY * -30,
            duration: 1,
            ease: 'power2.out'
        });

        // 3D Content Tilt
        gsap.to(tiltContent, {
            rotateY: mouseX * 10,
            rotateX: mouseY * -10,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // 5. CONTACT OVERLAY TOGGLE
    const contactToggle = document.getElementById('contact-toggle');
    const contactClose = document.getElementById('contact-close');
    const contactOverlay = document.getElementById('contact-overlay');

    contactToggle.addEventListener('click', () => {
        contactOverlay.classList.add('active');
        document.body.style.cursor = 'none'; // Ensure custom cursor stays
    });

    contactClose.addEventListener('click', () => {
        contactOverlay.classList.remove('active');
    });

    // 6. PARTICLE CANVAS (Fireflies / Dust effect)
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction
            const cursorX = parseFloat(cursor.style.left) || 0;
            const cursorY = parseFloat(cursor.style.top) || 0;
            
            const dx = cursorX - this.x;
            const dy = cursorY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
            
            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(183, 139, 69, ${this.opacity})`; // Gold particles
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

});
