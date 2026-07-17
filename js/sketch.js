// js/sketch.js - Upgraded Magnetic Neural Constellation

let particles = [];
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1'); 
    canvas.style('position', 'fixed'); 
    
    // Deteksi perangkat
    let isMobile = windowWidth < 768;
    // Tambah sedikit jumlah partikel agar jaring terlihat lebih padat
    let particleCount = isMobile ? 30 : 70; 

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Kembalikan ke 60 FPS untuk fluiditas animasi kursor modern
    frameRate(60); 
}

function draw() {
    background(5, 5, 8); // Warna dasar gelap
    
    // Loop untuk mengupdate dan menggambar titik
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        particles[i].connect(particles.slice(i)); 
    }
    
    // FUNGSI BARU: Hubungkan partikel ke kursor mouse
    connectToMouse();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Fungsi membuat jaring magnetik ke arah mouse
function connectToMouse() {
    let mouseVector = createVector(mouseX, mouseY);
    for (let i = 0; i < particles.length; i++) {
        let d = dist(particles[i].pos.x, particles[i].pos.y, mouseVector.x, mouseVector.y);
        
        // Jika kursor dalam radius 150px, tarik garis menyala
        if (d < 150) {
            let alpha = map(d, 0, 150, 150, 0); // Semakin dekat, semakin terang
            stroke(0, 255, 200, alpha); // Warna neon cyan khas tema Anda
            strokeWeight(1.5);
            line(particles[i].pos.x, particles[i].pos.y, mouseVector.x, mouseVector.y);
        }
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.4, 0.4), random(-0.4, 0.4));
        this.size = random(1.5, 3); // Variasi ukuran agar organik
    }

    update() {
        this.pos.add(this.vel);

        // Pantul jika kena dinding
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

        // Efek menghindar halus (Parallax Dodge)
        let mouse = createVector(mouseX, mouseY);
        let distMouse = dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
        
        if (distMouse < 80) {
            let repulsion = p5.Vector.sub(this.pos, mouse);
            repulsion.normalize();
            repulsion.mult(0.5); 
            this.vel.add(repulsion);
            this.vel.limit(2); // Kecepatan kabur maksimal
        } else {
            // Jika tidak ada gangguan mouse, kembali lambat
            this.vel.limit(0.5);
        }
    }

    draw() {
        noStroke();
        fill(100, 200, 255, 180);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    connect(others) {
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            // Koneksi antar partikel (background mesh)
            if (d < 100) {
                let alpha = map(d, 0, 100, 80, 0); 
                stroke(100, 200, 255, alpha);
                strokeWeight(1);
                line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
        });
    }
}