// ==========================================
// 1. DATA & KONFIGURASI
// ==========================================

// Profil warna untuk 3 Gerbera permanen
const gerberaColors = [
    { name: 'Putih', main: '#ffffff', dark: '#d1d1d1' },
    { name: 'Merah', main: '#ff1744', dark: '#b71c1c' },
    { name: 'Kuning', main: '#ffeb3b', dark: '#fbc02d' }
];

// Profil warna untuk bunga Lily yang bisa ditanam
const lilyProfiles = [
    { inner: '#c2185b', outer: '#ec407a', vein: '#880e4f' }, // Pink Pekat
    { inner: '#f8bbd0', outer: '#ffffff', vein: '#f06292' }, // Putih Dominan
    { inner: '#d81b60', outer: '#ffffff', vein: '#c2185b' }  // Gradasi Seimbang
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
// 3. LOGIKA KUNANG-KUNANG (FIREFLIES)
// ==========================================

function initFireflies() {
    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + 'vw';
        firefly.style.top = Math.random() * 100 + 'vh';
        
        const size = Math.random() * 2 + 1;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        firefly.style.opacity = Math.random();
        
        document.body.appendChild(firefly);

        const duration = Math.random() * 4000 + 4000;
        firefly.animate([
            { opacity: 0, transform: 'translate(0, 0)' },
            { opacity: 1, transform: `translate(${Math.random() * 40 - 20}px, -20px)` },
            { opacity: 0, transform: `translate(${Math.random() * 80 - 40}px, -100px)` }
        ], { duration: duration, easing: 'ease-in-out' });

        setTimeout(() => firefly.remove(), duration);
    }
    setInterval(createFirefly, 450);
}

// ==========================================
// 4. FUNGSI PERAKIT BUNGA (GERBERA)
// ==========================================

function createPermanentGerbera(xPercent, yPercent, colorProfile) {
    const gardenContainer = document.getElementById('garden');
    if (!gardenContainer || !colorProfile) return;

    const gerbera = document.createElement('div');
    gerbera.className = 'gerbera-coded';
    gerbera.style.left = xPercent + '%';
    gerbera.style.top = yPercent + '%';
    gerbera.style.transform = 'translate(-50%, -50%)';

    // Set variabel warna CSS
    gerbera.style.setProperty('--g-color', colorProfile.main);
    gerbera.style.setProperty('--g-dark', colorProfile.dark);

    // Buat 24 kelopak
    for (let i = 0; i < 24; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.transform = `rotate(${i * 15}deg)`;
        gerbera.appendChild(petal);
    }

    // Inti bunga (center)
    const center = document.createElement('div');
    center.className = 'center';
    gerbera.appendChild(center);
    gardenContainer.appendChild(gerbera);
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
        createPermanentGerbera(20, 30, shuffledColors[0]);
        createPermanentGerbera(50, 50, shuffledColors[1]);
        createPermanentGerbera(80, 25, shuffledColors[2]);
    }

    // Navigasi Antar Halaman
    if (accessBtn) {
        accessBtn.addEventListener('click', () => {
            // 1. Picu Fullscreen
            activateFullscreen();

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
            // Abaikan klik jika mengenai tombol
            if (e.target.closest('.btn')) return;

            const rect = garden.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // --- ANTI-TUMPUK (DETEKSI GERBERA) ---
            const gerberas = document.querySelectorAll('.gerbera-coded');
            let isTooClose = false;
            
            gerberas.forEach(gerbera => {
                const gRect = gerbera.getBoundingClientRect();
                const gX = (gRect.left + gRect.width / 2) - rect.left;
                const gY = (gRect.top + gRect.height / 2) - rect.top;
                
                const distance = Math.sqrt(Math.pow(x - gX, 2) + Math.pow(y - gY, 2));
                const safeDistance = window.innerWidth < 768 ? 55 : 100;
                
                if (distance < safeDistance) isTooClose = true;
            });

            if (isTooClose) return;

            // --- PROSES RAKIT LILY ---
            const lily = document.createElement('div');
            lily.className = 'lily-coded';
            lily.style.left = x + 'px';
            lily.style.top = y + 'px';

            // Set Warna & Skala Acak
            const profile = lilyProfiles[Math.floor(Math.random() * lilyProfiles.length)];
            lily.style.setProperty('--inner', profile.inner);
            lily.style.setProperty('--outer', profile.outer);
            lily.style.setProperty('--vein', profile.vein);
            
            const scale = (Math.random() * 0.5 + 0.5).toFixed(2);
            lily.style.setProperty('--scale', scale);

            // 1. Kelopak Luar (3)
            for (let i = 0; i < 3; i++) {
                const p = document.createElement('div');
                p.className = 'petal outer';
                const pScale = (Math.random() * 0.2 + 0.9).toFixed(2);
                p.style.transform = `rotate(${i * 120}deg) scale(${pScale})`;
                lily.appendChild(p);
            }

            // 2. Kelopak Dalam (3)
            for (let i = 0; i < 3; i++) {
                const p = document.createElement('div');
                p.className = 'petal inner';
                const pScale = (Math.random() * 0.15 + 0.75).toFixed(2);
                p.style.transform = `rotate(${i * 120 + 60}deg) scale(${pScale})`;
                lily.appendChild(p);
            }

            // 3. Benang Sari (5-8)
            const numStamens = Math.floor(Math.random() * 4) + 5;
            const angleStep = 360 / numStamens;
            for (let i = 0; i < numStamens; i++) {
                const wrapper = document.createElement('div');
                wrapper.className = 'stamen-wrapper';
                const sHeight = Math.floor(Math.random() * 15) + 20;
                wrapper.style.height = sHeight + 'px';
                wrapper.style.top = (50 - sHeight) + 'px';
                
                const rAngle = (i * angleStep) + (Math.random() * 30 - 15);
                wrapper.style.transform = `rotate(${rAngle}deg)`;

                const filament = document.createElement('div');
                filament.className = 'filament';
                wrapper.appendChild(filament);

                const anther = document.createElement('div');
                anther.className = 'anther';
                anther.style.transform = `rotate(${Math.floor(Math.random() * 60) - 30}deg)`;
                wrapper.appendChild(anther);

                lily.appendChild(wrapper);
            }

            // 4. Inti Tengah
            const center = document.createElement('div');
            center.className = 'center';
            lily.appendChild(center);

            garden.appendChild(lily);
        });
    }
});

// --- LOGIKA SPAWN BINTANG (STAR TRAIL) ---
const spawnStar = (x, y) => {
    const star = document.createElement('div');
    star.className = 'magic-star';
    
    // Posisi tepat di ujung kursor/jari
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    
    // --- RANDOM SIZE: Jangkauan lebih luas (4px sampai 18px) ---
    const size = Math.random() * 14 + 4;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // --- RANDOM COLOR: Putih ke Kuning Langsat/Krem ---
    const colors = ['#ffffff', '#fffde7', '#fff9c4', '#fff59d', '#fff176'];
    star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(star);

    // Hapus dari DOM setelah animasi selesai (1 detik)
    setTimeout(() => {
        star.remove();
    }, 2000);
};

// Deteksi Gerakan Mouse (PC)
window.addEventListener('mousemove', (e) => {
    // Kita gunakan throttle sederhana agar tidak terlalu banyak spawn (performa)
    if (Math.random() > 0.8) { 
        spawnStar(e.clientX, e.clientY);
    }
});

// Deteksi Seretan Jari (Mobile)
window.addEventListener('touchmove', (e) => {
    // Ambil koordinat sentuhan pertama
    const touch = e.touches[0];
    if (Math.random() > 0.7) { // Lebih sering spawn di mobile agar terasa responsif
        spawnStar(touch.clientX, touch.clientY);
    }
}, { passive: true });