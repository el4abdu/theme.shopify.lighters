// Main theme JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Initialize global theme elements
  initTheme();
  
  // Initialize specific sections if they exist
  if (document.querySelector('.maintenance-guide')) {
    initMaintenanceGuide();
  }
  
  if (document.querySelector('.faq-section')) {
    initFAQ();
  }
  
  if (document.querySelector('.maintenance-related-products')) {
    initMaintenanceProducts();
  }
});

// Theme initialization
function initTheme() {
  // Initialize mobile menu
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Initialize product image zoom
  const productImages = document.querySelectorAll('.product-gallery img');
  productImages.forEach(img => {
    img.addEventListener('click', function() {
      this.classList.toggle('zoomed');
    });
  });
  
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Back to top button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.classList.add('back-to-top');
  backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTopBtn);
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
}

// FAQ section functionality
function initFAQ() {
  const faqSection = document.querySelector('.faq-section');
  const categoryBtns = faqSection.querySelectorAll('.category-btn');
  const faqItems = faqSection.querySelectorAll('.faq-item');
  const questions = faqSection.querySelectorAll('.faq-question');

  // Category filter functionality
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      
      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide FAQ items
      faqItems.forEach(item => {
        if (item.dataset.category === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Accordion functionality
  questions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close other questions
      questions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.style.maxHeight = null;
        }
      });
      
      // Toggle current question
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  // Initialize with first category
  if (categoryBtns.length > 0) {
    categoryBtns[0].click();
  }
}

// Maintenance Guide functionality 
function initMaintenanceGuide() {
  const guideItems = document.querySelectorAll('.guide-item');
  const scheduleItems = document.querySelectorAll('.schedule-item');
  
  // Add animation classes to guide items for staggered appearance
  guideItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.15}s`;
    item.classList.add('animate-in');
  });
  
  // Add animation classes to schedule items
  scheduleItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('animate-in');
  });
  
  // Add click event to guide items to expand/collapse on mobile
  if (window.innerWidth < 768) {
    guideItems.forEach(item => {
      const header = item.querySelector('.guide-header');
      const content = item.querySelector('.guide-content');
      const media = item.querySelector('.guide-media');
      
      // Initial state - show only header and hide content
      if (header) {
        header.addEventListener('click', function() {
          // Toggle expanded class
          item.classList.toggle('expanded');
          
          // Update aria attributes for accessibility
          const isExpanded = item.classList.contains('expanded');
          header.setAttribute('aria-expanded', isExpanded);
          
          // Focus management
          if (isExpanded) {
            // Close other items
            guideItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('expanded')) {
                otherItem.classList.remove('expanded');
                otherItem.querySelector('.guide-header').setAttribute('aria-expanded', false);
              }
            });
          }
        });
        
        // Set initial aria attributes
        header.setAttribute('aria-expanded', false);
        header.style.cursor = 'pointer';
      }
    });
  }

  // Add step navigation buttons
  const guideGrid = document.querySelector('.guide-grid');
  if (guideGrid && guideItems.length > 1) {
    const navContainer = document.createElement('div');
    navContainer.className = 'guide-navigation';
    
    // Add step dots
    const stepsNav = document.createElement('div');
    stepsNav.className = 'steps-nav';
    
    guideItems.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.className = 'step-dot';
      dot.setAttribute('aria-label', `Go to step ${index + 1}`);
      dot.dataset.step = index + 1;
      
      dot.addEventListener('click', () => {
        const targetItem = document.getElementById(`guide-step-${index + 1}`);
        if (targetItem) {
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Highlight the current step
          document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          
          // Expand the item on mobile
          if (window.innerWidth < 768) {
            guideItems.forEach(item => {
              item.classList.remove('expanded');
              item.querySelector('.guide-header').setAttribute('aria-expanded', false);
            });
            
            targetItem.classList.add('expanded');
            targetItem.querySelector('.guide-header').setAttribute('aria-expanded', true);
          }
        }
      });
      
      stepsNav.appendChild(dot);
    });
    
    // Set first dot as active
    stepsNav.querySelector('.step-dot').classList.add('active');
    
    navContainer.appendChild(stepsNav);
    
    // Create print button
    const printBtn = document.createElement('button');
    printBtn.className = 'print-guide-btn';
    printBtn.innerHTML = '<i class="fa-solid fa-print"></i> Print Guide';
    printBtn.addEventListener('click', () => {
      window.print();
    });
    
    navContainer.appendChild(printBtn);
    
    // Add navigation after the title
    const sectionHeader = document.querySelector('.maintenance-guide .section-header');
    if (sectionHeader) {
      sectionHeader.insertAdjacentElement('afterend', navContainer);
    }
  }

  // Lazy load videos when they come into view
  if ('IntersectionObserver' in window) {
    const videoFrames = document.querySelectorAll('.guide-video iframe');
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the iframe
          const iframe = entry.target;
          
          // Get the data-src attribute
          const src = iframe.getAttribute('data-src');
          
          // Set the src attribute to load the video
          if (src) {
            iframe.src = src;
          }
          
          // Stop observing this element
          videoObserver.unobserve(iframe);
        }
      });
    }, {
      rootMargin: '0px 0px 50px 0px'
    });
    
    // Observe each video frame
    videoFrames.forEach(frame => {
      // Store the src in data-src attribute and remove src to prevent loading
      const src = frame.src;
      if (src) {
        frame.setAttribute('data-src', src);
        frame.removeAttribute('src');
        
        videoObserver.observe(frame);
      }
    });
  }
  
  // Create a table of contents for the guide steps
  const sectionHeader = document.querySelector('.maintenance-guide .section-header');
  if (sectionHeader && guideItems.length > 2) {
    const tocContainer = document.createElement('div');
    tocContainer.className = 'guide-toc';
    tocContainer.innerHTML = '<h3>Quick Navigation</h3>';
    
    const tocList = document.createElement('ul');
    guideItems.forEach((item, index) => {
      const title = item.querySelector('.guide-header h3').textContent;
      const tocItem = document.createElement('li');
      const tocLink = document.createElement('a');
      tocLink.href = `#guide-step-${index + 1}`;
      tocLink.innerHTML = `<span class="toc-number">${index + 1}</span> ${title}`;
      
      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Add show/hide toggle for mobile
    const tocToggle = document.createElement('button');
    tocToggle.className = 'toc-toggle';
    tocToggle.innerHTML = 'Quick Navigation <i class="fa-solid fa-chevron-down"></i>';
    tocToggle.addEventListener('click', () => {
      tocContainer.classList.toggle('expanded');
      
      const icon = tocToggle.querySelector('i');
      if (tocContainer.classList.contains('expanded')) {
        icon.className = 'fa-solid fa-chevron-up';
      } else {
        icon.className = 'fa-solid fa-chevron-down';
      }
    });
    
    sectionHeader.insertAdjacentElement('afterend', tocContainer);
    tocContainer.insertAdjacentElement('beforebegin', tocToggle);
  }
  
  // Add scroll progress indicator
  const progressContainer = document.createElement('div');
  progressContainer.className = 'guide-progress';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);
  
  document.querySelector('.maintenance-guide').appendChild(progressContainer);
  
  // Update progress bar on scroll
  window.addEventListener('scroll', () => {
    const guideSection = document.querySelector('.maintenance-guide');
    const guideSectionHeight = guideSection.offsetHeight;
    const guideSectionTop = guideSection.offsetTop;
    const scrollPosition = window.scrollY;
    
    // Calculate how far through the section we've scrolled
    let scrollPercentage = 0;
    
    if (scrollPosition > guideSectionTop) {
      const scrolledAmount = scrollPosition - guideSectionTop;
      scrollPercentage = (scrolledAmount / guideSectionHeight) * 100;
      
      // Cap at 100%
      scrollPercentage = Math.min(scrollPercentage, 100);
    }
    
    progressBar.style.width = `${scrollPercentage}%`;
  });

  // Search functionality
  const searchInput = document.getElementById('guide-search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const noResultsMessage = document.getElementById('no-results-message');
  
  if (searchInput && clearSearchBtn) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      let resultsFound = false;
      
      if (searchTerm.length < 2) {
        // Reset all items to visible if search term is too short
        guideItems.forEach(item => {
          item.style.display = 'grid';
        });
        noResultsMessage.classList.remove('visible');
        return;
      }
      
      // Search in title, description, tips, and warnings
      guideItems.forEach(item => {
        const title = item.querySelector('.guide-header h3').textContent.toLowerCase();
        const description = item.querySelector('.guide-description').textContent.toLowerCase();
        const tips = item.querySelector('.guide-tips') ? item.querySelector('.guide-tips').textContent.toLowerCase() : '';
        const warning = item.querySelector('.guide-warning') ? item.querySelector('.guide-warning').textContent.toLowerCase() : '';
        
        const content = title + ' ' + description + ' ' + tips + ' ' + warning;
        
        if (content.includes(searchTerm)) {
          item.style.display = 'grid';
          resultsFound = true;
          
          // Expand item on mobile
          if (window.innerWidth < 768) {
            item.classList.add('expanded');
            item.querySelector('.guide-header').setAttribute('aria-expanded', true);
          }
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show no results message if needed
      if (!resultsFound) {
        noResultsMessage.classList.add('visible');
      } else {
        noResultsMessage.classList.remove('visible');
      }
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', function() {
      searchInput.value = '';
      
      // Show all items
      guideItems.forEach(item => {
        item.style.display = 'grid';
        
        // Collapse on mobile
        if (window.innerWidth < 768) {
          item.classList.remove('expanded');
          item.querySelector('.guide-header').setAttribute('aria-expanded', false);
        }
      });
      
      // Hide no results message
      if (noResultsMessage) {
        noResultsMessage.classList.remove('visible');
      }
      
      // Focus on search input
      searchInput.focus();
    });
  }
  
  // Feedback form functionality
  const feedbackBtns = document.querySelectorAll('.feedback-btn');
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackSuccess = document.getElementById('feedback-success');
  
  if (feedbackBtns.length > 0) {
    feedbackBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const feedbackType = this.dataset.feedback;
        
        // Remove selected class from all buttons
        feedbackBtns.forEach(b => b.classList.remove('selected'));
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Show feedback form for negative feedback
        if (feedbackType === 'not-helpful') {
          feedbackForm.classList.add('visible');
        } else {
          // Show success message directly for positive feedback
          feedbackSuccess.classList.add('visible');
          
          // Hide form
          feedbackForm.classList.remove('visible');
          
          // Store feedback in localStorage
          localStorage.setItem('guide_feedback', feedbackType);
        }
      });
    });
    
    // Handle form submission
    if (feedbackForm) {
      feedbackForm.querySelector('button').addEventListener('click', function(e) {
        e.preventDefault();
        
        const textarea = feedbackForm.querySelector('textarea');
        const feedback = textarea.value;
        
        // Here you would typically send the feedback to your server
        // For now, we'll just simulate a successful submission
        
        // Hide the form
        feedbackForm.classList.remove('visible');
        
        // Show success message
        feedbackSuccess.classList.add('visible');
        
        // Store feedback in localStorage
        localStorage.setItem('guide_feedback_text', feedback);
      });
    }
  }
}

// Maintenance Related Products functionality
function initMaintenanceProducts() {
  const quickAddBtns = document.querySelectorAll('.quick-add-btn');
  
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      this.disabled = true;
      
      // Simulating adding to cart
      addToCart(productId, 1)
        .then(response => {
          this.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(() => {
            this.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
            this.disabled = false;
          }, 2000);
          
          // Refresh mini cart if it exists
          updateMiniCart();
          
          // Show cart notification
          showCartNotification('Product added to cart');
        })
        .catch(error => {
          this.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
          setTimeout(() => {
            this.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
            this.disabled = false;
          }, 2000);
          
          showCartNotification('Could not add product to cart', true);
          console.error('Error adding to cart:', error);
        });
    });
  });
  
  // Filter buttons for related products if they exist
  const filterButtons = document.querySelectorAll('.product-filter-btn');
  const productCards = document.querySelectorAll('.maintenance-product-card');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterValue = this.dataset.filter;
        
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter products
        if (filterValue === 'all') {
          productCards.forEach(card => {
            card.style.display = 'block';
          });
        } else {
          productCards.forEach(card => {
            if (card.dataset.category === filterValue) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
    
    // Initialize with first filter
    if (filterButtons.length > 0) {
      filterButtons[0].click();
    }
  }
}

// Helper functions for cart operations
function addToCart(id, quantity) {
  return fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      quantity: quantity
    })
  })
  .then(response => response.json());
}

function updateMiniCart() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
        
        // If cart was previously empty but now has items, highlight cart icon
        if (cart.item_count > 0) {
          cartCount.classList.add('has-items');
        }
      }
    });
}

function showCartNotification(message, isError = false) {
  // Create notification if it doesn't exist
  let notification = document.querySelector('.cart-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'cart-notification';
    document.body.appendChild(notification);
  }
  
  // Add error class if needed
  if (isError) {
    notification.classList.add('error');
  } else {
    notification.classList.remove('error');
  }
  
  // Set message and show notification
  notification.textContent = message;
  notification.classList.add('visible');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('visible');
  }, 3000);
} 