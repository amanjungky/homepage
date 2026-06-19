document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Theme Switcher (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Set default theme check (prefer dark, but check localStorage)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      // Switch to Light
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to Dark
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ==========================================================================
     2. Scroll Effects (Header Glassmorphism)
     ========================================================================== */
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once initially

  /* ==========================================================================
     3. Scroll Reveal Animation (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits viewport
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     4. Navigation Highlight on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let scrollPos = window.scrollY + 200; // Offset for better accuracy

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const currentId = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  /* ==========================================================================
     5. Interactive Audio Players Simulation
     ========================================================================== */
  const voiceCards = document.querySelectorAll('.voice-card');
  let currentPlayingAudio = null;
  let currentPlayingCard = null;

  voiceCards.forEach(card => {
    const playBtn = card.querySelector('.audio-play-btn');
    const playIcon = playBtn.querySelector('i');
    const audioId = `audio-${card.getAttribute('data-audio')}`;
    const audioElement = document.getElementById(audioId);
    const badge = card.querySelector('.audio-status-badge');

    playBtn.addEventListener('click', () => {
      // If clicking the currently playing audio
      if (currentPlayingAudio === audioElement) {
        if (!audioElement.paused) {
          audioElement.pause();
          playIcon.className = 'fa-solid fa-play';
          card.classList.remove('playing');
          badge.textContent = 'PAUSED';
        } else {
          audioElement.play();
          playIcon.className = 'fa-solid fa-pause';
          card.classList.add('playing');
          badge.textContent = 'PLAYING';
        }
        return;
      }

      // If another audio was playing, stop it first
      if (currentPlayingAudio) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
        currentPlayingCard.classList.remove('playing');
        currentPlayingCard.querySelector('.audio-play-btn i').className = 'fa-solid fa-play';
        currentPlayingCard.querySelector('.audio-status-badge').textContent = 'READY';
      }

      // Play new audio
      audioElement.play().then(() => {
        playIcon.className = 'fa-solid fa-pause';
        card.classList.add('playing');
        badge.textContent = 'PLAYING';
        currentPlayingAudio = audioElement;
        currentPlayingCard = card;
      }).catch(err => {
        console.log("Audio play failed or interrupted: ", err);
      });
    });

    // Reset when audio finishes
    audioElement.addEventListener('ended', () => {
      playIcon.className = 'fa-solid fa-play';
      card.classList.remove('playing');
      badge.textContent = 'COMPLETED';
      currentPlayingAudio = null;
      currentPlayingCard = null;
      
      // Revert status to ready after a short delay
      setTimeout(() => {
        if (!card.classList.contains('playing')) {
          badge.textContent = 'READY';
        }
      }, 3000);
    });
  });

  /* ==========================================================================
     6. Contact Form Submission
     ========================================================================== */
  const proposalForm = document.getElementById('proposal-form');
  const successMessage = document.getElementById('form-success-message');

  if (proposalForm) {
    proposalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate API calling delay
      const submitBtn = proposalForm.querySelector('button[type="submit"]');
      submitBtn.textContent = '전송 중...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Hide form and show success message
        proposalForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Reset button and form after some time (allowing resubmission if they want)
        setTimeout(() => {
          proposalForm.reset();
          proposalForm.classList.remove('hidden');
          successMessage.classList.add('hidden');
          submitBtn.textContent = '문의 전송하기';
          submitBtn.disabled = false;
        }, 6000);
      }, 1500);
    });
  }
});
