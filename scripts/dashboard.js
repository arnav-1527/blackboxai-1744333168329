/**
 * MediTrack - Dashboard Script
 * Manages the 3D medicine visualization and inventory data
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for logged in status
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Display username
    const username = sessionStorage.getItem('username') || 'User';
    document.getElementById('usernameDisplay').textContent = `Welcome, ${username}`;

    // Initialize application components
    initializeMedicineData();
    setupEventListeners();
    initializeThreeJsScene();
    updateStatistics();

    // Simulate loading delay for more realistic experience
    setTimeout(() => {
        document.getElementById('medicineTableBody').innerHTML = '';
        renderMedicineTable();
    }, 1000);
});

// ===== MOCK DATA =====
let medicineInventory = [
    {
        id: 1,
        name: 'Amoxicillin',
        category: 'Antibiotics',
        uses: 'Treatment of bacterial infections including bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
        expiryDate: '2023-12-30',
        quantity: 120,
        color: 0x3498db,
        addedDate: '2023-05-15'
    },
    {
        id: 2,
        name: 'Ibuprofen',
        category: 'Analgesics',
        uses: 'Relief of pain, fever, and inflammation caused by conditions such as headache, toothache, back pain, arthritis, or menstrual cramps.',
        expiryDate: '2024-06-20',
        quantity: 85,
        color: 0xe74c3c,
        addedDate: '2023-06-22'
    },
    {
        id: 3,
        name: 'Cetirizine',
        category: 'Antihistamines',
        uses: 'Relief of symptoms of allergies, such as runny nose, sneezing, itching, watery eyes, or hives.',
        expiryDate: '2023-10-15',
        quantity: 30,
        color: 0x2ecc71,
        addedDate: '2023-07-05'
    },
    {
        id: 4,
        name: 'Vitamin D3',
        category: 'Vitamins',
        uses: 'Dietary supplement for bone health, immune system support, and calcium absorption.',
        expiryDate: '2025-01-10',
        quantity: 200,
        color: 0xf39c12,
        addedDate: '2023-08-12'
    },
    {
        id: 5,
        name: 'Loratadine',
        category: 'Antihistamines',
        uses: 'Relief of symptoms due to hay fever or other upper respiratory allergies.',
        expiryDate: '2024-03-18',
        quantity: 45,
        color: 0x9b59b6,
        addedDate: '2023-07-30'
    },
    {
        id: 6,
        name: 'Acetaminophen',
        category: 'Analgesics',
        uses: 'Temporary relief of pain and fever. Common for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
        expiryDate: '2024-05-20',
        quantity: 150,
        color: 0x1abc9c,
        addedDate: '2023-08-05'
    },
    {
        id: 7,
        name: 'Losartan',
        category: 'Prescription',
        uses: 'Treatment of high blood pressure and to help protect the kidneys from damage due to diabetes.',
        expiryDate: '2023-11-05',
        quantity: 10,
        color: 0xd35400,
        addedDate: '2023-06-10'
    },
    {
        id: 8,
        name: 'Metformin',
        category: 'Prescription',
        uses: 'Treatment of type 2 diabetes, particularly in patients who are overweight.',
        expiryDate: '2024-08-30',
        quantity: 60,
        color: 0x8e44ad,
        addedDate: '2023-08-18'
    },
    {
        id: 9,
        name: 'Aspirin',
        category: 'OTC',
        uses: 'Pain relief, fever reduction, and as an anti-inflammatory medication. Also used to reduce the risk of heart attacks and stroke.',
        expiryDate: '2024-02-15',
        quantity: 100,
        color: 0x27ae60,
        addedDate: '2023-07-25'
    },
    {
        id: 10,
        name: 'Oseltamivir',
        category: 'Antiviral',
        uses: 'Treatment and prevention of influenza A and influenza B (flu).',
        expiryDate: '2023-09-30',
        quantity: 5,
        color: 0xc0392b,
        addedDate: '2023-06-01'
    }
];

// ===== THREE.JS SCENE =====
let scene, camera, renderer, controls;
let medicines = [];
let selectedMedicine = null;

function initializeThreeJsScene() {
    // Get container dimensions
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);

    // Setup camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20); // Position camera in front of cabinet

    // Setup renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('medicine-visualizer'),
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Better lighting setup
    // Ambient light for overall scene visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Main directional light (like sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add some point lights to highlight shelves
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight2.position.set(-5, 0, 5);
    scene.add(pointLight2);

    // Add orbit controls with better defaults
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2; // Prevent going below the cabinet
    controls.minAzimuthAngle = -Math.PI / 4; // Limit rotation
    controls.maxAzimuthAngle = Math.PI / 4;
    
    // Create cabinet structure
    createCabinet();

    // Add medicine bottles organized on shelves
    createMedicineBottles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Add raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(medicines);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            highlightMedicine(selectedObject);
            showMedicineDetails(selectedObject.userData.medicineData);
        }
    });

    // Start animation loop
    animate();
}

// Cabinet structure
function createCabinet() {
    // Cabinet dimensions
    const cabinetWidth = 14;
    const cabinetHeight = 10;
    const cabinetDepth = 4;
    const shelfThickness = 0.2;
    const backThickness = 0.2;
    const sideThickness = 0.3;
    
    // Create cabinet frame
    const cabinetMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x5a3921, // Brown wood color
        shininess: 30 
    });
    
    // Back panel
    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(cabinetWidth, cabinetHeight, backThickness),
        cabinetMaterial
    );
    backPanel.position.set(0, 0, -cabinetDepth/2);
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    scene.add(backPanel);
    
    // Left side panel
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(sideThickness, cabinetHeight, cabinetDepth),
        cabinetMaterial
    );
    leftPanel.position.set(-cabinetWidth/2 + sideThickness/2, 0, 0);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    scene.add(leftPanel);
    
    // Right side panel
    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(sideThickness, cabinetHeight, cabinetDepth),
        cabinetMaterial
    );
    rightPanel.position.set(cabinetWidth/2 - sideThickness/2, 0, 0);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    scene.add(rightPanel);
    
    // Top panel
    const topPanel = new THREE.Mesh(
        new THREE.BoxGeometry(cabinetWidth, sideThickness, cabinetDepth),
        cabinetMaterial
    );
    topPanel.position.set(0, cabinetHeight/2 - sideThickness/2, 0);
    topPanel.castShadow = true;
    topPanel.receiveShadow = true;
    scene.add(topPanel);
    
    // Bottom panel
    const bottomPanel = new THREE.Mesh(
        new THREE.BoxGeometry(cabinetWidth, sideThickness, cabinetDepth),
        cabinetMaterial
    );
    bottomPanel.position.set(0, -cabinetHeight/2 + sideThickness/2, 0);
    bottomPanel.castShadow = true;
    bottomPanel.receiveShadow = true;
    scene.add(bottomPanel);
    
    // Create shelves - 3 shelves dividing the cabinet into 4 sections
    const shelfMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b5a2b, // Slightly lighter wood for shelves
        shininess: 40 
    });
    
    // Store shelf positions for medicine placement
    window.shelfPositions = [];
    
    const numShelves = 3;
    const shelfSpacing = (cabinetHeight - 2*sideThickness) / (numShelves + 1);
    
    for (let i = 0; i < numShelves; i++) {
        const yPos = -cabinetHeight/2 + sideThickness + shelfSpacing * (i + 1);
        
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(cabinetWidth - 2*sideThickness, shelfThickness, cabinetDepth - backThickness),
            shelfMaterial
        );
        shelf.position.set(0, yPos, backThickness/2);
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        scene.add(shelf);
        
        // Store shelf position for medicine placement
        window.shelfPositions.push(yPos + shelfThickness/2);
    }
    
    // Also store bottom and top positions
    window.shelfPositions.unshift(-cabinetHeight/2 + sideThickness + shelfThickness/2);
    window.shelfPositions.push(cabinetHeight/2 - sideThickness - shelfThickness/2);
    
    // Add category labels to each shelf
    addShelfLabels(window.shelfPositions, cabinetWidth, cabinetDepth);
}

// Add category labels to shelves
function addShelfLabels(shelfPositions, cabinetWidth, cabinetDepth) {
    const categories = [
        'Antibiotics & Antivirals',
        'Pain Relief & Fever',
        'Vitamins & Supplements',
        'Prescription Medications'
    ];
    
    categories.forEach((category, index) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        // Draw background with slightly transparent color
        context.fillStyle = 'rgba(240, 240, 240, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        context.strokeStyle = '#555555';
        context.lineWidth = 4;
        context.strokeRect(2, 2, canvas.width-4, canvas.height-4);
        
        // Draw text
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.fillText(category, canvas.width/2, canvas.height/2);
        
        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create label
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        
        // Position at left side of shelf
        label.position.set(-cabinetWidth/2 + 3.5, shelfPositions[index] + 0.3, cabinetDepth/2 - 0.1);
        label.scale.set(5, 1.25, 1);
        
        scene.add(label);
    });
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function createMedicineBottles() {
    // Clear existing medicines
    medicines.forEach(medicine => scene.remove(medicine));
    medicines = [];
    
    // Group medicines by category
    const medicinesByCategory = {
        'Antibiotics': [],
        'Antiviral': [],
        'Analgesics': [],
        'Vitamins': [],
        'Antihistamines': [],
        'Prescription': [],
        'OTC': []
    };
    
    // Sort by category
    medicineInventory.forEach(medicine => {
        if (medicinesByCategory[medicine.category]) {
            medicinesByCategory[medicine.category].push(medicine);
        } else {
            // Default to OTC if category not found
            medicinesByCategory['OTC'].push(medicine);
        }
    });
    
    // Shelf assignment for different categories
    const shelfAssignments = {
        'Antibiotics': 0,     // Bottom shelf
        'Antiviral': 0,       // Bottom shelf
        'Analgesics': 1,      // Second shelf
        'Antihistamines': 1,  // Second shelf
        'Vitamins': 2,        // Third shelf
        'OTC': 2,             // Third shelf
        'Prescription': 3     // Top shelf
    };
    
    // Cabinet dimensions to calculate positions
    const cabinetWidth = 13;
    
    // Create bottles for each category
    Object.keys(medicinesByCategory).forEach(category => {
        const medicines = medicinesByCategory[category];
        const shelfIndex = shelfAssignments[category];
        const shelfY = window.shelfPositions[shelfIndex];
        
        // Calculate layout on shelf
        const spacing = 1.5;
        const maxPerRow = Math.floor(cabinetWidth / spacing);
        const rows = Math.ceil(medicines.length / maxPerRow);
        
        medicines.forEach((medicine, index) => {
            const row = Math.floor(index / maxPerRow);
            const col = index % maxPerRow;
            
            // Calculate position
            const startX = -cabinetWidth/2 + spacing;
            const x = startX + col * spacing;
            const y = shelfY + 1; // Position on shelf
            const z = -2 + row * 1.5; // Position front to back
            
            // Calculate size based on quantity (min size 0.4, max size 0.8)
            const quantityScale = 0.4 + (medicine.quantity / 300);
            const size = Math.min(0.8, Math.max(0.4, quantityScale));
            
            // Create bottle with higher poly count for better look
            const geometry = new THREE.CylinderGeometry(size/2, size/2, size*2, 24);
            const material = new THREE.MeshPhongMaterial({ 
                color: medicine.color,
                shininess: 80,
                specular: 0x222222
            });
            
            const bottle = new THREE.Mesh(geometry, material);
            bottle.position.set(x, y, z);
            bottle.castShadow = true;
            bottle.receiveShadow = true;
            
            // Add cap
            const capGeometry = new THREE.CylinderGeometry(size/2, size/2, size/4, 24);
            const capMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                shininess: 100,
                specular: 0x444444
            });
            
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.position.y = size + size/8;
            cap.castShadow = true;
            bottle.add(cap);
            
            // Create improved label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 128;
            
            // Draw label background with rounded corners
            context.fillStyle = '#ffffff';
            roundRect(context, 0, 0, canvas.width, canvas.height, 15, true, false);
            
            // Add border
            context.strokeStyle = '#555555';
            context.lineWidth = 3;
            roundRect(context, 0, 0, canvas.width, canvas.height, 15, false, true);
            
            // Draw medicine name
            context.font = 'bold 28px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = '#000000';
            
            // Handle long names
            let displayName = medicine.name;
            if (context.measureText(displayName).width > 220) {
                displayName = displayName.substring(0, 10) + '...';
            }
            
            context.fillText(displayName, canvas.width/2, canvas.height/2 - 20);
            
            // Draw quantity
            context.font = '20px Arial';
            context.fillStyle = '#555555';
            context.fillText(`Qty: ${medicine.quantity}`, canvas.width/2, canvas.height/2 + 20);
            
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            
            // Create sprite material
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true
            });
            
            // Create sprite
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1.2, 0.6, 1);
            sprite.position.set(0, 0, size*0.51); // Position in front of bottle
            
            // Add sprite to bottle
            bottle.add(sprite);
        
            // Store reference to medicine data
            bottle.userData.medicineData = medicine;
            bottle.userData.originalColor = medicine.color;
            bottle.userData.originalPosition = bottle.position.clone();
            
            // Check if expiring soon and add animation
            const expiryDate = new Date(medicine.expiryDate);
            const today = new Date();
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(today.getMonth() + 1);
            
            if (expiryDate < oneMonthFromNow) {
                bottle.userData.isExpiringSoon = true;
                // Add to notification queue instead of immediate alert
                queueNotification(`Warning: ${medicine.name} is expiring soon!`);
            }
            
            if (medicine.quantity <= 10) {
                // Add to notification queue instead of immediate alert
                queueNotification(`Warning: Low stock for ${medicine.name}.`);
            }
            
            scene.add(bottle);
            medicines.push(bottle);
        });
    });
}

function highlightMedicine(bottle) {
    // Reset any previously selected medicine
    if (selectedMedicine && selectedMedicine !== bottle) {
        resetMedicineHighlight(selectedMedicine);
    }
    
    // Highlight the selected medicine
    selectedMedicine = bottle;
    
    // Make it "pop" by moving it up
    bottle.position.y += 1;
    
    // Change material to make it stand out
    bottle.material.emissive = new THREE.Color(0x555555);
    bottle.material.emissiveIntensity = 0.5;
    bottle.material.needsUpdate = true;
}

function resetMedicineHighlight(bottle) {
    // Reset position
    bottle.position.copy(bottle.userData.originalPosition);
    
    // Reset material
    bottle.material.emissive = new THREE.Color(0x000000);
    bottle.material.emissiveIntensity = 0;
    bottle.material.needsUpdate = true;
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle animations for expiring medicines
    medicines.forEach(medicine => {
        if (medicine.userData.isExpiringSoon) {
            medicine.rotation.y += 0.01;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// ===== MEDICINE DATA FUNCTIONS =====
function initializeMedicineData() {
    // Sort medicines by most recently added
    medicineInventory.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
}

function renderMedicineTable(filteredData = null) {
    const tableBody = document.getElementById('medicineTableBody');
    const dataToRender = filteredData || medicineInventory;
    
    if (dataToRender.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No medicines found
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = dataToRender.map(medicine => {
        const expiryDate = new Date(medicine.expiryDate);
        const today = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(today.getMonth() + 1);
        
        // Determine status class
        let statusClass = '';
        let statusText = '';
        
        if (expiryDate < today) {
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Expired';
        } else if (expiryDate < oneMonthFromNow) {
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Expiring Soon';
        } else if (medicine.quantity <= 10) {
            statusClass = 'bg-orange-100 text-orange-800';
            statusText = 'Low Stock';
        } else {
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Available';
        }
        
        // Format date for display
        const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Determine if row should have expiring-soon animation
        const rowClass = (expiryDate < oneMonthFromNow && expiryDate > today) ? 'expiring-soon' : '';
        
        return `
            <tr class="${rowClass}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${medicine.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedExpiryDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 view-details" data-id="${medicine.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-medicine" data-id="${medicine.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to the view and delete buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const medicineId = parseInt(button.getAttribute('data-id'));
            const medicine = medicineInventory.find(m => m.id === medicineId);
            showMedicineDetails(medicine);
        });
    });
    
    document.querySelectorAll('.delete-medicine').forEach(button => {
        button.addEventListener('click', () => {
            const medicineId = parseInt(button.getAttribute('data-id'));
            deleteMedicine(medicineId);
        });
    });
}

function showMedicineDetails(medicine) {
    const modal = document.getElementById('medicineDetailModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = medicine.name;
    
    // Format expiry date
    const expiryDate = new Date(medicine.expiryDate);
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Determine status
    let statusClass = '';
    let statusText = '';
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    if (expiryDate < today) {
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'Expired';
    } else if (expiryDate < oneMonthFromNow) {
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Expiring Soon';
    } else if (medicine.quantity <= 10) {
        statusClass = 'bg-orange-100 text-orange-800';
        statusText = 'Low Stock';
    } else {
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Available';
    }
    
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center space-x-2">
                <div class="h-6 w-6 rounded-full" style="background-color: #${medicine.color.toString(16).padStart(6, '0')}"></div>
                <h4 class="text-lg font-medium text-gray-900">${medicine.name}</h4>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Category</p>
                        <p class="mt-1 text-sm text-gray-900">${medicine.category}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Quantity</p>
                        <p class="mt-1 text-sm text-gray-900">${medicine.quantity} units</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Expiry Date</p>
                        <p class="mt-1 text-sm text-gray-900">${formattedExpiryDate}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Added Date</p>
                        <p class="mt-1 text-sm text-gray-900">${new Date(medicine.addedDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <p class="text-sm font-medium text-gray-500">Medical Uses</p>
                <p class="mt-1 text-sm text-gray-600">${medicine.uses}</p>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
                <p class="text-sm font-medium text-gray-500">Actions</p>
                <div class="mt-2 flex space-x-3">
                    <button class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onclick="deleteMedicine(${medicine.id})">
                        <i class="fas fa-trash-alt mr-1"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
}

// Delete medicine function
function deleteMedicine(medicineId) {
    // Find the medicine to delete
    const medicineToDelete = medicineInventory.find(medicine => medicine.id === medicineId);
    
    // Filter out the medicine with the specified ID
    medicineInventory = medicineInventory.filter(medicine => medicine.id !== medicineId);
    
    // Notify user of successful deletion
    queueNotification(`${medicineToDelete.name} has been removed from your inventory.`);
    
    // Update the table and 3D scene
    renderMedicineTable();
    createMedicineBottles();
    updateStatistics();
    
    // Close modal if open
    document.getElementById('medicineDetailModal').classList.add('hidden');
    
    // Reset selected medicine
    if (selectedMedicine && selectedMedicine.userData.medicineData.id === medicineId) {
        selectedMedicine = null;
    }
}

// Add medicine function
function addMedicine(formData) {
    // Generate a new unique ID
    const newId = Math.max(...medicineInventory.map(m => m.id), 0) + 1;
    
    // Generate a random color
    const randomColor = Math.floor(Math.random() * 0xffffff);
    
    // Create new medicine object
    const newMedicine = {
        id: newId,
        name: formData.get('medicineName'),
        category: formData.get('medicineCategory'),
        uses: formData.get('medicineUses'),
        expiryDate: formData.get('medicineExpiry'),
        quantity: parseInt(formData.get('medicineQuantity')),
        color: randomColor,
        addedDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to inventory
    medicineInventory.unshift(newMedicine);
    
    // Notify user of successful addition
    queueNotification(`${newMedicine.name} has been added to your inventory.`);
    
    // Update UI
    renderMedicineTable();
    createMedicineBottles();
    updateStatistics();
    updateRecentlyAdded();
    
    // Close the modal
    document.getElementById('addMedicineModal').classList.add('hidden');
}

function updateStatistics() {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    // Calculate statistics
    const totalMedicines = medicineInventory.length;
    
    const lowStock = medicineInventory.filter(medicine => 
        medicine.quantity <= 10 && new Date(medicine.expiryDate) > today
    ).length;
    
    const expiringSoon = medicineInventory.filter(medicine => 
        new Date(medicine.expiryDate) < oneMonthFromNow && 
        new Date(medicine.expiryDate) > today
    ).length;
    
    const available = medicineInventory.filter(medicine => 
        medicine.quantity > 10 && 
        new Date(medicine.expiryDate) >= oneMonthFromNow
    ).length;
    
    // Update the display
    document.getElementById('totalMedicines').textContent = totalMedicines;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('expiringSoonCount').textContent = expiringSoon;
    document.getElementById('availableCount').textContent = available;
    
    // Update recently added list
    updateRecentlyAdded();
}

function updateRecentlyAdded() {
    const recentlyAddedList = document.getElementById('recentlyAddedList');
    const recentMedicines = medicineInventory.slice(0, 5);
    
    if (recentMedicines.length === 0) {
        recentlyAddedList.innerHTML = `
            <div class="text-gray-500 text-sm text-center py-4">No medicines added yet</div>
        `;
        return;
    }
    
    recentlyAddedList.innerHTML = recentMedicines.map(medicine => {
        return `
            <div class="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <div class="h-5 w-5 rounded-full mr-2" style="background-color: #${medicine.color.toString(16).padStart(6, '0')}"></div>
                <div class="flex-grow">
                    <p class="text-sm font-medium text-gray-900">${medicine.name}</p>
                    <p class="text-xs text-gray-500">${new Date(medicine.addedDate).toLocaleDateString()}</p>
                </div>
                <div class="text-xs text-gray-500">${medicine.quantity} units</div>
            </div>
        `;
    }).join('');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.href = 'index.html';
    });
    
    // Close modal buttons
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('medicineDetailModal').classList.add('hidden');
        
        // Reset highlighted medicine
        if (selectedMedicine) {
            resetMedicineHighlight(selectedMedicine);
            selectedMedicine = null;
        }
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('medicineDetailModal').classList.add('hidden');
        
        // Reset highlighted medicine
        if (selectedMedicine) {
            resetMedicineHighlight(selectedMedicine);
            selectedMedicine = null;
        }
    });
    
    // Add medicine modal
    document.getElementById('addMedicineBtn').addEventListener('click', () => {
        document.getElementById('addMedicineModal').classList.remove('hidden');
    });
    
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.getElementById('addMedicineModal').classList.add('hidden');
    });
    
    // Add medicine form submission
    document.getElementById('addMedicineForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        addMedicine(formData);
        event.target.reset();
    });
    
    // Search functionality
    document.getElementById('searchMedicine').addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        if (!searchTerm) {
            renderMedicineTable();
            return;
        }
        
        const filteredData = medicineInventory.filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.category.toLowerCase().includes(searchTerm) ||
            medicine.uses.toLowerCase().includes(searchTerm)
        );
        
        renderMedicineTable(filteredData);
    });
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        renderMedicineTable();
        createMedicineBottles();
        updateStatistics();
    });
}
