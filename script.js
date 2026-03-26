
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
});
