const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Function to create a simple icon
function generateIcon() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);
  
  // Draw a medicine cabinet icon
  ctx.fillStyle = '#8b5a2b';  // Wood color
  ctx.fillRect(100, 80, 312, 352);  // Cabinet body
  
  // Cabinet doors
  ctx.fillStyle = '#5a3921';
  ctx.fillRect(110, 90, 145, 332);  // Left door
  ctx.fillRect(265, 90, 137, 332);  // Right door
  
  // Door handles
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(240, 256, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(272, 256, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Medicine bottles
  // Bottle 1
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(140, 120, 40, 80);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(145, 110, 30, 15);
  
  // Bottle 2
  ctx.fillStyle = '#3498db';
  ctx.fillRect(200, 130, 40, 80);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(205, 120, 30, 15);
  
  // Bottle 3
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(320, 140, 40, 80);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(325, 130, 30, 15);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('MedTrack', 256, 460);
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  
  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets', { recursive: true });
  }
  
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon.png'), buffer);
  console.log('Icon generated successfully!');
}

generateIcon();
