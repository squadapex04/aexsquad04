<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('home-btn');
    const dropdownNav = document.getElementById('dropdown-nav');

    // Toggle dropdown visibility
    homeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdownNav.classList.toggle('hidden');
        
        // Add active style to home button
        if(dropdownNav.classList.contains('hidden')){
            homeBtn.style.color = 'var(--text-dark)';
            homeBtn.style.backgroundColor = 'transparent';
        } else {
            homeBtn.style.color = 'var(--primary-color)';
            homeBtn.style.backgroundColor = 'rgba(46, 125, 50, 0.1)';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!homeBtn.contains(e.target) && !dropdownNav.contains(e.target)) {
            dropdownNav.classList.add('hidden');
            homeBtn.style.color = 'var(--text-dark)';
            homeBtn.style.backgroundColor = 'transparent';
        }
    });

    // Prevent closing when clicking inside the dropdown
    dropdownNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // -- Falling Leaves Animation Logic --
    const mainContent = document.querySelector('.main-content');
    const leafColors = ['#4CAF50', '#8BC34A', '#2E7D32', '#AED581'];
    
    function createLeaf() {
        const leaf = document.createElement('i');
        leaf.className = 'fa-solid fa-leaf falling-leaf';
        
        const size = Math.random() * 10 + 10; // 10px to 20px
        
        // Spawn from left tree or right tree canopies
        const isLeftTree = Math.random() > 0.5;
        const leftPosition = isLeftTree ? (Math.random() * 15 + 4) : (Math.random() * 15 + 81);
        
        // Vertical spawn fixed to tree canopy height from ground
        const startingBottom = Math.random() * 100 + 150; // 150px to 250px from bottom
        
        const animationDuration = Math.random() * 3 + 4; // 4s to 7s
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];
        const startDelay = Math.random() * 1;
        
        leaf.style.fontSize = `${size}px`;
        leaf.style.left = `${leftPosition}vw`;
        leaf.style.bottom = `${startingBottom}px`;
        leaf.style.color = color;
        leaf.style.animationDuration = `${animationDuration}s`;
        leaf.style.animationDelay = `${startDelay}s`;
        
        mainContent.appendChild(leaf);
        
        setTimeout(() => {
            leaf.remove();
        }, (animationDuration + startDelay) * 1000);
    }
    
    // Create leaves periodically
    setInterval(createLeaf, 350);
    
    // Init initial batch
    for(let i=0; i<10; i++) {
        createLeaf();
    }
=======
const leavesContainer = document.getElementById('leaves-container');

// Leaf color palette: Autumn & Green tones to make it pop over the bright sky
const leafColors = ['#FFD700', '#FFA500', '#FF4500', '#8FBC8F', '#2E8B57', '#e74c3c'];

function spawnLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('falling-leaf');
    
    // Starting X position anywhere on top width
    const startX = Math.random() * window.innerWidth;
    leaf.style.left = startX + 'px';
    
    // Custom Properties for each leaf
    const scale = Math.random() * 0.5 + 0.3; // between 0.3x to 0.8x
    const duration = Math.random() * 5 + 4; // 4s to 9s fall time
    const color = leafColors[Math.floor(Math.random() * leafColors.length)];
    
    leaf.style.background = color;
    
    // Sway offsets (px) - randomized
    const swayBase = Math.random() * 120 + 30; 
    const dir = Math.random() > 0.5 ? 1 : -1;
    
    leaf.style.setProperty('--scale', scale);
    leaf.style.setProperty('--duration', duration + 's');
    
    // Create random sways for a realistic flutter using CSS vars
    leaf.style.setProperty('--sway1', `${dir * swayBase}px`);
    leaf.style.setProperty('--sway2', `${-dir * swayBase * 0.7}px`);
    leaf.style.setProperty('--sway3', `${dir * swayBase * 1.3}px`);
    leaf.style.setProperty('--sway4', `${-dir * swayBase}px`);
    
    leavesContainer.appendChild(leaf);
    
    // Performance: Remove element after animation finishes
    setTimeout(() => {
        if(leaf.parentNode) {
            leaf.parentNode.removeChild(leaf);
        }
    }, duration * 1000);
}

// Start with a burst of leaves so the screen isn't empty
for(let i = 0; i < 20; i++) {
    setTimeout(spawnLeaf, Math.random() * 4000);
}

// Continuous natural leaf spawning
setInterval(spawnLeaf, 350);

// --- Calculator Logic ---

document.getElementById('calculate-btn').addEventListener('click', () => {
    // Get values from inputs
    const miles = parseFloat(document.getElementById('miles').value) || 0;
    const flights = parseFloat(document.getElementById('flights').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const gas = parseFloat(document.getElementById('gas').value) || 0;
    const meat = parseFloat(document.getElementById('meat').value) || 0;
    const recycling = document.getElementById('recycling').value;

    // Calculate CO2e (Very rough estimation models for UI demonstration)
    // 1 mile driven ~ 0.0004 tons CO2 | scaled up for a whole year * 52
    let transportCO2 = (miles * 52 * 0.0004) + (flights * 0.5);
    
    // 1 kWh ~ 0.0004 tons | scaled up * 12
    let energyCO2 = (electricity * 12 * 0.0004) + (gas * 12 * 0.005);
    
    // Average baseline diet footprint offset by meat consumption
    let dietCO2 = (meat * 52 * 0.003) + 1.5; 
    
    let totalScore = transportCO2 + energyCO2 + dietCO2;
    
    // Slight reduction for recycling
    if (recycling === 'yes') {
        totalScore -= 0.5;
    }
    
    totalScore = Math.max(0, totalScore);

    // Elements for result updating
    const resultBox = document.getElementById('result-box');
    const resultNum = document.getElementById('co2-result');
    const suggestionMsg = document.getElementById('co2-suggestion');
    
    resultBox.classList.add('active');
    
    // Counting animation for dynamic effect
    let start = 0;
    const durationAnim = 1500;
    const startTime = performance.now();
    
    function animateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationAnim, 1);
        
        // easeOutQuart easing function for dramatic stop
        const ease = 1 - Math.pow(1 - progress, 4);
        resultNum.textContent = (totalScore * ease).toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(animateCount);
        } else {
            resultNum.textContent = totalScore.toFixed(1);
        }
    }
    requestAnimationFrame(animateCount);

    // Generate smart suggestion based on score bounds
    if (totalScore < 5) {
        suggestionMsg.innerHTML = "<strong>Excellent!</strong> Your footprint is well below average. Keep maintaining your sustainable lifestyle and inspire others!";
        resultBox.style.borderColor = "#10B981"; // Emerald
        document.querySelector('.result-box .score span:first-child').style.color = "#10B981";
    } else if (totalScore < 12) {
        suggestionMsg.innerHTML = "<strong>Average Impact.</strong> You are around the national average. Try reducing your meat consumption or analyzing your driving habits to lower it further.";
        resultBox.style.borderColor = "#F59E0B"; // Amber
        document.querySelector('.result-box .score span:first-child').style.color = "#F59E0B";
    } else {
        suggestionMsg.innerHTML = "<strong>High Impact!</strong> Your footprint is significantly above average. Consider drastically cutting down flights, carpooling, or exploring renewable energy sources for your home.";
        resultBox.style.borderColor = "#EF4444"; // Red
        document.querySelector('.result-box .score span:first-child').style.color = "#EF4444";
    }
    
    // Smooth scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
>>>>>>> badb4cd (first commit with fronted first page)
});

// --- Analytics Animation Logic ---
const statsSection = document.getElementById('analytics');
const statNumbers = document.querySelectorAll('.stat-number');
const barFills = document.querySelectorAll('.bar-fill');
let analyticsAnimated = false;

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const analyticsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !analyticsAnimated) {
            analyticsAnimated = true;
            
            // Animate Numbers
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 60; // 60 frames roughly 1 sec
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.innerText = target.toLocaleString() + (target > 50000 ? "" : "+");
                    }
                };
                updateCounter();
            });

            // Animate Bars
            barFills.forEach(bar => {
                setTimeout(() => {
                    bar.classList.add('animate');
                }, 200);
            });
        }
    });
}, observerOptions);

if (statsSection) {
    analyticsObserver.observe(statsSection);
}
