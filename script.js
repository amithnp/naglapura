document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Boot Sequence & Matrix
    // ==========================================
    const bootTextContainer = document.getElementById('boot-text-container');
    const bootScreen = document.getElementById('boot-screen');
    const matrixCanvas = document.getElementById('matrix-bg');
    const mainWrapper = document.querySelector('.main-wrapper');

    const bootMsg = "INITIALISING PORTFOLIO...";
    let bIdx = 0;

    function typeBoot() {
        if (bIdx < bootMsg.length) {
            bootTextContainer.textContent += bootMsg.charAt(bIdx);
            bIdx++;
            setTimeout(typeBoot, 50);
        } else {
            setTimeout(() => {
                bootScreen.style.opacity = 0;
                matrixCanvas.style.opacity = 0.04;
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    document.body.classList.remove('loading'); // Fix scroll lock
                    mainWrapper.style.opacity = 1;
                    initThreeJS();
                    startHeroTyping();
                }, 500);
            }, 500);
        }
    }
    setTimeout(typeBoot, 300);

    // Matrix Rain
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~あいうえおかきくけこさしすせそたちつてと";
    const charsArray = chars.split("");
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        if (window.scrollY > window.innerHeight) return; // Optimize: don't draw if scrolled past

        ctx.fillStyle = "rgba(13, 17, 23, 0.05)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = "#39FF14";
        ctx.font = fontSize + "px 'Fira Code', monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = charsArray[Math.floor(Math.random() * charsArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50);

    // ==========================================
    // Custom Cursor
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    const trailCanvas = document.getElementById('cursor-trail');
    const tCtx = trailCanvas.getContext('2d');
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    let particles = [];

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        particles.push({ x: e.clientX, y: e.clientY, alpha: 1 });
    });

    function drawTrail() {
        if (particles.length === 0) {
            requestAnimationFrame(drawTrail);
            return;
        }
        tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            tCtx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
            tCtx.fillRect(p.x, p.y, 2, 2);
            p.alpha -= 0.05;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(drawTrail);
    }
    drawTrail();


    // ==========================================
    // Title Glitch & Uptime
    // ==========================================
    function startHeroTyping() {
        const titleText = "TECH_ARSENAL :: LOADED";
        const titleElement = document.getElementById('typewriter-title');
        let titleIndex = 0;

        function type() {
            if (titleIndex < titleText.length) {
                titleElement.textContent += titleText.charAt(titleIndex);
                titleIndex++;
                setTimeout(type, 50);
            } else {
                // Glitch effect
                titleElement.classList.add('glitch-anim');
                setTimeout(() => {
                    titleElement.classList.remove('glitch-anim');
                    titleElement.style.borderBottom = "2px solid #39FF14"; // Green underline replacement
                }, 1000);
            }
        }
        setTimeout(type, 500);

        // Uptime counter
        const uptimeEl = document.getElementById('uptime');
        let secs = 73238712;
        setInterval(() => {
            secs++;
            const d = Math.floor(secs / (3600 * 24));
            const h = Math.floor(secs % (3600 * 24) / 3600).toString().padStart(2, '0');
            const m = Math.floor(secs % 3600 / 60).toString().padStart(2, '0');
            const s = Math.floor(secs % 60).toString().padStart(2, '0');
            uptimeEl.textContent = `${d} days ${h}:${m}:${s}`;
        }, 1000);
    }

    // ==========================================
    // Inject Dynamic HTML Content
    // ==========================================

    // Cat 1: SVG Rings
    const aiSkills = [
        { name: "Python", val: 90, desc: "Predictive Models" },
        { name: "Pandas", val: 85, desc: "Data Wrangling" },
        { name: "Tableau", val: 85, desc: "Dashboards" },
        { name: "GenAI", val: 80, desc: "LLM Agents" }
    ];
    const ringGrid = document.querySelector('.svg-rings-grid');
    aiSkills.forEach(s => {
        const offset = 283 - (283 * (s.val / 100));
        ringGrid.innerHTML += `
            <div class="svg-skill-card">
                <div class="svg-ring-container">
                    <svg viewBox="0 0 100 100">
                        <circle class="svg-bg" cx="50" cy="50" r="45"></circle>
                        <circle class="svg-progress" cx="50" cy="50" r="45" style="--target-offset: ${offset}"></circle>
                    </svg>
                    <div class="ring-text">${s.val}%</div>
                </div>
                <div class="skill-name">${s.name}</div>
                <div class="tooltip-hover">Used at: ${s.desc}</div>
            </div>`;
    });

    // Cat 2: 3D Cubes
    const cloudSkills = [
        { name: "AWS", desc: "Lambda/EC2/S3" },
        { name: "Docker", desc: "Containerized ML Base" },
        { name: "K8s", desc: "Cluster Auth Setup" },
        { name: "GitLab", desc: "CI/CD Auto-deploy" }
    ];
    const cubeGrid = document.querySelector('.iso-cubes-grid');
    cloudSkills.forEach(s => {
        cubeGrid.innerHTML += `
            <div class="cube-container">
                <div class="cube">
                    <div class="cube-face cube-front">${s.name}</div>
                    <div class="cube-face cube-back">${s.desc}</div>
                    <div class="cube-face cube-right"></div>
                    <div class="cube-face cube-left"></div>
                    <div class="cube-face cube-top"></div>
                    <div class="cube-face cube-bottom"></div>
                </div>
            </div>`;
    });

    // Cat 4: Candlestick
    const finSkills = [
        { name: "DCF Models", val: 95 },
        { name: "Comps", val: 88 },
        { name: "Bloomberg", val: 92 },
        { name: "Excel VBA", val: 80 }
    ];
    const finChart = document.querySelector('.candlestick-chart');
    finSkills.forEach((s, idx) => {
        const height = s.val * 2;
        finChart.innerHTML += `
            <div class="candle-wrapper">
                <div class="candle-wick" style="height: ${height + 20}px"></div>
                <div class="candle-body" style="--target-height: ${height}px; height: 0;"></div>
                <div class="candle-label">${s.name}</div>
                <div class="candle-data">SKILL METRICS: ${s.val}%</div>
            </div>`;
    });

    // Github svg heatmap (fake)
    const heatmap = document.getElementById('heatmap');
    let svgHtml = '<svg width="100%" height="100%" viewBox="0 0 280 80"><g>';
    for (let w = 0; w < 20; w++) {
        for (let d = 0; d < 7; d++) {
            const opacity = Math.random() > 0.6 ? Math.random() : 0.1;
            svgHtml += `<rect x="${w * 14 + 5}" y="${d * 11 + 2}" width="9" height="9" fill="rgba(57, 255, 20, ${opacity})" rx="2"></rect>`;
        }
    }
    svgHtml += '</g></svg>';
    heatmap.innerHTML = svgHtml;

    // Vanilla JS Tilt
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 15; // Max 15deg rotation
            const rotateX = -((y - midY) / midY) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });

    // ==========================================
    // Intersection Observers
    // ==========================================
    const obsOpts = { root: null, threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                ent.target.classList.add('in-view');

                // SVG Rings
                if (ent.target.id === 'ai-ml') {
                    ent.target.querySelectorAll('.svg-progress').forEach(el => {
                        el.style.strokeDashoffset = el.getAttribute('style').match(/--target-offset:\s*([\d.]+)/)[1];
                    });
                }

                // CLI Terminal
                if (ent.target.id === 'engineering' && !ent.target.dataset.typed) {
                    ent.target.dataset.typed = 'true';
                    startCLI();
                }

                // Candlestick
                if (ent.target.id === 'finance') {
                    ent.target.querySelectorAll('.candle-body').forEach(el => {
                        el.style.height = el.getAttribute('style').match(/--target-height:\s*([^;]+)/)[1];
                    });
                }

                // Counters
                if (ent.target.id === 'achievements') {
                    const cnt = ent.target.querySelector('.report-count');
                    let i = 0;
                    const int = setInterval(() => {
                        i++; cnt.textContent = i;
                        if (i >= parseInt(cnt.dataset.target)) clearInterval(int);
                    }, 100);
                }
                observer.unobserve(ent.target);
            }
        });
    }, obsOpts);
    document.querySelectorAll('.category-section').forEach(sec => observer.observe(sec));


    function startCLI() {
        const out = document.getElementById('terminal-cli-output');
        const lines = [
            "> Loading Go (Golang).......... [<span style='color:var(--neon-green)'>████████░░</span>] 80%",
            "> Loading C/C++............... [<span style='color:var(--neon-green)'>█████████░</span>] 85%",
            "> Loading SQL................. [<span style='color:var(--neon-green)'>█████████░</span>] 88%"
        ];

        let initial = document.createElement('div');
        initial.className = 'cli-line';
        initial.innerHTML = "<span class='cli-prompt'>root@amith:~$</span> load --skills systems";
        out.appendChild(initial);

        setTimeout(() => {
            let lIdx = 0;
            function tLine() {
                if (lIdx < lines.length) {
                    let textLi = document.createElement('div');
                    textLi.className = 'cli-line';
                    textLi.innerHTML = lines[lIdx];
                    out.appendChild(textLi);
                    lIdx++;
                    setTimeout(tLine, 200); // 200ms delay per prompt
                } else {
                    let f = document.createElement('div');
                    f.className = 'cli-line';
                    f.innerHTML = "<span class='cli-prompt'>root@amith:~$</span> <span style='background:var(--neon-green); width:8px; height:1em; display:inline-block; animation:blink 1s infinite;'></span>";
                    out.appendChild(f);
                }
            }
            tLine();
        }, 600);
    }

    // ==========================================
    // Three.js 3D Avatar Engine
    // ==========================================
    function initThreeJS() {
        if (window.innerWidth < 768 || typeof THREE === "undefined") {
            const mob = document.getElementById('mobile-hero');
            if (mob) mob.classList.remove('hidden');
            const tc = document.getElementById('three-container');
            if (tc) tc.classList.add('hidden');
            return;
        }

        const container = document.getElementById('three-container');
        const W = container.clientWidth;
        const H = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
        camera.position.set(0, 2, 9); // Pulled back slightly

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
        container.appendChild(renderer.domElement);

        // Lights
        const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambLight);
        const dirLight = new THREE.DirectionalLight(0x39FF14, 1);
        dirLight.position.set(2, 5, 2);
        scene.add(dirLight);
        const cyanLight = new THREE.PointLight(0x00FFFF, 1, 10);
        cyanLight.position.set(-2, 0, 2);
        scene.add(cyanLight);

        // Background Particles
        const partGeo = new THREE.BufferGeometry();
        const numParticles = window.innerWidth < 1024 ? 500 : 1000; // Reduce particles on smaller screens
        const partPos = new Float32Array(numParticles * 3);
        for (let i = 0; i < numParticles * 3; i++) partPos[i] = (Math.random() - 0.5) * 20;
        partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
        const partMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
        const particles = new THREE.Points(partGeo, partMat);
        scene.add(particles);

        // Pedestal Hexagon
        const pedGeo = new THREE.CylinderGeometry(2, 2, 0.2, 6);
        const pedMat = new THREE.MeshPhongMaterial({ color: 0x050505, wireframe: true, wireframeLinewidth: 2 });
        const pedestal = new THREE.Mesh(pedGeo, pedMat);
        pedestal.position.y = -1.5;
        scene.add(pedestal);

        // 3D Text below Pedestal
        const loader = new THREE.FontLoader();
        loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const textGeo = new THREE.TextGeometry('AMITH NAGLAPURA', {
                font: font,
                size: 0.3,
                height: 0.05,
                curveSegments: 12,
            });
            textGeo.computeBoundingBox();
            const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
            const textMat = new THREE.MeshPhongMaterial({ color: 0x39FF14 });
            const textMesh = new THREE.Mesh(textGeo, textMat);
            textMesh.position.set(centerOffset, -2.5, 0);
            scene.add(textMesh);
        });

        // Central Avatar (Low Poly Crystal)
        const avGeo = new THREE.IcosahedronGeometry(1.2, 1);
        const avMat = new THREE.MeshPhongMaterial({
            color: 0x011100, emissive: 0x0a220a, specular: 0x39FF14, shininess: 100, flatShading: true, transparent: true, opacity: 0.9
        });
        const avatar = new THREE.Mesh(avGeo, avMat);
        scene.add(avatar);

        const headGeo = new THREE.IcosahedronGeometry(0.5, 0);
        const head = new THREE.Mesh(headGeo, avMat);
        head.position.y = 1.8;
        avatar.add(head);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.2, 0.1, 0.45);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.2, 0.1, 0.45);
        head.add(leftEye);
        head.add(rightEye);

        // Holographic Thought Bubble (Hidden initially)
        const bubbleGroup = new THREE.Group();
        bubbleGroup.position.set(1.5, 2.5, 0);
        bubbleGroup.visible = false;
        avatar.add(bubbleGroup);
        const bubGeo = new THREE.IcosahedronGeometry(0.6, 1);
        const bubMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true, transparent: true, opacity: 0.5 });
        const bubble = new THREE.Mesh(bubGeo, bubMat);
        bubbleGroup.add(bubble);
        loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const tGeo = new THREE.TextGeometry('...', { font: font, size: 0.2, height: 0.02 });
            tGeo.computeBoundingBox();
            const xOff = -0.5 * (tGeo.boundingBox.max.x - tGeo.boundingBox.min.x);
            const tMat = new THREE.MeshBasicMaterial({ color: 0x39FF14 });
            const tMesh = new THREE.Mesh(tGeo, tMat);
            tMesh.position.set(xOff, -0.1, 0);
            bubbleGroup.add(tMesh);
        });

        // Presenting Panel (Hidden initially)
        const panelGroup = new THREE.Group();
        panelGroup.position.set(1.8, 0, 0);
        panelGroup.visible = false;
        avatar.add(panelGroup);
        const panelGeo = new THREE.PlaneGeometry(1.5, 1);
        const panelMat = new THREE.MeshBasicMaterial({ color: 0x0a220a, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        // Add neon border
        const edges = new THREE.EdgesGeometry(panelGeo);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x39FF14, linewidth: 2 });
        const panelBorder = new THREE.LineSegments(edges, lineMat);
        panelGroup.add(panel);
        panelGroup.add(panelBorder);
        // Small 3D bars inside panel
        const barMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
        for (let i = 0; i < 4; i++) {
            const bh = 0.2 + Math.random() * 0.5;
            const bGeo = new THREE.BoxGeometry(0.1, bh, 0.1);
            const bMesh = new THREE.Mesh(bGeo, barMat);
            bMesh.position.set(-0.5 + i * 0.3, -0.5 + bh / 2, 0.1);
            panelGroup.add(bMesh);
        }

        // Orbiting Orbs
        const skillsObj = [
            { t: "Python", i: "🐍", d: "Production scripts" }, { t: "AWS", i: "☁️", d: "Deployed lambda" },
            { t: "Docker", i: "🐳", d: "Containerized UI" }, { t: "Tableau", i: "📊", d: "BI Dashboards" },
            { t: "Bloomberg", i: "💹", d: "BQL & Models" }, { t: "GenAI", i: "🤖", d: "LLM Agents" },
            { t: "K8s", i: "⚙️", d: "Cluster Orchestration" }, { t: "SQL", i: "🗄️", d: "Complex Queries" }
        ];
        const orbs = [];
        const orbGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const orbMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });

        for (let i = 0; i < 8; i++) {
            const orb = new THREE.Mesh(orbGeo, orbMat);
            orb.userData = { angle: (i / 8) * Math.PI * 2, speed: 0.005 + (Math.random() * 0.005), r: 2.5 + Math.random(), skill: skillsObj[i] };
            scene.add(orb);
            orbs.push(orb);
        }

        // Explosion particle array
        const explosions = [];

        // Raycaster for Hover/Click
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredOrb = null;
        let isHoveringAvatar = false;
        const tooltip = document.getElementById('orb-tooltip');

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;

            particles.rotation.x = mouse.y * 0.1;
            particles.rotation.y = mouse.x * 0.1;

            raycaster.setFromCamera(mouse, camera);

            const initInters = raycaster.intersectObject(avatar);
            if (initInters.length > 0) {
                isHoveringAvatar = true;
                eyeMat.color.setHex(0x00FFFF); // Eyes glow cyan
            } else {
                isHoveringAvatar = false;
                eyeMat.color.setHex(0xaaaaaa); // Eyes normal
            }

            const intersects = raycaster.intersectObjects(orbs);
            if (intersects.length > 0) {
                document.body.style.cursor = 'none';
                const obj = intersects[0].object;
                if (hoveredOrb !== obj) {
                    if (hoveredOrb) hoveredOrb.material.color.setHex(0x00FFFF);
                    hoveredOrb = obj;
                    hoveredOrb.material.color.setHex(0x39FF14);
                }
            } else {
                if (hoveredOrb) {
                    hoveredOrb.material.color.setHex(0x00FFFF);
                    hoveredOrb = null;
                }
            }
        });

        container.addEventListener('click', (e) => {
            if (hoveredOrb) {
                tooltip.classList.remove('hidden');
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = e.clientY + 'px';
                tooltip.innerHTML = `<strong>${hoveredOrb.userData.skill.i} ${hoveredOrb.userData.skill.t}</strong><br/>${hoveredOrb.userData.skill.d}`;

                // Trigger explosion
                createExplosion(hoveredOrb.position.clone());

                setTimeout(() => tooltip.classList.add('hidden'), 2500);
            }
        });

        function createExplosion(pos) {
            const ptGeo = new THREE.BufferGeometry();
            const ptPos = [];
            const ptVels = [];
            for (let i = 0; i < 40; i++) {
                ptPos.push(pos.x, pos.y, pos.z);
                ptVels.push((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
            }
            ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(ptPos, 3));
            const ptMat = new THREE.PointsMaterial({ color: 0x39FF14, size: 0.1, transparent: true, opacity: 1 });
            const pts = new THREE.Points(ptGeo, ptMat);
            scene.add(pts);
            explosions.push({ mesh: pts, vels: ptVels, life: 1.0 });
        }

        // Animation Loop
        let frame = 0;
        function animate() {
            requestAnimationFrame(animate);

            // Only render Three.js if in viewport
            const rect = container.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            frame++;

            if (!isHoveringAvatar) {
                avatar.rotation.y += 0.005;
                if (bubbleGroup.visible) bubble.rotation.y += 0.02; // Bubble rotation
            } else {
                avatar.rotation.y += 0.001; // Slow rotation on hover
                head.rotation.y = mouse.x * 0.5;
                head.rotation.x = -mouse.y * 0.5;
            }

            pedestal.rotation.y -= 0.002;

            orbs.forEach(orb => {
                orb.userData.angle += orb.userData.speed;
                orb.position.x = Math.cos(orb.userData.angle) * orb.userData.r;
                orb.position.z = Math.sin(orb.userData.angle) * orb.userData.r;
                orb.position.y = Math.sin(orb.userData.angle * 2) * 0.5;

                const s = 1 + Math.sin(frame * 0.05) * 0.2;
                if (orb !== hoveredOrb) orb.scale.set(s, s, s);
            });

            // Update explosions
            for (let i = explosions.length - 1; i >= 0; i--) {
                const ex = explosions[i];
                const positions = ex.mesh.geometry.attributes.position.array;
                for (let j = 0; j < positions.length; j += 3) {
                    positions[j] += ex.vels[j];
                    positions[j + 1] += ex.vels[j + 1];
                    positions[j + 2] += ex.vels[j + 2];
                }
                ex.mesh.geometry.attributes.position.needsUpdate = true;
                ex.life -= 0.05;
                ex.mesh.material.opacity = ex.life;
                if (ex.life <= 0) {
                    scene.remove(ex.mesh);
                    explosions.splice(i, 1);
                }
            }

            renderer.render(scene, camera);
        }
        animate();

        // State Buttons
        document.getElementById('btn-default').addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-controls button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            avMat.color.setHex(0x011100);
            head.position.set(0, 1.8, 0);
            head.rotation.set(0, 0, 0);
            bubbleGroup.visible = false;
            panelGroup.visible = false;
        });
        document.getElementById('btn-thinking').addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-controls button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            avMat.color.setHex(0x001111);
            head.position.set(0.2, 1.7, 0);
            head.rotation.z = -0.2;
            bubbleGroup.visible = true;
            panelGroup.visible = false;
        });
        document.getElementById('btn-presenting').addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-controls button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            avMat.color.setHex(0x111100);
            head.position.set(0, 1.8, 0);
            head.rotation.set(0, 0, 0);
            bubbleGroup.visible = false;
            panelGroup.visible = true;
        });

        window.addEventListener('resize', () => {
            const newW = container.clientWidth;
            const newH = container.clientHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
    }

});
