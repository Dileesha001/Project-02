/**
 * BOOKCASE - Interactive Master JavaScript
 * Handles Theme Toggle, Live Search, Shopping Cart, Quick View Modal,
 * Mobile Menu, Toast Notifications, and Form Validations.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('BOOKCASE master script initialized');

    // ==========================================
    // 1. STATE MANAGEMENT (Cart & Theme)
    // ==========================================
    let cart = [];
    try {
        const savedCart = localStorage.getItem('bookcase_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Failed to parse cart state:', e);
        cart = [];
    }

    // ==========================================
    // ==========================================
    // 1.5 MOBILE & DESKTOP AUTH DISPLAY CHECK
    // ==========================================
    function checkMobileAuthDisplay() {
        const isLoggedIn = localStorage.getItem('bookcase_user_logged_in') === 'true';
        const mobileHeaderAuth = document.getElementById('mobileHeaderAuth');
        const desktopAuth = document.querySelector('.desktop-auth');
        const mobileDrawerAuth = document.querySelector('.mobile-drawer-auth');
        const mobileHeaderSearch = document.getElementById('mobileHeaderSearch');
        const isMobile = window.innerWidth <= 768;

        document.body.classList.toggle('user-logged-in', isLoggedIn);

        if (isLoggedIn) {
            // Remove Sign Up & Log In buttons in BOTH Web and Mobile views
            if (mobileHeaderAuth) mobileHeaderAuth.style.setProperty('display', 'none', 'important');
            if (desktopAuth) desktopAuth.style.setProperty('display', 'none', 'important');
            if (mobileDrawerAuth) mobileDrawerAuth.style.setProperty('display', 'none', 'important');

            // In Mobile view, position search bar directly below the Bookcase logo (Row 2)
            if (mobileHeaderSearch && isMobile) {
                mobileHeaderSearch.style.setProperty('display', 'block', 'important');
                mobileHeaderSearch.style.setProperty('order', '2', 'important');
                mobileHeaderSearch.style.setProperty('margin-top', '0.5em', 'important');
            }
        } else {
            if (isMobile) {
                if (mobileHeaderAuth) {
                    mobileHeaderAuth.style.setProperty('display', 'grid', 'important');
                    mobileHeaderAuth.style.setProperty('order', '2', 'important');
                }
                if (mobileHeaderSearch) {
                    mobileHeaderSearch.style.setProperty('display', 'block', 'important');
                    mobileHeaderSearch.style.setProperty('order', '3', 'important');
                }
                if (desktopAuth) desktopAuth.style.setProperty('display', 'none', 'important');
                if (mobileDrawerAuth) mobileDrawerAuth.style.setProperty('display', 'flex', 'important');
            } else {
                if (mobileHeaderAuth) mobileHeaderAuth.style.setProperty('display', 'none', 'important');
                if (mobileHeaderSearch) {
                    mobileHeaderSearch.style.removeProperty('display');
                    mobileHeaderSearch.style.removeProperty('order');
                }
                if (desktopAuth) desktopAuth.style.setProperty('display', 'flex', 'important');
                if (mobileDrawerAuth) mobileDrawerAuth.style.setProperty('display', 'none', 'important');
            }
        }
    }
    checkMobileAuthDisplay();
    window.addEventListener('resize', checkMobileAuthDisplay);

    // ==========================================
    // 2. THEME TOGGLE (Dark Mode)
    // ==========================================
    const darkModeToggleSmall = document.getElementById('dark-mode-toggle-small');
    const darkModeToggleLarge = document.getElementById('dark-mode-toggle');
    const body = document.body;

    function setTheme(isDarkMode) {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
        updateToggleIcons(isDarkMode);
    }

    function updateToggleIcons(isDarkMode) {
        const moonIconSmall = document.getElementById('moon-icon-small');
        const sunIconSmall = document.getElementById('sun-icon-small');
        if (moonIconSmall && sunIconSmall) {
            moonIconSmall.style.display = isDarkMode ? 'none' : 'inline';
            sunIconSmall.style.display = isDarkMode ? 'inline' : 'none';
        }
    }

    // Automatic System Theme Preference Detection (Mobile View Only)
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

    function handleAutoThemeCheck() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // On Mobile View: Shift automatically according to mobile OS device settings
            setTheme(mediaQueryDark.matches);
        } else {
            // On Desktop View: Use stored preference or default to dark mode
            if (localStorage.getItem('darkMode') === 'disabled') {
                setTheme(false);
            } else {
                setTheme(true);
            }
        }
    }

    // Initial check
    handleAutoThemeCheck();

    // Listen for live system dark/light mode preference changes on mobile device
    if (mediaQueryDark.addEventListener) {
        mediaQueryDark.addEventListener('change', (e) => {
            if (window.innerWidth <= 768) {
                setTheme(e.matches);
            }
        });
    }

    // Listen to resize event to maintain Desktop vs Mobile theme rules
    window.addEventListener('resize', handleAutoThemeCheck);

    if (darkModeToggleSmall) {
        darkModeToggleSmall.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                setTheme(!body.classList.contains('dark-mode'));
            }
        });
    }
    if (darkModeToggleLarge) {
        darkModeToggleLarge.addEventListener('click', () => {
            setTheme(!body.classList.contains('dark-mode'));
        });
    }

    // ==========================================
    // 3. TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconSvg = type === 'success' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            
        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // 4. LIVE SEARCH & FILTERING
    // ==========================================
    const searchInput = document.getElementById('headerSearchInput');
    const clearSearchBtn = document.getElementById('searchClearBtn');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
            }
            filterBooks(query);
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                filterBooks('');
                searchInput.focus();
            }
        });
    }

    const mobileSearchInput = document.querySelector('.mobile-search-input');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            filterBooks(query);
        });
    }

    function filterBooks(query) {
        const bookCards = document.querySelectorAll('.box2');
        let visibleCount = 0;

        bookCards.forEach(card => {
            const title = (card.querySelector('.h4name')?.textContent || card.querySelector('h4')?.textContent || '').toLowerCase();
            const author = (card.querySelector('.author')?.textContent || '').toLowerCase();

            if (!query || title.includes(query) || author.includes(query)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show toast notification if active query filtered items
        if (query && visibleCount === 0) {
            showToast(`No books found matching "${query}"`, 'info');
        }
    }

    // ==========================================
    // 5. SHOPPING CART DRAWER
    // ==========================================
    const cartTriggerBtn = document.getElementById('cartTriggerBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function saveCart() {
        localStorage.setItem('bookcase_cart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer || !cartBadge || !cartTotalPrice) return;

        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const floatingCartBadge = document.getElementById('floatingCartBadge');
        if (cartBadge) cartBadge.textContent = totalCount;
        if (floatingCartBadge) floatingCartBadge.textContent = totalCount;
        
        // Bump animation on cart badges
        cartBadge.classList.add('bump');
        if (floatingCartBadge) floatingCartBadge.classList.add('bump');
        setTimeout(() => {
            cartBadge.classList.remove('bump');
            if (floatingCartBadge) floatingCartBadge.classList.remove('bump');
        }, 300);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1em; color: #94a3b8;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p>Your shopping cart is currently empty.</p>
                </div>
            `;
            cartTotalPrice.textContent = 'LKR 0.00';
            return;
        }

        let totalLKR = 0;
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            const itemTotal = priceNum * item.quantity;
            totalLKR += itemTotal;

            return `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn qty-minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
        }).join('');

        cartTotalPrice.textContent = `LKR ${totalLKR.toFixed(2)}`;
    }

    function addToCart(bookData) {
        const existingIndex = cart.findIndex(item => item.title === bookData.title);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...bookData, quantity: 1 });
        }
        saveCart();
        showToast(`Added "${bookData.title}" to cart!`, 'success');
    }

    const floatingCartBtn = document.getElementById('floatingCartBtn');

    if (cartTriggerBtn && cartOverlay) {
        cartTriggerBtn.addEventListener('click', () => {
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (floatingCartBtn && cartOverlay) {
        floatingCartBtn.addEventListener('click', () => {
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (cartCloseBtn && cartOverlay) {
        cartCloseBtn.addEventListener('click', () => {
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const index = e.target.closest('[data-index]')?.dataset.index;
            if (index === undefined) return;

            if (e.target.closest('.qty-minus')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
            } else if (e.target.closest('.qty-plus')) {
                cart[index].quantity += 1;
                saveCart();
            } else if (e.target.closest('.cart-item-remove')) {
                const title = cart[index].title;
                cart.splice(index, 1);
                saveCart();
                showToast(`Removed "${title}" from cart`, 'info');
            }
        });
    }

    // Global Checkout Click Event Handler (Delegated for 100% reliability)
    document.addEventListener('click', function(e) {
        const checkoutTarget = e.target.closest('#checkoutBtn, .checkout-btn, .btn-checkout, [data-action="checkout"]');
        if (checkoutTarget) {
            e.preventDefault();
            e.stopPropagation();

            if (cartOverlay) cartOverlay.classList.remove('open');
            document.body.style.overflow = '';

            const isSubpage = window.location.pathname.includes('/pages/');
            const targetPage = isSubpage ? 'checkout.html' : 'pages/checkout.html';
            window.location.href = targetPage;
        }
    });

    // Attach event listeners to all Add To Cart buttons on cards
    document.addEventListener('click', function(e) {
        const addBtn = e.target.closest('.btn-add-cart');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = addBtn.closest('.box2') || addBtn.closest('.modal-container');
            if (card) {
                const title = card.querySelector('.h4name')?.textContent || card.querySelector('h4')?.textContent || card.querySelector('.modal-title')?.textContent || 'Book';
                const author = card.querySelector('.author')?.textContent || card.querySelector('.modal-author')?.textContent || 'Unknown Author';
                const price = card.querySelector('.book-price')?.textContent || card.querySelector('.modal-price')?.textContent || 'LKR 0.00';
                const img = card.querySelector('img')?.src || '';

                addToCart({ title, author, price, img });
            }
        }
    });

    // Render cart on page load
    renderCart();

    // ==========================================
    // 6. QUICK VIEW MODAL
    // ==========================================
    const modalOverlay = document.getElementById('quickViewModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function openQuickView(bookData) {
        if (!modalOverlay) return;

        document.getElementById('modalCoverImg').src = bookData.img;
        document.getElementById('modalCoverImg').alt = bookData.title;
        document.getElementById('modalTitle').textContent = bookData.title;
        document.getElementById('modalAuthor').textContent = `by ${bookData.author}`;
        document.getElementById('modalPrice').textContent = bookData.price;
        
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // Quick view button handler on cards
    document.addEventListener('click', function(e) {
        const quickBtn = e.target.closest('.btn-quick-view');
        if (quickBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = quickBtn.closest('.box2');
            if (card) {
                const title = card.querySelector('.h4name')?.textContent || card.querySelector('h4')?.textContent || 'Book';
                const author = card.querySelector('.author')?.textContent || 'Author';
                const price = card.querySelector('.book-price')?.textContent || 'LKR 0.00';
                const img = card.querySelector('img')?.src || '';

                openQuickView({ title, author, price, img });
            }
        }
    });

    // ==========================================
    // 7. MOBILE HAMBURGER MENU
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');

    if (mobileMenuBtn && mobileNavDrawer) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileNavDrawer.classList.contains('open');
            if (isOpen) {
                mobileMenuBtn.classList.remove('open', 'active');
                mobileNavDrawer.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                mobileMenuBtn.classList.add('open', 'active');
                mobileNavDrawer.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close mobile drawer when clicking a link inside it
        mobileNavDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open', 'active');
                mobileNavDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
                mobileMenuBtn.classList.remove('open', 'active');
                mobileNavDrawer.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // 8. SMOOTH SCROLLING & HERO APP BUTTON
    // ==========================================
    const ourAppBtn = document.getElementById('ourAppButton');
    const appDownloadBox = document.getElementById('app-download');
    
    if (ourAppBtn && appDownloadBox) {
        ourAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = appDownloadBox.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                appDownloadBox.classList.add('highlight-bounce');
                setTimeout(() => appDownloadBox.classList.remove('highlight-bounce'), 2000);
            }, 600);
        });
    }
    
    document.querySelectorAll('a[href^="#"]:not(#ourAppButton)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 9. FORM SUBMISSION VALIDATIONS
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (submitBtn) submitBtn.classList.add('loading');

            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            }, 1200);
        });
    }

    // Dynamic Backend API Endpoint (Supports Local Server, GitHub Pages Fallback, & Cloud API)
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api'
        : (window.BOOKCASE_CLOUD_API || 'http://localhost:5000/api');

    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem('bookcase_user_logged_in') === 'true';
        const desktopAuth = document.querySelector('.desktop-auth');
        const mobileHeaderAuth = document.getElementById('mobileHeaderAuth');
        const mobileDrawerAuth = document.querySelector('.mobile-drawer-auth');
        const mobileDrawerInner = document.querySelector('.mobile-drawer-inner');
        const userDataStr = localStorage.getItem('bookcase_user');
        let user = null;
        try { if (userDataStr) user = JSON.parse(userDataStr); } catch(e) {}

        let userPill = document.getElementById('userProfilePill');
        let mobileUserCard = document.getElementById('mobileUserCard');

        // Always invoke mobile & desktop display check
        checkMobileAuthDisplay();

        if (isLoggedIn && user) {
            // Hide all Sign Up & Log In buttons across both web and mobile views
            if (desktopAuth) desktopAuth.style.setProperty('display', 'none', 'important');
            if (mobileHeaderAuth) mobileHeaderAuth.style.setProperty('display', 'none', 'important');
            if (mobileDrawerAuth) mobileDrawerAuth.style.setProperty('display', 'none', 'important');

            // 1. Desktop Profile Pill
            if (!userPill) {
                userPill = document.createElement('div');
                userPill.id = 'userProfilePill';
                userPill.className = 'user-profile-pill';
                userPill.style.cssText = `
                    display: inline-flex; align-items: center; gap: 0.6em;
                    background: rgba(212,160,23,0.12); border: 1px solid rgba(212,160,23,0.3);
                    border-radius: 999px; padding: 0.4em 0.9em;
                    font-family: "Cinzel", serif; font-size: 0.75rem; color: #f5c842;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.3); margin-left: 0.4em;
                `;
                const headerActions = document.querySelector('.header-actions') || document.querySelector('.login-btns');
                if (headerActions) headerActions.appendChild(userPill);
            }

            userPill.innerHTML = `
                <span style="font-size:0.85rem;">👤</span>
                <span style="font-weight:600; text-transform:uppercase; letter-spacing:0.06em;">${user.username || 'User'}</span>
                <button class="logout-action-btn" style="background:none; border:none; color:#ef4444; font-family:'Inter',sans-serif; font-size:0.75rem; font-weight:600; cursor:pointer; margin-left:0.3em; padding-left:0.5em; border-left:1px solid rgba(212,160,23,0.3);">Logout</button>
            `;
            userPill.style.display = 'inline-flex';

            // 2. Mobile Drawer User Card
            if (mobileDrawerInner) {
                if (!mobileUserCard) {
                    mobileUserCard = document.createElement('div');
                    mobileUserCard.id = 'mobileUserCard';
                    mobileUserCard.style.cssText = `
                        display: flex; align-items: center; justify-content: space-between;
                        padding: 0.9em 1.2em; background: rgba(212,160,23,0.1);
                        border: 1px solid rgba(212,160,23,0.3); border-radius: 14px;
                        margin-top: 1.5em;
                    `;
                    mobileDrawerInner.appendChild(mobileUserCard);
                }

                mobileUserCard.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.6em; color: #f5c842; font-family: 'Cinzel', serif; font-size: 0.85rem;">
                        <span style="font-size: 1.1rem;">👤</span>
                        <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${user.username || 'User'}</span>
                    </div>
                    <button class="logout-action-btn" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 0.4em 0.85em; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer;">Logout</button>
                `;
                mobileUserCard.style.display = 'flex';
            }

            // Attach Logout event handler to all Logout buttons
            document.querySelectorAll('.logout-action-btn').forEach(btn => {
                btn.onclick = function() {
                    localStorage.removeItem('bookcase_token');
                    localStorage.removeItem('bookcase_user');
                    localStorage.setItem('bookcase_user_logged_in', 'false');
                    showToast('Logged out successfully', 'info');
                    updateAuthUI();
                };
            });
        } else {
            if (userPill) userPill.style.display = 'none';
            if (mobileUserCard) mobileUserCard.style.display = 'none';
            if (desktopAuth && window.innerWidth > 768) desktopAuth.style.display = 'flex';
            if (mobileDrawerAuth && window.innerWidth <= 768) mobileDrawerAuth.style.display = 'flex';
        }
    }

    updateAuthUI();
    window.addEventListener('resize', updateAuthUI);

    // Helper to get relative path back to homepage
    function getHomeRedirectPath() {
        return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    }

    // Form Handlers (Sign Up & Login)
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            if (e) e.preventDefault();
            const submitBtn = signupForm.querySelector('.auth-btn');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Create Account';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';
            }

            const fullName = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const password = document.getElementById('password')?.value || '';
            const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 100);

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, fullName })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    localStorage.setItem('bookcase_token', result.data.token);
                    localStorage.setItem('bookcase_user', JSON.stringify(result.data));
                    localStorage.setItem('bookcase_user_logged_in', 'true');
                    updateAuthUI();

                    showToast('Account created & saved in MongoDB! Welcome to BOOKCASE.', 'success');
                    setTimeout(() => {
                        window.location.href = getHomeRedirectPath();
                    }, 1000);
                } else {
                    showToast(result.message || 'Registration failed', 'info');
                }
            } catch (err) {
                console.warn('Backend API server not reached, saving account locally:', err.message);
                const userData = { username: username || fullName, email, role: 'customer' };
                localStorage.setItem('bookcase_token', 'local_jwt_' + Date.now());
                localStorage.setItem('bookcase_user', JSON.stringify(userData));
                localStorage.setItem('bookcase_user_logged_in', 'true');
                updateAuthUI();

                showToast('Account created successfully! Welcome to BOOKCASE.', 'success');
                setTimeout(() => {
                    window.location.href = getHomeRedirectPath();
                }, 1000);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            if (e) e.preventDefault();
            const submitBtn = loginForm.querySelector('.auth-btn');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Log In';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Authenticating...';
            }

            const email = document.getElementById('email')?.value || '';
            const password = document.getElementById('password')?.value || '';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    localStorage.setItem('bookcase_token', result.data.token);
                    localStorage.setItem('bookcase_user', JSON.stringify(result.data));
                    localStorage.setItem('bookcase_user_logged_in', 'true');
                    updateAuthUI();

                    showToast(`Welcome back, ${result.data.username}!`, 'success');
                    setTimeout(() => {
                        window.location.href = getHomeRedirectPath();
                    }, 1000);
                } else {
                    showToast(result.message || 'Invalid email or password', 'info');
                }
            } catch (err) {
                console.warn('Backend API server offline, logging in locally:', err.message);
                const storedUser = localStorage.getItem('bookcase_user');
                let username = 'User';
                if (storedUser) {
                    try { username = JSON.parse(storedUser).username || username; } catch(e){}
                } else {
                    username = email.split('@')[0];
                    localStorage.setItem('bookcase_user', JSON.stringify({ username, email, role: 'customer' }));
                }

                localStorage.setItem('bookcase_token', 'local_jwt_' + Date.now());
                localStorage.setItem('bookcase_user_logged_in', 'true');
                updateAuthUI();

                showToast(`Welcome back, ${username}!`, 'success');
                setTimeout(() => {
                    window.location.href = getHomeRedirectPath();
                }, 1000);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }

});