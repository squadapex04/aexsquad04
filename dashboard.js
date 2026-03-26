document.addEventListener("DOMContentLoaded", () => {
    // Add simple entrance animation to chart bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const targetHeight = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.height = targetHeight;
            bar.style.transition = 'height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 800 + (index * 100)); // Staggered animation
    });

    // Sidebar active state toggle
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if(!this.querySelector('.logout-btn')) { // prevent default only for menu links
                e.preventDefault();
                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

<<<<<<< HEAD
=======
<<<<<<< HEAD
    // Mock live backend telemetry for Carbon Footprint view
    setInterval(() => {
        const feed = document.getElementById('live-carbon-feed');
        const viewNode = document.getElementById('view-carbon-footprint');
        
        if (feed && viewNode && viewNode.style.display === 'block') {
            // simulate a live fluctuation from a real-world IoT sensor API
            const base = 12.0;
            const variance = Math.random() * 0.99;
            feed.innerHTML = (base + variance).toFixed(2) + ' kg';
        }
    }, 1500);
=======
>>>>>>> 6a98862 (Integrated Animated Landing Page, Real-Time Map Analytics, and completely Custom Node.js Email Authentication Backend)
    // Initialize Leaflet Map
    if(document.getElementById('impact-map')) {
        const map = L.map('impact-map').setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add dummy markers
        const markers = [
            { lat: -3.4653, lng: -62.2159, text: 'Planted 50 Trees in Amazon Rainforest' },
            { lat: 10.4234, lng: -14.234, text: 'Clean Ocean Initiative' },
            { lat: 35.6895, lng: 139.6917, text: 'Solar Panel Project' },
            { lat: 51.5074, lng: -0.1278, text: 'Urban Gardening Project' },
            { lat: -1.2921, lng: 36.8219, text: 'Wildlife Conservation Park' }
        ];

        // Custom Leaflet icon styling using FontAwesome tree
        const treeIcon = L.divIcon({
            html: '<i class="fa-solid fa-tree" style="color: #2ecc71; font-size: 24px;"></i>',
            className: 'custom-tree-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        markers.forEach(mk => {
            L.marker([mk.lat, mk.lng], { icon: treeIcon })
                .addTo(map)
                .bindPopup(`<strong>${mk.text}</strong>`);
        });
    }
<<<<<<< HEAD
=======
>>>>>>> 2d6af48 (Integrated Animated Landing Page, Real-Time Map Analytics, and completely Custom Node.js Email Authentication Backend)
>>>>>>> 6a98862 (Integrated Animated Landing Page, Real-Time Map Analytics, and completely Custom Node.js Email Authentication Backend)
});
