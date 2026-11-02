//         MAIN PAGE
// = = = = = = = = = = = = = =
const nvmn = document.getElementById("nvmn");

if (nvmn) {
    nvmn.addEventListener("click", function() {
        nvmn.classList.toggle("active");
    });
}



"use strict";



let selectedDate = null;
let selectedBarber = "Barber 1";
let selectedPayment = null;
const PRICE_PER_SLOT = 20;

// Summary Elements (Barber name removed from summary)
const sumDate = document.getElementById("sumDate");
const sumTime = document.getElementById("sumTime");

const menuButton = document.querySelector(".nvmn");
const menuPanel = document.querySelector("#menuPanel");
const menuClose = document.querySelector("#menuClose");


/* OPEN MENU */

menuButton.addEventListener("click", function(){

    menuPanel.classList.add("active");

});


/* CLOSE MENU */

menuClose.addEventListener("click", function(e){

    e.preventDefault();

    menuPanel.classList.remove("active");

});

/* ================= DATE SELECTOR ================= */
function createDateSelector(today) {
    const dateSelector = document.getElementById("dateSelector");
    if (!dateSelector) return;
    dateSelector.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const fullDate = `${year}-${month}-${day}`;

        let dayLabel = "";
        if (i === 0) {
            dayLabel = "TODAY";
        } else if (i === 1) {
            dayLabel = "TOMORROW";
        } else {
            dayLabel = date.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
        }

        const dateBox = document.createElement("div");
        dateBox.classList.add("date-box");
        dateBox.dataset.date = fullDate;
        dateBox.innerHTML = `
            <div class="day">${dayLabel}</div>
            <div class="date">${date.getDate()}</div>
            <div class="month">${date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}</div>
        `;

        dateBox.addEventListener("click", () => {
            document.querySelectorAll(".date-box").forEach(box => box.classList.remove("active"));
            dateBox.classList.add("active");
            selectedDate = fullDate;
            if (sumDate) sumDate.textContent = fullDate;
        });

        dateSelector.appendChild(dateBox);
    }
}
createDateSelector(new Date());

/* ================= BARBER SELECTION ================= */
const barberBoxes = document.querySelectorAll(".prsq");
if (barberBoxes.length > 0) {
    barberBoxes.forEach((box) => {
        box.addEventListener("click", () => {
            barberBoxes.forEach(item => item.classList.remove("active"));
            box.classList.add("active");
            selectedBarber = box.dataset.barber || "Barber";
        });
    });
}

/* ================= MULTIPLE TIME SLOT SELECTION ================= */
const bookingSlots = document.querySelectorAll(".bks");
const bookingAmountElem = document.getElementById("bookingAmount");

bookingSlots.forEach(box => {
    box.addEventListener("click", () => {
        if (box.classList.contains("booked")) return;

        box.classList.toggle("active");
        
        const selectedSlotElements = document.querySelectorAll(".bks.active");
        let slotTimes = [];
        selectedSlotElements.forEach(slot => {
            const timeText = slot.querySelector(".bkth");
            if (timeText) slotTimes.push(timeText.textContent.trim());
        });

        const totalPrice = slotTimes.length * PRICE_PER_SLOT;
        
        if (bookingAmountElem) {
            bookingAmountElem.textContent = `₹ ${totalPrice} /-`;
        }

        if (sumTime) {
            sumTime.textContent = slotTimes.length > 0 ? slotTimes.join(", ") : "None";
        }
    });
});

/* ================= POPUP 1: CUSTOMER DETAILS ================= */
const openCustomer = document.getElementById("openCustomer");
const customerPopup = document.getElementById("customerPopup");
const customerClose = document.getElementById("customerClose");

if (openCustomer && customerPopup) {
    openCustomer.addEventListener("click", () => {
        const selectedSlotsCount = document.querySelectorAll(".bks.active").length;
        
        if (!selectedDate) return alert("Please select a date first.");
        if (selectedSlotsCount === 0) return alert("Please select at least one time slot first.");

        customerPopup.style.display = "flex";
        document.body.style.overflow = "hidden";
    });
}

const closeCustomerPopup = () => {
    if (customerPopup) {
        customerPopup.style.display = "none";
        document.body.style.overflow = "";
    }
};

if (customerClose) customerClose.addEventListener("click", closeCustomerPopup);

/* ================= NEXT TO PAYMENT POPUP ================= */
const nextToPaymentBtn = document.getElementById("nextToPaymentBtn");
const paymentPopup = document.getElementById("paymentPopup");
const paymentClose = document.getElementById("paymentClose");

if (nextToPaymentBtn) {
    nextToPaymentBtn.addEventListener("click", () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();

        if (!name || !email || !mobile) return alert("Please fill all customer details.");
        if (!/^[0-9]{10}$/.test(mobile)) return alert("Please enter a valid 10-digit mobile number.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Please enter a valid email address.");

        customerPopup.style.display = "none";
        paymentPopup.style.display = "flex";
    });
}

const closePaymentPopup = () => {
    if (paymentPopup) {
        paymentPopup.style.display = "none";
        document.body.style.overflow = "";
    }
};

if (paymentClose) paymentClose.addEventListener("click", closePaymentPopup);

/* ================= PAYMENT METHOD SELECTION ================= */
const paymentOptions = document.querySelectorAll(".bkpm");
paymentOptions.forEach(option => {
    option.addEventListener("click", () => {
        paymentOptions.forEach(item => item.classList.remove("selected"));
        option.classList.add("selected");
        selectedPayment = option.dataset.payment;
    });
});

/* ================= FINAL CONFIRM & PAY BUTTON ================= */
const payBtn = document.getElementById("payBtn");
if (payBtn) {
    payBtn.addEventListener("click", () => {
        if (!selectedPayment) return alert("Please select a payment method.");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();

        const selectedSlotElements = document.querySelectorAll(".bks.active");
        let slotTimes = [];
        
        selectedSlotElements.forEach(slot => {
            const timeText = slot.querySelector(".bkth");
            if (timeText) slotTimes.push(timeText.textContent.trim());

            slot.classList.remove("active");
            slot.classList.add("booked");
            const pTag = slot.querySelector(".bkp");
            if (pTag) pTag.textContent = "NOT AVAILABLE";
        });

        const totalPrice = slotTimes.length * PRICE_PER_SLOT;

        const message = `
🎉 *BOOKING CONFIRMATION*
👤 Name: ${name}
📧 Email: ${email}
📱 Mobile: ${mobile}
✂️ Barber: ${selectedBarber}
📅 Date: ${selectedDate}
⏰ Time Slots: ${slotTimes.join(", ")}
💳 Payment: ${selectedPayment}
💰 Total Amount: ₹${totalPrice}
✅ Booking request received.
Thank you for booking with us ❤️
        `.trim();
confirmBookingBtn
        window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`, "_blank");

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent("Booking Confirmation - BarberStudio")}&body=${encodeURIComponent(message)}`;
        window.open(mailtoLink, "_blank");

        closePaymentPopup();
        if (bookingAmountElem) bookingAmountElem.textContent = "₹ 0 /-";
        if (sumTime) sumTime.textContent = "None";

        alert("Booking Confirmed Successfully!");
    });
}

// = = = = = = = = = = = = = = = 
//    SPECIAL SERVICE 
// = = = = = = = = = = = = = = =
 const tabs = document.querySelectorAll('.nav-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Bottom Navigation Switching
        function switchNav(element) {
            const navItems = document.querySelectorAll('.bottom-nav .nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }

        // Add to Bag Click Handler
        function addToBag(productName) {
            alert(productName + " bag me add kar diya gaya hai! 🛍️");
        }


        // Agar aapke paas ek se zyada divs hain (jaise slots ya boxes)
        const boxes = document.querySelectorAll('.banner-card'); // Yahan apne div ki class ya id dalein
            boxes.forEach(box => {
            box.addEventListener('click', () => {
                // Agar aap chahte hain ki sirf ek hi div par boundary rahe (baaki se hat jaye):
                boxes.forEach(item => item.classList.remove('border-active'));
                
                // Click kiye gaye div par boundary add ho jayegi
                box.classList.add('border-active');
            });
        });
        // Banner Click par Form Open karne ke liye
        const bannerCards = document.querySelectorAll('.banner-card');
        const formPopup = document.getElementById('formPopup');
        const formClose = document.getElementById('formClose');
        
        bannerCards.forEach(card => {
            card.addEventListener('click', () => {
                // Banner par click hone par boundary/active class bhi lag jayegi
                bannerCards.forEach(item => item.classList.remove('border-active'));
                card.classList.add('border-active');
        
                // Form popup open hoga
                if (formPopup) {
                    formPopup.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Form Close karne ke liye
        if (formClose) {
            formClose.addEventListener('click', () => {
                formPopup.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        const menuCircle = document.querySelector('.menu-circle');
const menuPageContainer = document.getElementById('menuPageContainer');

if (menuCircle && menuPageContainer) {
    menuCircle.style.cursor = "pointer"; // Cursor pointer dikhane ke liye
    
    menuCircle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle display block/none
        if (menuPageContainer.style.display === "none" || menuPageContainer.style.display === "") {
            menuPageContainer.style.display = "block";
        } else {
            menuPageContainer.style.display = "none";
        }
    });

    // Screen par kahin aur click karne par menu band ho jaye
    document.addEventListener('click', (e) => {
        if (!menuPageContainer.contains(e.target) && !menuCircle.contains(e.target)) {
            menuPageContainer.style.display = "none";
        }
    });
}

/* =========================================================
   360° INTERACTIVE FRAME SEQUENCE (SWIPE UP / DOWN TO ROTATE)
========================================================= */
(function init360FrameSequence() {
    const TOTAL_FRAMES = 240;
    const canvas = document.getElementById("frameCanvas");
    const canvasWrapper = document.getElementById("canvasWrapper");
    const track = document.getElementById("frameSequenceTrack");
    const playerCard = document.getElementById("framePlayerCard");
    const angleBadge = document.getElementById("angleBadge");
    const scrubProgress = document.getElementById("scrubProgress");
    const scrubTimeline = document.getElementById("scrubTimeline");
    const viewTag = document.getElementById("viewTag");
    const frameCount = document.getElementById("frameCount");
    const activeFrameImg = document.getElementById("activeFrameImg");
    const swipeHint = document.getElementById("swipeGestureHint");
    const autoSpinBtn = document.getElementById("autoSpinBtn");

    if (!canvas || !track || !playerCard) return;

    const ctx = canvas.getContext("2d");
    const frameImages = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let currentFrame = 1;
    let targetFrame = 1;
    let isAutoSpinning = false;
    let isTouching = false;
    let isMouseDown = false;

    // Helper to get image path for frame number 1..240
    function getFrameSrc(index) {
        const numStr = String(index).padStart(3, "0");
        return `gemini_generated_video_cc4975bd_frames/frame_${numStr}.jpg`;
    }

    // Load a single frame into memory
    function loadSingleFrame(frameNum, onLoaded) {
        const idx = frameNum - 1;
        if (frameImages[idx]) {
            if (frameImages[idx].complete && onLoaded) onLoaded(frameImages[idx]);
            return frameImages[idx];
        }
        const img = new Image();
        img.src = getFrameSrc(frameNum);
        img.onload = () => {
            frameImages[idx] = img;
            loadedCount++;
            if (onLoaded) onLoaded(img);
            if (Math.round(currentFrame) === frameNum) {
                renderCurrentFrameOnCanvas(img);
            }
        };
        frameImages[idx] = img;
        return img;
    }

    // Set canvas dimensions matching wrapper
    function resizeCanvas() {
        if (!canvasWrapper) return;
        const rect = canvasWrapper.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = rect.width || 400;
        const h = rect.height || (w * (10 / 16));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        drawFrame(Math.round(currentFrame));
    }

    // Find nearest already loaded frame to avoid any blank flicker
    function findNearestLoadedFrame(idx) {
        if (frameImages[idx] && frameImages[idx].complete && frameImages[idx].naturalWidth > 0) {
            return frameImages[idx];
        }
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const prev = (idx - offset + TOTAL_FRAMES) % TOTAL_FRAMES;
            const next = (idx + offset) % TOTAL_FRAMES;
            if (frameImages[prev] && frameImages[prev].complete && frameImages[prev].naturalWidth > 0) {
                return frameImages[prev];
            }
            if (frameImages[next] && frameImages[next].complete && frameImages[next].naturalWidth > 0) {
                return frameImages[next];
            }
        }
        return null;
    }

    // Draw the image directly on canvas
    function renderCurrentFrameOnCanvas(img) {
        if (!ctx || !img || !img.complete || img.naturalWidth === 0 || canvas.width === 0) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Draw frame onto canvas and update UI tags
    function drawFrame(frameNum) {
        let clamped = Math.round(frameNum);
        while (clamped > TOTAL_FRAMES) clamped -= TOTAL_FRAMES;
        while (clamped < 1) clamped += TOTAL_FRAMES;

        const idx = clamped - 1;
        const currentSrc = getFrameSrc(clamped);

        // Ensure current and neighboring frames are requested
        loadSingleFrame(clamped);
        const nextNeighbour = (clamped % TOTAL_FRAMES) + 1;
        const prevNeighbour = clamped > 1 ? clamped - 1 : TOTAL_FRAMES;
        if (!frameImages[nextNeighbour - 1]) loadSingleFrame(nextNeighbour);
        if (!frameImages[prevNeighbour - 1]) loadSingleFrame(prevNeighbour);

        // Update fallback image src
        if (activeFrameImg && activeFrameImg.getAttribute("src") !== currentSrc) {
            activeFrameImg.src = currentSrc;
        }

        // Draw onto canvas
        const imgToRender = findNearestLoadedFrame(idx);
        if (imgToRender) {
            renderCurrentFrameOnCanvas(imgToRender);
        }

        // Update UI Badges & Progress
        const progressRatio = (clamped - 1) / (TOTAL_FRAMES - 1);
        const angle = Math.round(progressRatio * 360);
        if (angleBadge) angleBadge.textContent = `${angle}°`;
        if (scrubProgress) scrubProgress.style.width = `${progressRatio * 100}%`;
        if (frameCount) frameCount.textContent = `FRAME ${clamped} / ${TOTAL_FRAMES}`;

        if (viewTag) {
            let label = "FRONT PROFILE";
            if (angle >= 40 && angle < 140) label = "RIGHT SIDE FADE";
            else if (angle >= 140 && angle < 220) label = "BACK TAPER & TEXTURE";
            else if (angle >= 220 && angle < 320) label = "LEFT SIDE FADE";
            else label = "FRONT PROFILE";
            viewTag.textContent = label;
        }
    }

    // Step 1: Immediately load Frame 1
    loadSingleFrame(1, () => {
        resizeCanvas();
        drawFrame(1);
    });

    // Step 2: Progressive preloading (Keyframes first, then all remaining)
    function preloadAllFramesProgressively() {
        // Priority 1: Keyframes distributed every 6 frames (~40 frames cover full 360)
        for (let i = 1; i <= TOTAL_FRAMES; i += 6) {
            loadSingleFrame(i);
        }

        // Priority 2: All remaining frames in idle time
        let currentLoadIndex = 2;
        function loadNextBatch() {
            let count = 0;
            while (currentLoadIndex <= TOTAL_FRAMES && count < 4) {
                if (!frameImages[currentLoadIndex - 1]) {
                    loadSingleFrame(currentLoadIndex);
                    count++;
                }
                currentLoadIndex++;
            }
            if (currentLoadIndex <= TOTAL_FRAMES) {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(loadNextBatch, { timeout: 150 });
                } else {
                    setTimeout(loadNextBatch, 50);
                }
            }
        }
        setTimeout(loadNextBatch, 200);
    }
    preloadAllFramesProgressively();

    // Step 3: Smooth rendering loop
    function renderLoop() {
        if (isAutoSpinning) {
            targetFrame += 0.5;
            if (targetFrame > TOTAL_FRAMES) targetFrame = 1;
        }

        let diff = targetFrame - currentFrame;
        // Circular shortest path interpolation
        if (diff > TOTAL_FRAMES / 2) diff -= TOTAL_FRAMES;
        if (diff < -TOTAL_FRAMES / 2) diff += TOTAL_FRAMES;

        if (Math.abs(diff) > 0.04) {
            currentFrame += diff * 0.35;
            while (currentFrame > TOTAL_FRAMES) currentFrame -= TOTAL_FRAMES;
            while (currentFrame < 1) currentFrame += TOTAL_FRAMES;
            drawFrame(currentFrame);
        }

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    function dismissHint() {
        if (swipeHint) {
            swipeHint.style.opacity = "0";
            swipeHint.style.transform = "translateX(-50%) translateY(10px)";
        }
    }

    // Step 4: Touch events (Swipe UP / DOWN / LEFT / RIGHT)
    let touchStartY = 0;
    let touchStartX = 0;
    let startFrameOnTouch = 1;

    playerCard.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isTouching = true;
            isAutoSpinning = false;
            updateAutoSpinButton();
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            startFrameOnTouch = currentFrame;
            dismissHint();
        }
    }, { passive: true });

    playerCard.addEventListener("touchmove", (e) => {
        if (!isTouching || e.touches.length !== 1) return;
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;

        // Moving finger UP gives positive deltaY (swipe up -> forward)
        // Moving finger DOWN gives negative deltaY (swipe down -> backward)
        const deltaY = touchStartY - currentY;
        const deltaX = touchStartX - currentX;

        // Choose dominant swipe direction
        const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;

        if (Math.abs(delta) > 3) {
            if (e.cancelable) e.preventDefault();

            // Sensitivity: ~0.65 frames per pixel
            let newFrame = startFrameOnTouch + delta * 0.65;
            while (newFrame > TOTAL_FRAMES) newFrame -= TOTAL_FRAMES;
            while (newFrame < 1) newFrame += TOTAL_FRAMES;
            targetFrame = newFrame;
        }
    }, { passive: false });

    playerCard.addEventListener("touchend", () => {
        isTouching = false;
    });
    playerCard.addEventListener("touchcancel", () => {
        isTouching = false;
    });

    // Step 5: Desktop Mouse Drag (Drag Up/Down to Rotate)
    let mouseStartY = 0;
    let mouseStartX = 0;
    let startFrameOnMouse = 1;

    playerCard.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        isAutoSpinning = false;
        updateAutoSpinButton();
        mouseStartY = e.clientY;
        mouseStartX = e.clientX;
        startFrameOnMouse = currentFrame;
        playerCard.style.cursor = "grabbing";
        dismissHint();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        const deltaY = mouseStartY - e.clientY; // Up = forward
        const deltaX = mouseStartX - e.clientX;
        const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;

        let newFrame = startFrameOnMouse + delta * 0.75;
        while (newFrame > TOTAL_FRAMES) newFrame -= TOTAL_FRAMES;
        while (newFrame < 1) newFrame += TOTAL_FRAMES;
        targetFrame = newFrame;
    });

    window.addEventListener("mouseup", () => {
        if (isMouseDown) {
            isMouseDown = false;
            playerCard.style.cursor = "grab";
        }
    });

    // Step 6: Desktop Mouse Wheel / Trackpad Scroll on Card
    playerCard.addEventListener("wheel", (e) => {
        e.preventDefault();
        isAutoSpinning = false;
        updateAutoSpinButton();
        dismissHint();

        const delta = e.deltaY || e.deltaX;
        let newFrame = targetFrame + (delta > 0 ? 3 : -3);
        while (newFrame > TOTAL_FRAMES) newFrame -= TOTAL_FRAMES;
        while (newFrame < 1) newFrame += TOTAL_FRAMES;
        targetFrame = newFrame;
    }, { passive: false });

    // Step 7: Interactive Scrubber Timeline Seek
    if (scrubTimeline) {
        function scrubFromTimeline(e) {
            isAutoSpinning = false;
            updateAutoSpinButton();
            dismissHint();
            const rect = scrubTimeline.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
            const ratio = x / rect.width;
            targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + ratio * (TOTAL_FRAMES - 1))));
        }

        scrubTimeline.addEventListener("click", scrubFromTimeline);
        scrubTimeline.addEventListener("touchstart", scrubFromTimeline, { passive: true });
        scrubTimeline.addEventListener("touchmove", (e) => {
            if (e.cancelable) e.preventDefault();
            scrubFromTimeline(e);
        }, { passive: false });
    }

    // Step 8: Auto Spin Button
    function updateAutoSpinButton() {
        if (!autoSpinBtn) return;
        if (isAutoSpinning) {
            autoSpinBtn.classList.add("active");
            autoSpinBtn.setAttribute("title", "Pause 360 Spin");
        } else {
            autoSpinBtn.classList.remove("active");
            autoSpinBtn.setAttribute("title", "Auto 360 Spin");
        }
    }

    if (autoSpinBtn) {
        autoSpinBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            isAutoSpinning = !isAutoSpinning;
            updateAutoSpinButton();
            dismissHint();
        });
    }

    // Step 9: Sticky Track Page Scroll Interaction
    function onScrollUpdate() {
        if (isTouching || isMouseDown) return; // Prioritize manual direct drag

        const rect = track.getBoundingClientRect();
        const trackHeight = track.offsetHeight;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        const startStickyTop = 90;
        const scrollRunway = trackHeight - viewportHeight * 0.7;

        if (scrollRunway <= 0) return;

        const scrollProgress = (startStickyTop - rect.top) / scrollRunway;
        if (scrollProgress >= 0 && scrollProgress <= 1) {
            targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + scrollProgress * (TOTAL_FRAMES - 1))));
            dismissHint();
        }
    }

    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    document.addEventListener("scroll", onScrollUpdate, { passive: true });
    const mobileContainer = document.querySelector(".mobile-container");
    if (mobileContainer) {
        mobileContainer.addEventListener("scroll", onScrollUpdate, { passive: true });
    }

    window.addEventListener("resize", () => {
        resizeCanvas();
        onScrollUpdate();
    });

    setTimeout(() => {
        resizeCanvas();
        drawFrame(1);
    }, 80);
})();

/* =========================================================
   NON-STOP CONTINUOUS AUTOPLAY VIDEO (NO PAUSE, NEVER STOPS)
========================================================= */
(function initNonStopAutoplayVideo() {
    const autoVideo = document.getElementById("autoPlayVideo");
    if (!autoVideo) return;

    // Strict non-stop autoplay & infinite loop configurations
    autoVideo.muted = true;
    autoVideo.defaultMuted = true;
    autoVideo.volume = 0;
    autoVideo.playsInline = true;
    autoVideo.loop = true;
    autoVideo.autoplay = true;
    autoVideo.setAttribute("muted", "");
    autoVideo.setAttribute("playsinline", "");
    autoVideo.setAttribute("webkit-playsinline", "");
    autoVideo.setAttribute("loop", "");
    autoVideo.setAttribute("autoplay", "");
    autoVideo.removeAttribute("controls");

    // Force play helper
    const guaranteePlay = () => {
        if (autoVideo.paused || autoVideo.ended) {
            const playPromise = autoVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        }
    };

    // If browser emits pause for any reason, immediately resume playing
    autoVideo.addEventListener("pause", () => {
        setTimeout(guaranteePlay, 10);
    });

    // If ended event fires, reset to start and loop seamlessly
    autoVideo.addEventListener("ended", () => {
        autoVideo.currentTime = 0;
        guaranteePlay();
    });

    // When media data is ready, trigger playback immediately
    autoVideo.addEventListener("loadedmetadata", guaranteePlay);
    autoVideo.addEventListener("loadeddata", guaranteePlay);
    autoVideo.addEventListener("canplay", guaranteePlay);
    autoVideo.addEventListener("canplaythrough", guaranteePlay);

    // If user switches back to this tab, keep video playing
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            guaranteePlay();
        }
    });
    window.addEventListener("focus", guaranteePlay);

    // Start playing immediately on script execution
    guaranteePlay();

    // Ensure playback triggers on first user interaction if blocked by strict browser policy
    const userInteractions = ["touchstart", "touchend", "click", "scroll", "keydown", "wheel", "pointerdown"];
    userInteractions.forEach(event => {
        window.addEventListener(event, guaranteePlay, { passive: true });
        document.addEventListener(event, guaranteePlay, { passive: true });
    });

    const shield = document.querySelector(".video-touch-shield");
    if (shield) {
        shield.addEventListener("click", guaranteePlay);
        shield.addEventListener("touchstart", guaranteePlay, { passive: true });
    }

    // Background interval watchdog: checks every 200ms that video is NEVER paused or stopped
    setInterval(guaranteePlay, 200);
})();