// ==========================================
// 1. DATA & KONFIGURASI
// ==========================================

// Profil warna untuk 3 Gerbera permanen
const gerberaColors = [
    { 
        // Merah
        main: '#ff4757', 
        dark: '#8b0000', 
        light: '#ff7f50', 
        glow: 'rgba(255, 71, 87, 0.8)',
        outerGlow: 'rgba(255, 0, 0, 0.2)'
    },
    { 
        // Putih
        main: '#ffffff', 
        dark: '#a0a0a0', 
        light: '#e0f7fa', 
        glow: 'rgba(255, 255, 255, 0.6)',
        outerGlow: 'rgba(200, 230, 255, 0.3)'
    },
    { 
        // Kuning
        main: '#ffdc1e', 
        dark: '#b8860b', 
        light: '#fff9c4', 
        glow: 'rgba(255, 220, 30, 0.7)',
        outerGlow: 'rgba(255, 215, 0, 0.2)'
    }

];

// Profil warna untuk bunga Lily yang bisa ditanam
const lilyProfiles = [
    // 1. Soft Cherry Blossom (Pink pucat yang sangat lembut)
    { 
        inner: '#ffebee', 
        outer: '#fce4ec', 
        vein: '#f06292', 
        glow: 'rgba(255, 235, 238, 0.7)', 
        outerGlow: 'rgba(240, 98, 146, 0.2)' 
    },
    
    // 2. Neon Magenta (Vibran, memberikan efek glow yang kuat di kegelapan)
    { 
        inner: '#ff1744', 
        outer: '#f50057', 
        vein: '#880e4f', 
        glow: 'rgba(255, 23, 68, 0.8)', 
        outerGlow: 'rgba(245, 0, 87, 0.3)' 
    },
    
    // 3. Starlight White (Putih bersih dengan pendaran pink dingin)
    { 
        inner: '#ffffff', 
        outer: '#fff5f8', 
        vein: '#ff80ab', 
        glow: 'rgba(255, 255, 255, 0.6)', 
        outerGlow: 'rgba(255, 128, 171, 0.2)' 
    },
    
    // 4. Peachy Pink (Pink ke arah salem, memberi kesan hangat)
    { 
        inner: '#f06292', 
        outer: '#ff8a80', 
        vein: '#c2185b', 
        glow: 'rgba(240, 98, 146, 0.7)', 
        outerGlow: 'rgba(255, 138, 128, 0.2)' 
    },
    
    // 5. Deep Orchid (Pink keunguan yang elegan)
    { 
        inner: '#ad1457', 
        outer: '#d81b60', 
        vein: '#4a148c', 
        glow: 'rgba(216, 27, 96, 0.8)', 
        outerGlow: 'rgba(74, 20, 140, 0.2)' 
    },

    { 
        inner: '#f06292', // Pink vibran di area dalam (dekat tulang)
        outer: '#ffffff', // Putih bersih di area luar/tepian
        vein: '#ad1457',  // Tulang kelopak pink tua agar kontras
        glow: 'rgba(240, 98, 146, 0.5)', 
        outerGlow: 'rgba(255, 255, 255, 0.2)' 
    }
];

// ==========================================
// 2. FUNGSI PEMBANTU (UTILITY)
// ==========================================

// Fungsi untuk masuk ke mode Full Screen
function activateFullscreen() {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.webkitRequestFullscreen) { /* Safari */
        docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) { /* IE11 */
        docElm.msRequestFullscreen();
    }
}

// Mengacak urutan array
function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// Mengatur transisi antar halaman yang halus
function handleTransition(e, targetUrl) {
    e.preventDefault();
    const transitionEl = document.querySelector('.page-transition');
    if (!transitionEl) {
        window.location.href = targetUrl;
        return;
    }
    transitionEl.classList.remove('fade-in');
    transitionEl.classList.add('fade-out');
    setTimeout(() => { 
        window.location.href = targetUrl; 
    }, 800);
}

// ==========================================
// 3. LOGIKA PARTIKEL (CANVAS OPTIMIZATION)
// ==========================================

// Membuat satu kanvas untuk semua partikel
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Styling kanvas agar tidak menghalangi interaksi klik pada bunga
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9997'; // Di atas bunga, di bawah tirai transisi

// Menyesuaikan ukuran kanvas dengan layar
let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];

// Blueprint untuk Kunang-kunang
class Firefly {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;

        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * -0.3 - 0.05;

        this.life = Math.random() * 100 + 100;
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
    }
    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
        this.opacity += this.fadeSpeed * dt;
        
        if (this.opacity >= 1 || this.opacity <= 0) this.fadeSpeed *= -1; 
        this.life -= 1 * dt;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76, 175, 80, ${this.opacity})`; // Hijau khas kunang-kunang
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4CAF50';
        ctx.fill();
    }
}

// Blueprint untuk Jejak Bintang (Star Trail)
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 2; 
        this.life = 1; // Transparansi awal
        this.decay = Math.random() * 0.01 + 0.008; 
        this.rotation = Math.random() * Math.PI * 2;
       this.rotSpeed = (Math.random() - 0.5) * 0.04;
        
        const colors = ['255,255,255', '255,253,231', '255,249,196'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update(dt) {
        this.life -= this.decay * dt;
        this.rotation += this.rotSpeed * dt;
        this.size -= 0.015 * dt; 
        this.y -= 0.1 * dt;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        
        // Menggambar bentuk bintang bersudut empat
        for (let i = 0; i < 4; i++) {
            ctx.lineTo(0, -this.size);
            ctx.lineTo(this.size * 0.2, -this.size * 0.2);
            ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        
        ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(255, 249, 196, ${this.life})`;
        ctx.fill();
        ctx.restore();
    }
}

// Mesin Animasi Utama (Menggantikan setInterval & CSS Animations)
function animateParticles() {
    // Bersihkan layar setiap frame (kunci dari optimasi memori)
    ctx.clearRect(0, 0, width, height);

    // Pertahankan populasi kunang-kunang di angka yang stabil (maks 40)
    if (particles.filter(p => p instanceof Firefly).length < 40) {
        particles.push(new Firefly());
    }

    // Perbarui koordinat dan lukis ulang semua partikel
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        // Hapus partikel dari array memori jika siklus hidupnya habis atau keluar layar
        if (p.life <= 0 || p.size <= 0 || p.y < -10) {
            particles.splice(i, 1);
        }
    }
    
    // Panggil frame berikutnya dengan efisiensi GPU
    requestAnimationFrame(animateParticles);
}

// Fungsi inisialisasi yang dipanggil saat masuk ke halaman garden
function initFireflies() {
    // Jalankan mesin animasi
    animateParticles();
}

// Fungsi pemanggil jejak bintang dari event mousemove/touchmove
const spawnStar = (x, y) => {
    particles.push(new Star(x, y));
};

// === MESIN ANIMASI DENGAN DELTA TIME ===
let lastTimeCanvas = performance.now();

function animateParticles(currentTime) {
    ctx.clearRect(0, 0, width, height);

    // Hitung Delta Time (dinormalisasi ke ~60FPS yaitu 16.6ms per frame)
    let deltaTime = (currentTime - lastTimeCanvas) / 16.66;
    lastTimeCanvas = currentTime;

    // Batasi deltaTime agar partikel tidak melompat jauh jika tab ditinggalkan
    if (deltaTime > 3) deltaTime = 3;
    if (isNaN(deltaTime)) deltaTime = 1; 

    if (particles.filter(p => p instanceof Firefly).length < 40) {
        particles.push(new Firefly());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Lempar nilai deltaTime ke fungsi update
        p.update(deltaTime);
        p.draw();

        if (p.life <= 0 || p.size <= 0 || p.y < -10) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// ==========================================
// 4. FUNGSI PERAKIT BUNGA (GERBERA)
// ==========================================
const svgNS = "http://www.w3.org/2000/svg";

function createPermanentGerbera(xPercent, yPercent, colorProfile) {
    const gardenContainer = document.getElementById('garden');


    if (!gardenContainer || !colorProfile) return;

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('xmlns', svgNS);
    svg.setAttribute('class', 'gerbera-coded');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.left = xPercent + '%';
    svg.style.top = yPercent + '%';
    svg.style.width = '120px';
    svg.style.height = '120px';
    svg.style.position = 'absolute';
    svg.style.transform = 'translate(-50%, -50%)';
    svg.style.overflow = 'visible';
    svg.style.setProperty('--glow-color', colorProfile.glow);
    svg.style.setProperty('--outer-glow', colorProfile.outerGlow);

    // Setup gradient untuk kelopak SVG
    const defs = document.createElementNS(svgNS, 'defs');
    const gradId = `grad-gerbera-${Math.random().toString(36).substr(2, 5)}`;
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', gradId);
    gradient.setAttribute('x1', '0%'); gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%'); gradient.setAttribute('y2', '100%');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="${colorProfile.main}" />
        <stop offset="70%" stop-color="${colorProfile.dark}" />
        <stop offset="100%" stop-color="#1e3d2f" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Grup Kelopak (Berpusat di 50, 50)
    const petalGroup = document.createElementNS(svgNS, 'g');
    petalGroup.setAttribute('transform', 'translate(50, 50)');

    // Buat 24 kelopak
    for (let i = 0; i < 24; i++) {
        const petal = document.createElementNS(svgNS, 'path');
        const angle = i * 15;
        // Variasi acak kecil agar ujungnya tidak terlalu rata
        const length = 45 + (Math.random() * 5 - 2.5); 
        
        // Menggunakan Quadratic Bezier (Q) untuk bentuk pipih meruncing
        // Menggambar dari titik pusat (0,0) menjulur ke atas sejauh -length
        const d = `
            M -2.5, 0 
            Q -6, ${-length * 0.5} -3, ${-length + 4} 
            Q 0, ${-length - 4} 3, ${-length + 4} 
            Q 6, ${-length * 0.5} 2.5, 0 Z
        `;
        
        petal.setAttribute('d', d);
        petal.setAttribute('fill', `url(#${gradId})`);
        petal.setAttribute('transform', `rotate(${angle})`);
        petalGroup.appendChild(petal);
    }
    svg.appendChild(petalGroup);

    const center = document.createElementNS(svgNS, 'circle');
    center.setAttribute('cx', '50');
    center.setAttribute('cy', '50');
    center.setAttribute('r', '12');
    center.setAttribute('fill', '#21100b');
    center.setAttribute('stroke', '#4e342e');
    center.setAttribute('stroke-width', '2');
    svg.appendChild(center);

    gardenContainer.appendChild(svg);
    setTimeout(updateFlowerRegistry, 50);
}

function renderGerberas() {
    const gardenContainer = document.getElementById('garden');
    if (!gardenContainer) return;

    // Cek agar tidak spawn berkali-kali setiap klik back/enter
    if (document.querySelectorAll('.gerbera-coded').length > 0) return;

    const shuffledColors = shuffleArray(gerberaColors);
    setTimeout(() => createPermanentGerbera(50, 15, shuffledColors[0]), 100);  // Puncak (Tengah Atas)
    setTimeout(() => createPermanentGerbera(15, 82, shuffledColors[1]), 400);  // Kiri Bawah
    setTimeout(() => createPermanentGerbera(85, 82, shuffledColors[2]), 700);  // Kanan Bawah
}

// ==========================================
// 5. EKSEKUSI UTAMA (DOM READY)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen section (Pastikan ID ini ada di HTML-mu nanti)
    const landingSection = document.getElementById('landing-section');
    const gardenSection = document.getElementById('garden-section');
    
    // Ambil tombol
    const accessBtn = document.getElementById('accessBtn');
    const saveBtn = document.getElementById('saveBtn');
    const backBtn = document.getElementById('backBtn');
    const transitionEl = document.querySelector('.page-transition');
    // Tirai dibuka saat masuk halaman
    if (transitionEl) {
        setTimeout(() => transitionEl.classList.add('fade-in'), 100);
    }

    // Jalankan Fireflies
    initFireflies();

    // Tanam 3 Gerbera Permanen (Hanya di halaman garden)
    if (garden) {
        const shuffledColors = shuffleArray(gerberaColors);
        createPermanentGerbera(50, 15, shuffledColors[0]); // Puncak (Tengah Atas)
        createPermanentGerbera(15, 82, shuffledColors[1]); // Kiri Bawah
        createPermanentGerbera(85, 82, shuffledColors[2]); // Kanan Bawah
    }

    // Navigasi Antar Halaman
    if (accessBtn) {
        accessBtn.addEventListener('click', () => {
            // 1. Picu Fullscreen
            activateFullscreen();

            window.scrollTo(0, 0);
            
            // 2. Tutup Tirai
            transitionEl.classList.remove('fade-in');
            transitionEl.classList.add('fade-out');

            setTimeout(() => {
                // 3. Tukar Tampilan
                landingSection.style.display = 'none';
                gardenSection.style.display = 'flex';

                initFireflies(); // Pastikan kunang-kunang aktif di halaman garden
                renderGerberas(); // Render gerbera permanen di halaman garden

                // 4. Buka Tirai Kembali
                transitionEl.classList.remove('fade-out');
                transitionEl.classList.add('fade-in');
                
            }, 800); // Sesuai durasi CSS transition
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Tutup Tirai
            transitionEl.classList.remove('fade-in');
            transitionEl.classList.add('fade-out');

            setTimeout(() => {
                // Tukar Tampilan Kembali
                gardenSection.style.display = 'none';
                landingSection.style.display = 'flex'; // Atau 'block'

                // Buka Tirai
                transitionEl.classList.remove('fade-out');
                transitionEl.classList.add('fade-in');
                
                // Opsional: Keluar Fullscreen jika ingin
                // if (document.exitFullscreen) document.exitFullscreen();
            }, 800);
        });
    }

    // Logika Tombol Save Picture
 if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        // 1. Sembunyikan UI tombol sementara
        const controls = document.querySelector('.controls');
        const originalDisplay = controls.style.display;
        controls.style.display = 'none';

        // 2. Jepret layar dengan mesin modern (htmlToImage)
        htmlToImage.toPng(document.body, {
            quality: 1.0,
            backgroundColor: '#0a150a' // Pastikan latar gelap ikut tertangkap
        })
        .then(function (dataUrl) {
            // 3. Kembalikan tombol UI
            controls.style.display = originalDisplay;

            // 4. Unduh hasilnya
            const link = document.createElement('a');
            link.download = 'Our-Unwithering-Garden.png';
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            console.error('Error memotret layar:', error);
            controls.style.display = originalDisplay;
            alert('Maaf, gagal menyimpan gambar. Coba lagi ya!');
        });
    });
}

    // Logika Tombol Reset (dengan animasi Poof)
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const lilies = document.querySelectorAll('.lily-coded');
            if (lilies.length === 0) return;
            
            lilies.forEach(lily => lily.classList.add('fade-out'));
            
            setTimeout(() => { 
                lilies.forEach(lily => lily.remove()); 
            }, 450); // Jeda sedikit lebih lama dari durasi animasi CSS
        });
    }

    // Logika Klik Menanam Lily
    if (garden) {
       garden.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) return;

        const rect = garden.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Logika Anti-Tumpuk (Tetap Sama)
        const gerberas = document.querySelectorAll('.gerbera-coded');
        let isTooClose = false;
        gerberas.forEach(gerbera => {
            const gRect = gerbera.getBoundingClientRect();
            const gX = (gRect.left + gRect.width / 2) - rect.left;
            const gY = (gRect.top + gRect.height / 2) - rect.top;
            const distance = Math.sqrt(Math.pow(x - gX, 2) + Math.pow(y - gY, 2));
            if (distance < (window.innerWidth < 768 ? 55 : 100)) isTooClose = true;
        });

            if (isTooClose) return;

           // --- MULAI MERAKIT LILY Vektor ---
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('xmlns', svgNS);
            svg.setAttribute('class', 'lily-coded');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.style.overflow = 'visible';
            svg.style.left = x + 'px';
            svg.style.top = y + 'px';

            // Randomisasi Skala Utuh Bunga (Sama seperti sebelumnya)
            const scale = (Math.random() * 0.5 + 0.6).toFixed(2);
            svg.style.setProperty('--scale', scale);

            // Ambil profil warna acak
            const profile = lilyProfiles[Math.floor(Math.random() * lilyProfiles.length)];

            // Definisikan Gradasi Kelopak Lily
            const defs = document.createElementNS(svgNS, 'defs');
            const gradId = `grad-lily-${Math.random().toString(36).substr(2, 5)}`;
            const radGrad = document.createElementNS(svgNS, 'radialGradient');
            radGrad.setAttribute('id', gradId);
            radGrad.setAttribute('cx', '50%'); radGrad.setAttribute('cy', '100%'); // Titik pusat di pangkal
            radGrad.setAttribute('r', '100%');
            
            radGrad.innerHTML = `
                <stop offset="0%" stop-color="${profile.vein}" />
                <stop offset="30%" stop-color="${profile.inner}" />
                <stop offset="80%" stop-color="${profile.outer}" />
            `;
            defs.appendChild(radGrad);
            svg.appendChild(defs);

            // Grup Kelopak berpusat di tengah kanvas
            const petalGroup = document.createElementNS(svgNS, 'g');
            petalGroup.setAttribute('transform', 'translate(50, 50)');

            // FUNGSI MEMBUAT KELOPAK LILY REALISTIS
            const createLilyPetal = (angle, isInner) => {
            const p = document.createElementNS(svgNS, 'path');
            
            // Randomisasi lekukan: membuat ujung bunga sedikit meliuk kiri/kanan acak
            const bend = (Math.random() * 10) - 5; 
            const length = isInner ? 40 : 45; // Kelopak dalam lebih pendek
            const width = isInner ? 12 : 16;  // Kelopak dalam lebih ramping
            
            // M = Titik pangkal (0,0)
            // C = Cubic Bezier: Titik kontrol 1 (Kiri bawah), Titik kontrol 2 (Kiri atas), Titik Akhir (Ujung bunga)
            // Titik kembali ke bawah dengan kurva sisi kanan
            const d = `
                M 0,0 
                C -${width},-${length * 0.3} -${width * 0.8},-${length * 0.8} ${bend},-${length}
                C ${width * 0.8},-${length * 0.8} ${width},-${length * 0.3} 0,0 Z
            `;
            
            p.setAttribute('d', d);
            p.setAttribute('fill', `url(#${gradId})`);
            
            // Randomisasi rotasi kelopak sedikit agar natural
            const randomRotation = angle + (Math.random() * 10 - 5);
            p.setAttribute('transform', `rotate(${randomRotation})`);
            
            // Beri efek ketebalan bayangan di dalam kelopak
            // p.style.filter = 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))';
            
            return p;
        };

            // 1. Kelopak Luar (3 Buah)
        for (let i = 0; i < 3; i++) {
            petalGroup.appendChild(createLilyPetal(i * 120, false));
        }

        // 2. Kelopak Dalam (3 Buah, diputar 60 derajat)
        for (let i = 0; i < 3; i++) {
            petalGroup.appendChild(createLilyPetal(i * 120 + 60, true));
        }
        svg.appendChild(petalGroup);

        // 3. Benang Sari & Kepala Sari (Organ Bunga)
        const stamenGroup = document.createElementNS(svgNS, 'g');
        stamenGroup.setAttribute('transform', 'translate(50, 50)');
        
        // Randomisasi jumlah benang sari 5 hingga 8[cite: 3]
        const numStamens = Math.floor(Math.random() * 4) + 5; 
        const angleStep = 360 / numStamens;

        for (let i = 0; i < numStamens; i++) {
            const sLength = Math.random() * 15 + 15;
            const sAngle = (i * angleStep) + (Math.random() * 30 - 15);
            const bend = Math.random() * 10 - 5; // Filamen melengkung

            // Tangkai (Filament)
            const filament = document.createElementNS(svgNS, 'path');
            filament.setAttribute('d', `M 0,0 Q ${bend},-${sLength/2} 0,-${sLength}`);
            filament.setAttribute('stroke', '#8bc34a');
            filament.setAttribute('stroke-width', '1.5');
            filament.setAttribute('fill', 'none');
            filament.setAttribute('transform', `rotate(${sAngle})`);
            stamenGroup.appendChild(filament);

            // Kepala Sari (Anther) - Bentuk elips organik
            const anther = document.createElementNS(svgNS, 'ellipse');
            anther.setAttribute('rx', '2.5');
            anther.setAttribute('ry', '4');
            anther.setAttribute('fill', '#5d4037');
            // Menempatkan anther tepat di ujung filament dengan rotasi acak
            anther.setAttribute('transform', `rotate(${sAngle}) translate(0, -${sLength}) rotate(${Math.random() * 60 - 30})`);
            stamenGroup.appendChild(anther);
        }
        svg.appendChild(stamenGroup);

        // 4. Inti Tengah (Pistil / Putik)
        const center = document.createElementNS(svgNS, 'circle');
        center.setAttribute('cx', '50');
        center.setAttribute('cy', '50');
        center.setAttribute('r', '4');
        center.setAttribute('fill', '#fff59d');
        svg.appendChild(center);


        svg.dataset.isBlooming = "true";
        
        // Hapus tanda tersebut setelah 700ms (sesuai durasi animasi bloom di CSS)
        setTimeout(() => {
            svg.dataset.isBlooming = "false";
        }, 700);

        garden.appendChild(svg);
        setTimeout(updateFlowerRegistry, 50);
    });
    }
});

// Variabel untuk melacak kecepatan kursor/jari
let lastX = 0;
let lastY = 0;
let lastTime = Date.now();

// ==========================================
// SISTEM CACHE (ANTI-LAYOUT THRASHING)
// ==========================================
let flowerRegistry = []; // Ini adalah "Buku Alamat" kita

function updateFlowerRegistry() {
    const flowers = document.querySelectorAll('.lily-coded, .gerbera-coded');
    flowerRegistry = Array.from(flowers).map(flower => {
        const rect = flower.getBoundingClientRect();
        return {
            element: flower,
            // Kita ukur dan simpan posisinya SEKALI saja
            x: rect.left + rect.width / 2, 
            y: rect.top + rect.height / 2,
            scale: parseFloat(flower.style.getPropertyValue('--scale')) || 1
        };
    });
}

// Jika layar di-resize atau diputar (rotate HP), ukur ulang posisinya
window.addEventListener('resize', () => {
    clearTimeout(window.flowerResizeTimer);
    window.flowerResizeTimer = setTimeout(updateFlowerRegistry, 200);
});

// Fungsi terpusat untuk meniup bunga
function applyWindForce(currentX, currentY) {
    const currentTime = Date.now();
    const deltaX = currentX - lastX;
    const deltaY = currentY - (typeof lastY !== 'undefined' ? lastY : currentY);
    const deltaTime = currentTime - lastTime;

    // Mencegah error pembagian dengan nol
    if (deltaTime > 0) {
        const speedX = deltaX / deltaTime; // Kecepatan geser horizontal
        const speedY = deltaY / deltaTime; // Kecepatan geser vertikal

        // Hitung kecepatan total (vektor)
        const speed = Math.sqrt(speedX * speedX + speedY * speedY);

       if (speed > 0.15) { 
            // KUNCI OPTIMASI: Kita loop array 'flowerRegistry', BUKAN querySelectorAll!
            flowerRegistry.forEach(flowerData => {
                const { element, x, y, scale } = flowerData; // Ambil data dari buku alamat

                if (element.dataset.isBlooming === "true") return;

                // Hitung jarak murni menggunakan matematika tanpa menyentuh DOM browser
                const distance = Math.sqrt(Math.pow(currentX - x, 2) + Math.pow(currentY - y, 2));

                if (distance < 140) {
                    if (element.style.animation !== 'none') {
                        element.style.animation = 'none';
                    }

                    const swayAngle = Math.max(-8, Math.min(8, speedX * 5)); 
                    const swayX = Math.max(-6, Math.min(6, speedX * 3));
                    const swayY = Math.max(-6, Math.min(6, speedY * 3));

                    clearTimeout(element.windTimeout);
                    
                    element.style.transition = 'transform 0.25s ease-out';
                    // Sisipkan translateZ(0) agar GPU Mobile tetap aktif!
                    element.style.transform = `translate(calc(-50% + ${swayX}px), calc(-50% + ${swayY}px)) translateZ(0) scale(${scale}) rotate(${swayAngle}deg)`;

                    element.windTimeout = setTimeout(() => {
                        element.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)';
                        element.style.transform = `translate(-50%, -50%) translateZ(0) scale(${scale}) rotate(0deg)`;
                    }, 150);
                }
            });
        }
    }
    
    // Perbarui riwayat posisi dan waktu
    lastX = currentX;
    lastY = currentY;
    lastTime = currentTime;
}

// Deteksi Gerakan Mouse (PC)
window.addEventListener('mousemove', (e) => {
    // Kita gunakan throttle sederhana agar tidak terlalu banyak spawn (performa)
    if (Math.random() > 0.8) { 
        spawnStar(e.clientX, e.clientY);
    }
    applyWindForce(e.clientX, e.clientY);
});

// Deteksi Seretan Jari (Mobile)
window.addEventListener('touchmove', (e) => {
    // Ambil koordinat sentuhan pertama
    const touch = e.touches[0];
    if (Math.random() > 0.7) { // Lebih sering spawn di mobile agar terasa responsif
        spawnStar(touch.clientX, touch.clientY);
    }
    applyWindForce(touch.clientX, touch.clientY);
}, { passive: true });

