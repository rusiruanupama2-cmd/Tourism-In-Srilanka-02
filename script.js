/* ============================================
   DISCOVER SRI LANKA - SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // ==========================================
    // STICKY HEADER
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => counterObserver.observe(num));
    
    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // ==========================================
    // BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ==========================================
    // TRIP PLANNER
    // ==========================================
    const styleButtons = document.querySelectorAll('#styleButtons .planner-btn');
    const durationButtons = document.querySelectorAll('#durationButtons .planner-btn');
    const plannerResult = document.getElementById('plannerResult');
    
    let selectedStyle = null;
    let selectedDuration = null;
    
    const itineraries = {
        adventure: {
            3: ['Colombo city exploration', 'White-water rafting in Kitulgala', 'Hiking in Ella'],
            5: ['Colombo', 'Sigiriya rock climb', 'Kandy', 'Ella hiking', 'Yala safari'],
            7: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle'],
            10: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Colombo'],
            14: ['Colombo', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Polonnaruwa', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Sinharaja', 'Kitulgala', 'Colombo']
        },
        relaxation: {
            3: ['Negombo beach', 'Colombo spa & dining', 'Galle coastal retreat'],
            5: ['Negombo', 'Kandy cultural evening', 'Nuwara Eliya tea estates', 'Mirissa beach', 'Galle'],
            7: ['Colombo', 'Bentota beach', 'Galle', 'Mirissa', 'Tangalle', 'Arugam Bay', 'Pasikudah'],
            10: ['Colombo', 'Bentota', 'Galle', 'Mirissa', 'Tangalle', 'Yala (luxury lodge)', 'Ella', 'Nuwara Eliya', 'Kandy', 'Colombo'],
            14: ['Colombo', 'Negombo', 'Kalpitiya', 'Bentota', 'Galle', 'Mirissa', 'Tangalle', 'Yala', 'Ella', 'Nuwara Eliya', 'Kandy', 'Sigiriya', 'Anuradhapura', 'Colombo']
        },
        family: {
            3: ['Colombo National Museum', 'Pinnawala Elephant Orphanage', 'Bentota beach'],
            5: ['Colombo', 'Pinnawala', 'Sigiriya', 'Kandy', 'Bentota'],
            7: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Bentota'],
            10: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Polonnaruwa', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Bentota'],
            14: ['Colombo', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Polonnaruwa', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Bentota', 'Pinnawala', 'Colombo']
        },
        luxury: {
            3: ['Colombo luxury hotel', 'Ceylon Tea Trails', 'Galle Fort boutique stay'],
            5: ['Colombo', 'Cultural Triangle luxury camp', 'Kandy', 'Tea Trails', 'Galle'],
            7: ['Colombo', 'Sigiriya (luxury lodge)', 'Kandy', 'Nuwara Eliya (Tea Trails)', 'Ella', 'Yala (luxury safari)', 'Galle (boutique hotel)'],
            10: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Colombo'],
            14: ['Colombo', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Polonnaruwa', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Bentota', 'Colombo city tour', 'Departure']
        },
        culture: {
            3: ['Colombo museums', 'Kandy Temple of the Tooth', 'Galle Fort'],
            5: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Kandy', 'Galle'],
            7: ['Colombo', 'Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy', 'Galle'],
            10: ['Colombo', 'Anuradhapura', 'Mihintale', 'Sigiriya', 'Polonnaruwa', 'Dambulla', 'Kandy', 'Gadaladeniya', 'Galle', 'Colombo'],
            14: ['Colombo', 'Anuradhapura', 'Mihintale', 'Sigiriya', 'Polonnaruwa', 'Dambulla', 'Kandy', 'Temple Loop', 'Nuwara Eliya', 'Ella', 'Buduruwagala', 'Kataragama', 'Galle', 'Colombo']
        },
        wildlife: {
            3: ['Colombo', 'Pinnawala Elephant Orphanage', 'Yala National Park'],
            5: ['Colombo', 'Wilpattu NP', 'Sigiriya', 'Minneriya (Elephant Gathering)', 'Yala NP'],
            7: ['Colombo', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Minneriya', 'Yala', 'Sinharaja Rainforest'],
            10: ['Colombo', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Minneriya', 'Kandy', 'Horton Plains', 'Yala', 'Udawalawe', 'Sinharaja'],
            14: ['Colombo', 'Kalpitiya (dolphins)', 'Wilpattu', 'Anuradhapura', 'Sigiriya', 'Minneriya', 'Kandy', 'Horton Plains', 'Yala', 'Udawalawe', 'Mirissa (whales)', 'Sinharaja', 'Kitulgala (birds)', 'Colombo']
        },
        honeymoon: {
            3: ['Colombo romantic dinner', 'Bentota beach resort', 'Galle sunset'],
            5: ['Colombo', 'Kandy (cultural show)', 'Nuwara Eliya (hill country)', 'Ella (scenic train)', 'Mirissa'],
            7: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala (luxury safari)', 'Mirissa (beach & whales)'],
            10: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Bentota'],
            14: ['Colombo', 'Negombo', 'Anuradhapura', 'Sigiriya', 'Polonnaruwa', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Tangalle', 'Mirissa', 'Galle', 'Bentota', 'Colombo']
        }
    };
    
    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedStyle = btn.dataset.style;
            updateItinerary();
        });
    });
    
    durationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            durationButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDuration = parseInt(btn.dataset.duration);
            updateItinerary();
        });
    });
    
    function updateItinerary() {
        if (!selectedStyle || !selectedDuration) return;
        
        const days = itineraries[selectedStyle][selectedDuration] || itineraries[selectedStyle][7];
        const styleName = selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1);
        
        let html = `<div class="planner-itinerary">
            <h3>${days.length}-Day ${styleName} Itinerary</h3>`;
        
        days.forEach((day, index) => {
            html += `
                <div class="planner-day">
                    <div class="planner-day-number">D${index + 1}</div>
                    <div class="planner-day-content">
                        <h4>${day}</h4>
                        <p>Explore the best of ${day.split(' ').slice(0, 2).join(' ')} with guided experiences.</p>
                    </div>
                </div>`;
        });
        
        html += '</div>';
        plannerResult.innerHTML = html;
    }
    
    // ==========================================
    // INTERACTIVE MAP
    // ==========================================
    const mapDots = document.querySelectorAll('.map-dot');
    const mapInfo = document.getElementById('mapInfo');
    
    const locationData = {
        colombo: {
            name: 'Colombo',
            image: 'https://kimi-web-img.kimi.ai/img/media.gettyimages.com/a3be059c46f7ace8fbe2c71a868937e2b61b760c.jpg',
            desc: 'Sri Lanka\'s vibrant capital blends colonial architecture with modern skyscrapers, bustling markets, and a growing food scene.',
            things: ['Gangaramaya Temple', 'Galle Face Green', 'Pettah Markets', 'National Museum']
        },
        sigiriya: {
            name: 'Sigiriya',
            image: 'https://kimi-web-img.kimi.ai/img/media.istockphoto.com/3b2d4f11cfc8ede630914dca0f469c5a11987dcb.jpg',
            desc: 'The ancient rock fortress, a UNESCO World Heritage Site, features stunning frescoes, mirror walls, and panoramic views.',
            things: ['Climb Sigiriya Rock', 'Pidurangala Rock', 'Sigiriya Museum', 'Village Safari']
        },
        kandy: {
            name: 'Kandy',
            image: 'https://kimi-web-img.kimi.ai/img/overatours.com/db3da77a3be401d81a32508d58f5c38930609d93.jpg',
            desc: 'The cultural capital, home to the sacred Temple of the Tooth Relic and surrounded by misty hills.',
            things: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens', 'Cultural Dance Show']
        },
        ella: {
            name: 'Ella',
            image: 'https://kimi-web-img.kimi.ai/img/www.greenholidaytravels.com/301c9e0cf5e0e13f843dbf82eea287d3c901e62a.jpg',
            desc: 'A charming hill town famous for the Nine Arches Bridge, Little Adam\'s Peak, and breathtaking train rides.',
            things: ['Nine Arches Bridge', 'Little Adam\'s Peak', 'Ella Rock', 'Tea Factory Visit']
        },
        'nuwara-eliya': {
            name: 'Nuwara Eliya',
            image: 'https://kimi-web-img.kimi.ai/img/cdn.audleytravel.com/fbd2cdd3090d45012865fbcd3124f0d3309a27d9.webp',
            desc: 'Known as "Little England," this cool highland town is surrounded by emerald tea estates and waterfalls.',
            things: ['Tea Plantation Tour', 'Horton Plains', 'Gregory Lake', 'Victoria Park']
        },
        galle: {
            name: 'Galle',
            image: 'https://kimi-web-img.kimi.ai/img/fernandotravels.com.au/2a8c93701f26c005826f52a229b3581b58eeb9a8',
            desc: 'A UNESCO-listed colonial fort town with cobblestone streets, boutique shops, and stunning ocean sunsets.',
            things: ['Galle Fort Walk', 'Lighthouse', 'Maritime Museum', 'Unawatuna Beach']
        },
        yala: {
            name: 'Yala National Park',
            image: 'https://kimi-web-img.kimi.ai/img/media-cdn.tripadvisor.com/fc942eff479986d4a3b79ffdebf3c9419d4c7abb.jpg',
            desc: 'Sri Lanka\'s most famous wildlife park, boasting the world\'s highest leopard density and incredible biodiversity.',
            things: ['Leopard Safari', 'Bird Watching', 'Sithulpawwa Temple', 'Beach within Park']
        },
        mirissa: {
            name: 'Mirissa',
            image: 'https://kimi-web-img.kimi.ai/img/res.klook.com/d212164c6d3d022f5a49033eed6e3ff34ea0367b.jpg',
            desc: 'A laid-back beach town perfect for whale watching, surfing, and enjoying fresh seafood by the ocean.',
            things: ['Whale Watching', 'Secret Beach', 'Coconut Tree Hill', 'Surfing']
        },
        'arugam-bay': {
            name: 'Arugam Bay',
            image: 'https://kimi-web-img.kimi.ai/img/thesurfatlas.com/936a5188fdd4d4b93147bd7f3f478f687f7a9f92.jpg',
            desc: 'Sri Lanka\'s surf capital, offering world-class waves, a bohemian vibe, and pristine beaches.',
            things: ['Main Point Surfing', 'Elephant Rock', 'Lagoon Safari', 'Kumana National Park']
        },
        anuradhapura: {
            name: 'Anuradhapura',
            image: 'https://kimi-web-img.kimi.ai/img/res.cloudinary.com/fe61d88f514776799667ba29fbf044fe85829f84',
            desc: 'One of the ancient capitals, featuring massive dagobas, sacred Bodhi trees, and well-preserved ruins.',
            things: ['Ruwanwelisaya', 'Sri Maha Bodhi', 'Abhayagiri', 'Mihintale']
        },
        polonnaruwa: {
            name: 'Polonnaruwa',
            image: 'https://kimi-web-img.kimi.ai/img/nerdnomads.com/379403e0a39b24b724704ba8d9383d43731b5204.jpg',
            desc: 'The second ancient capital, showcasing remarkable stone sculptures, royal palaces, and Buddhist temples.',
            things: ['Gal Viharaya', 'Royal Palace', 'Rankoth Vehera', 'Parakrama Samudra']
        }
    };
    
    mapDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const location = dot.dataset.location;
            showLocationInfo(location);
        });
        
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const location = dot.dataset.location;
                showLocationInfo(location);
            }
        });
    });
    
    function showLocationInfo(location) {
        const data = locationData[location];
        if (!data) return;
        
        mapInfo.innerHTML = `
            <div class="map-info-content">
                <img src="${data.image}" alt="${data.name}" class="map-info-img">
                <h3>${data.name}</h3>
                <p>${data.desc}</p>
                <div class="map-info-list">
                    ${data.things.map(thing => `<span>${thing}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    // Destination links also trigger map
    document.querySelectorAll('.destination-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const location = link.dataset.location;
            if (location && locationData[location]) {
                setTimeout(() => showLocationInfo(location), 300);
            }
        });
    });
    
    // ==========================================
    // GALLERY FILTER & LIGHTBOX
    // ==========================================
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElement