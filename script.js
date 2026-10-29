gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HEADER LOGIC ---
    const header = document.getElementById("jesko-header");
    
    // --- 2. SPLASH SCREEN & HERO VIDEO SEQUENCE ---
    
    document.body.style.overflow = "hidden";
    
    // Step 1: Splash screen curtain
    let splashTl = gsap.timeline({
        delay: 1.5,
        onComplete: () => {
            document.body.style.overflow = "";
        }
    });

    splashTl.to(".logo-text-group", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power2.inOut"
    })
    .to("#dark-intro", {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
    });

    // Step 2: Animate static hero content on load
    gsap.to("#hero-sequence .vanish-text", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        delay: 2 // Wait for splash screen to fade out
    });

    // Make header visible immediately after splash
    setTimeout(() => {
        header.classList.add('visible');
    }, 2000);

    // --- 3. VANISHING/APPEARING LUXURY TEXT ---
    const vanishElements = document.querySelectorAll(".vanish-text");
    vanishElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 40%",
                scrub: 1
            },
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out"
        });
    });

    // --- 4. PROMISE BULGE EFFECT ---
    const isMobileView = window.innerWidth <= 768;
    gsap.to("#promise-bulge-text", {
        scrollTrigger: {
            trigger: ".promise-bulge-container",
            start: "top 80%",
            end: "top 20%",
            scrub: 1
        },
        scale: isMobileView ? 1.15 : 1.5,
        letterSpacing: isMobileView ? "8px" : "20px",
        color: "#8b5cf6", // Violet instead of white since background is white now
        webkitTextStroke: "0px",
        textShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
        ease: "power2.out"
    });

    // (The old static reviews were removed in favor of the dynamic infinite loop in Section 7)

    // --- 8. HERO SLOGAN SLIDESHOW ---
    const slogans = [
        "Zero effort.<br>Infinite drip.",
        "Crisp clothes.<br>Main character aura.",
        "Fresh fits.<br>Zero stress.",
        "Your wardrobe's glow-up<br>starts here.",
        "Keep your drip<br>immaculate.",
        "Outfits serving looks.<br>We handle the wash.",
        "Unmatched freshness.<br>Elite vibes.",
        "Soft fabrics.<br>Hard flex.",
        "Spotless garments.<br>Flawless aesthetic.",
        "Premium care for<br>your daily rotation.",
        "Ironed out.<br>Ready to step out.",
        "Respect the fit.<br>Trust the process.",
        "Less time washing.<br>More time shining.",
        "Curated cleaning for<br>the modern closet.",
        "Elevate your<br>everyday style.",
        "Perfectly folded.<br>Effortlessly bold.",
        "Keep the colors popping<br>and the aura glowing.",
        "We do the laundry.<br>You steal the show.",
        "Wrinkle-free fits for<br>a stress-free life.",
        "Because your clothes deserve<br>the VIP treatment."
    ];

    const sloganEl = document.getElementById("slogan-text");
    let currentSloganIdx = 0;

    if(sloganEl) {
        setInterval(() => {
            gsap.to(sloganEl, {
                opacity: 0,
                y: -10, // slight float up fade
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    currentSloganIdx = (currentSloganIdx + 1) % slogans.length;
                    sloganEl.innerHTML = slogans[currentSloganIdx];
                    
                    gsap.fromTo(sloganEl, 
                        { opacity: 0, y: 10 }, 
                        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                    );
                }
            });
        }, 4000); // Crossfade every 4 seconds
    }

});

// --- 6. HOW IT WORKS GRAPH ANIMATION ---
(function initGraphAnimation() {
    const mathCurve = document.getElementById('math-curve');
    if (!mathCurve) return;
    
    // Set dash array and offset to hide the line completely at the start
    gsap.set(mathCurve, { strokeDasharray: 1200, strokeDashoffset: 1200 });

    const graphTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".process-graph-container",
            start: "top 60%", // Play automatically when graph scrolls into view
            toggleActions: "play none none none" 
        }
    });

    const totalTime = 4; // Complete in 4 seconds
    
    // 1. Draw the line smoothly
    graphTl.to(mathCurve, { strokeDashoffset: 0, duration: totalTime, ease: "power1.inOut" }, 0);
    
    // 2. Reveal the Area Gradient underneath it at the exact same speed
    graphTl.fromTo("#area-clip-rect", 
        { attr: { width: 0 } }, 
        { attr: { width: 950 }, duration: totalTime, ease: "power1.inOut" }, 
        0
    );

    // 3. Node 1: Book Order
    graphTl.to("#node-1", { opacity: 1, duration: 0.4 }, 0);
    graphTl.to("#node-1", { opacity: 0, duration: 0.4 }, 1.0);

    // 4. Node 2: Pickup
    graphTl.to("#node-2", { opacity: 1, duration: 0.4 }, 1.2);
    graphTl.to("#node-2", { opacity: 0, duration: 0.4 }, 2.3);

    // 5. Node 3: Wash & Fold
    graphTl.to("#node-3", { opacity: 1, duration: 0.4 }, 2.6);
    graphTl.to("#node-3", { opacity: 0, duration: 0.4 }, 3.6);

    // 6. Node 4: Delivery
    graphTl.to("#node-4", { opacity: 1, duration: 0.4 }, 3.8);

    // 7. At the very end, show the formula and bring ALL nodes back so the graph is complete!
    graphTl.to(["#node-1", "#node-2", "#node-3", "#html-math-equation"], { opacity: 1, duration: 1 }, totalTime + 0.2);
})();
// --- 7. GLOBE & LOCATIONS SEQUENCE (D3.js + GSAP) ---
(function initLocationsSequence() {
    const globeCanvas = document.getElementById("sea-globe-canvas");
    if(!globeCanvas) return;
    const gctx = globeCanvas.getContext("2d");
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    globeCanvas.width = width;
    globeCanvas.height = height;

    let cx = width / 2;
    let cy = height / 2;
    let baseZoom = Math.min(width, height) * (width <= 768 ? 0.38 : 0.45); // Globe radius fits screen

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        globeCanvas.width = width;
        globeCanvas.height = height;
        cx = width / 2;
        cy = height / 2;
        baseZoom = Math.min(width, height) * 0.45;
        if (!locTl || locTl.progress() === 0) {
            globeConfig.zoom = baseZoom;
        }
    });

    const projection = d3.geoOrthographic()
        .scale(baseZoom) 
        .translate([cx, cy])
        .clipAngle(90);

    const path = d3.geoPath()
        .projection(projection)
        .context(gctx);

    let world;
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(data => {
            world = topojson.feature(data, data.objects.countries);
            requestAnimationFrame(drawGlobe);
        });

    let rotation = 0; 
    let globeConfig = { lon: -70, lat: -15, speed: 0.15, zoom: baseZoom };

    let isIdleSpinning = true;

    // Kozhikode, Kerala exact GPS
    const KERALA_COORDS = [75.8, 11.25]; // [longitude, latitude]
    let pinVisible = false;

    function drawGlobe() {
        gctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
        
        projection.scale(globeConfig.zoom);
        projection.translate([cx, cy]);
        projection.rotate([globeConfig.lon, globeConfig.lat, 0]); 

        // Countries — seamless floating aura effect
        if(world) {
            gctx.beginPath();
            path(world);
            gctx.fillStyle = "rgba(139, 92, 246, 0.15)";
            gctx.fill();
            gctx.strokeStyle = "rgba(76, 29, 149, 0.4)";
            gctx.lineWidth = 1;
            gctx.stroke();
        }

        // === LIVE PIN TRACKING ===
        // Project Kerala's exact GPS to canvas pixel coordinates every frame
        const pinEl = document.getElementById("pin-orkkatteri");
        if (pinEl && pinVisible) {
            const px = projection(KERALA_COORDS);
            if (px) {
                // px[0], px[1] are canvas pixels — convert to % of container
                const container = document.querySelector(".globe-container");
                const rect = container.getBoundingClientRect();
                const canvasRect = globeCanvas.getBoundingClientRect();
                // Position relative to container
                const relX = (canvasRect.left - rect.left) + px[0];
                const relY = (canvasRect.top - rect.top) + px[1];
                pinEl.style.left = relX + "px";
                pinEl.style.top = relY + "px";
            }
        }
        
        if (isIdleSpinning) {
            globeConfig.lon -= 0.15; // Slow spin
        }
        
        requestAnimationFrame(drawGlobe);
    }

    let locTl;

    setTimeout(() => {
        // Pin starts hidden — position is driven live by D3 projection
        gsap.set("#pin-orkkatteri", { opacity: 0, scale: 0 });

        let proxy = { progress: 0 };
        let startLon = 0;
        let startLat = -15;

        locTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#locations-section",
                pin: true,
                start: "top top",
                end: "+=1500",
                scrub: 1,
                onEnter: () => {
                    isIdleSpinning = false;
                    startLon = globeConfig.lon;
                    startLat = globeConfig.lat;

                    // Shortest-path normalization
                    let mod = startLon % 360;
                    let cycles = startLon - mod;
                    let tLon = -75.8 + cycles;
                    if (startLon - tLon > 180) tLon += 360;
                    if (startLon - tLon < -180) tLon -= 360;
                    proxy._targetLon = tLon;
                },
                onLeaveBack: () => {
                    isIdleSpinning = true;
                    pinVisible = false;
                    gsap.to("#pin-orkkatteri", { opacity: 0, scale: 0, duration: 0.3 });
                    gsap.to("#location-title-overlay", { opacity: 1, y: 0, duration: 0.3 });
                }
            }
        });

        // 1. Fade title out
        locTl.to("#location-title-overlay", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, 0)

        // 2. Spin & zoom — D3 projection will track Kerala's pixel position live
        .to(proxy, {
            progress: 1,
            duration: 1.5,
            ease: "power2.inOut",
            onStart: () => { pinVisible = true; }, // start tracking from the beginning
            onUpdate: function() {
                let p = this.progress();
                globeConfig.zoom = baseZoom + (baseZoom * 1.4 * p);
                globeConfig.lon = startLon + ((proxy._targetLon || -75.8) - startLon) * p;
                globeConfig.lat = startLat + (-11.25 - startLat) * p;
            }
        })

        // 3. Reveal the pin — D3 has already positioned it at exact Kerala pixel
        .to("#pin-orkkatteri", {
            opacity: 1,
            scale: 1,
            duration: 0.5
        });

        // CRITICAL FIX: The globe timeline adds a pin spacer. We must refresh!
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

    }, 500);
})();
