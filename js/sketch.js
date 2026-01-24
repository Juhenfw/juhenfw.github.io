// js/sketch.js - Neural Network Constellation

let particles = [];
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1'); 
    canvas.style('position', 'fixed'); 
    
    // OPTIMASI: Cek lebar layar
    let isMobile = windowWidth < 768;
    
    // Jika Mobile: 20 partikel saja. Desktop: Maksimal 60.
    let particleCount = isMobile ? 20 : 50; 

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // OPTIMASI FRAME RATE:
    // Mata manusia di web cukup nyaman dengan 30-45 FPS untuk background ambient.
    // Tidak perlu 60 FPS penuh yang menguras baterai.
    frameRate(30); 
}

function draw() {
    background(5, 5, 8); // Warna dasar gelap (sesuai style.css --bg-color)
    
    // Loop untuk mengupdate setiap titik
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        particles[i].connect(particles.slice(i)); // Cek koneksi ke titik lain
    }
}

// Fungsi agar canvas menyesuaikan diri saat browser di-resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Class untuk Titik Data (Neuron)
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5)); // Gerakan lambat
        this.size = 2; // Ukuran titik kecil
    }

    update() {
        this.pos.add(this.vel);

        // Jika kena pinggir layar, pantul balik
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

        // Interaksi Mouse: Jika mouse dekat, partikel "takut" atau "tertarik"
        // Di sini kita buat efek repulsion (menghindar) halus agar teks tetap terbaca
        let mouse = createVector(mouseX, mouseY);
        let distMouse = dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
        
        if (distMouse < 100) {
            let repulsion = p5.Vector.sub(this.pos, mouse);
            repulsion.normalize();
            repulsion.mult(0.5); // Kekuatan dorong
            this.pos.add(repulsion);
        }
    }

    draw() {
        noStroke();
        fill(100, 200, 255, 150); // Warna biru muda cyani (sesuai tema research)
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    // Fungsi membuat garis penghubung (synapse)
    connect(others) {
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            
            // Jika jarak dekat (< 120px), gambar garis tipis
            if (d < 120) {
                // Semakin jauh semakin transparan garisnya
                let alpha = map(d, 0, 120, 100, 0); 
                stroke(100, 200, 255, alpha);
                strokeWeight(0.5);
                line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
        });
    }
}