document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SCROLL REVEAL ENGINE ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 2. SMOOTH NAVIGATION & ACTIVE NAV HIGHLIGHT ---
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('section, footer');
    const headerHeight = 70;

    const navMap = {
        'Home': 'home',
        '4 Pillars': 'pillars',
        'Products': 'products',
        'Live Sandbox': 'sandbox',
        'Solutions': 'case-studies',
        'Philosophy': 'about',
        'Contact': 'contact'
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const label = link.textContent.trim();
            const targetId = navMap[label];
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                window.scrollTo({
                    top: targetEl.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll spy
    window.addEventListener('scroll', () => {
        let currentId = 'home';
        sections.forEach(sec => {
            if (sec.id && window.scrollY >= (sec.offsetTop - 150)) {
                currentId = sec.id;
            }
        });

        navLinks.forEach(link => {
            const label = link.textContent.trim();
            if (navMap[label] === currentId) {
                link.className = "nav-link text-cyan-400 border-b-2 border-cyan-400 pb-1 transition duration-200";
            } else {
                link.className = "nav-link text-gray-300 hover:text-cyan-400 transition duration-200 pb-1";
            }
        });
    });

    // --- 3. HERO CADDIUM ECOSYSTEM HUB QUADRANT SWITCHER ---
    const hubPillars = {
        iot: {
            title: '<i class="fa-solid fa-microchip text-cyan-400"></i> CADDium IoT Architecture',
            tag: 'CONNECTING THE REAL WORLD',
            tagClass: 'bg-cyan-950 text-cyan-300 border-cyan-500/30',
            titleClass: 'text-cyan-400',
            desc: 'Real-time edge hardware telemetry, Modbus/MQTT sensor gateway synchronization, industrial counter feeds, and automated PLC control routines.',
            actions: ['CONNECT', 'AUTOMATE', 'DEPLOY']
        },
        data: {
            title: '<i class="fa-solid fa-chart-pie text-emerald-400"></i> CADDium Data Architecture',
            tag: 'TURNING DATA INTO INSIGHTS',
            tagClass: 'bg-emerald-950 text-emerald-300 border-emerald-500/30',
            titleClass: 'text-emerald-400',
            desc: 'Enterprise analytical data warehouses, scheduled high-speed ETL pipelines, SQL performance tuning, and executive Power BI intelligence dashboards.',
            actions: ['ANALYZE', 'VISUALIZE', 'EMPOWER']
        },
        software: {
            title: '<i class="fa-solid fa-code text-amber-400"></i> CADDium Software Architecture',
            tag: 'BUILDING SYSTEMS THAT WORK',
            tagClass: 'bg-amber-950 text-amber-300 border-amber-500/30',
            titleClass: 'text-amber-400',
            desc: 'Full-stack enterprise web platforms, scalable cloud microservices, REST/GraphQL gateways, automated invoicing, and zero-downtime CI/CD deployment.',
            actions: ['BUILD', 'INTEGRATE', 'SCALE']
        },
        ai: {
            title: '<i class="fa-solid fa-brain text-purple-400"></i> CADDium AI Architecture',
            tag: 'INTELLIGENCE IN ACTION',
            tagClass: 'bg-purple-950 text-purple-300 border-purple-500/30',
            titleClass: 'text-purple-400',
            desc: 'Neural predictive maintenance algorithms, computer vision quality assurance, live operational anomaly detection, and automated dispatch agents.',
            actions: ['LEARN', 'PREDICT', 'INNOVATE']
        }
    };

    const quadBtns = {
        iot: document.getElementById('hero-quad-iot'),
        data: document.getElementById('hero-quad-data'),
        software: document.getElementById('hero-quad-software'),
        ai: document.getElementById('hero-quad-ai')
    };

    function setHubPillar(key) {
        const pillar = hubPillars[key];
        if (!pillar) return;

        // Reset all quad buttons
        Object.keys(quadBtns).forEach(k => {
            const btn = quadBtns[k];
            btn.className = "hero-quad-btn p-3.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 text-left transition text-gray-300";
        });

        // Set active style
        const activeStyles = {
            iot: "border-cyan-500/50 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(0,166,255,0.2)]",
            data: "border-emerald-500/50 bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]",
            software: "border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_20px_rgba(249,115,22,0.2)]",
            ai: "border-purple-500/50 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        };
        quadBtns[key].className = `hero-quad-btn p-3.5 rounded-xl border ${activeStyles[key]} text-left transition`;

        // Update hub output
        const titleEl = document.getElementById('hub-pill-title');
        titleEl.className = `font-bold ${pillar.titleClass} flex items-center gap-2`;
        titleEl.innerHTML = `<i class="fa-solid fa-circle text-[8px] animate-pulse"></i> ${pillar.title}`;

        const tagEl = document.getElementById('hub-pill-tag');
        tagEl.className = `text-[10px] border px-2 py-0.5 rounded font-bold ${pillar.tagClass}`;
        tagEl.textContent = pillar.tag;

        document.getElementById('hub-pill-desc').textContent = pillar.desc;
        document.getElementById('hub-act-1').textContent = pillar.actions[0];
        document.getElementById('hub-act-2').textContent = pillar.actions[1];
        document.getElementById('hub-act-3').textContent = pillar.actions[2];
    }

    Object.keys(quadBtns).forEach(k => {
        quadBtns[k].addEventListener('click', () => setHubPillar(k));
    });

    // --- 4. THE 4 PILLARS CARDS CLICK TRIGGER ---
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(card => {
        card.addEventListener('click', () => {
            const pillar = card.getAttribute('data-pillar');
            openConsultationWizard();

            // Pre-select corresponding pill in wizard step 2
            const checkMap = {
                iot: "CADDium IoT",
                data: "CADDium Data",
                software: "CADDium Software",
                ai: "CADDium AI"
            };

            const targetVal = checkMap[pillar];
            if (targetVal) {
                document.querySelectorAll('input[name="wizard-tech"]').forEach(cb => {
                    if (cb.value === targetVal) {
                        cb.checked = true;
                        cb.closest('.wizard-pill-checkbox').classList.add('card-active');
                        cb.closest('.wizard-pill-checkbox').querySelector('.checkbox-icon').className = "fa-solid fa-circle-check text-cyan-400 checkbox-icon animate-pulse";
                    }
                });
            }
        });
    });

    // --- 4B. DYNAMIC PRODUCT SUITE LOADER & FILTER ENGINE ---
    const productsContainer = document.getElementById('products-container');
    const filterContainer = document.getElementById('product-filter-container');

    const pillarMeta = {
        software: {
            label: "CADDium Software",
            accent: "amber",
            badgeBg: "bg-amber-950/90 text-amber-300 border-amber-500/30",
            icon: "fa-graduation-cap",
            iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-amber-500/20",
            cardBorder: "border-amber-500/30 hover:border-amber-500/80 hover:shadow-[0_0_40px_rgba(249,115,22,0.25)]",
            glowBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
            titleHover: "group-hover:text-amber-400",
            subTitle: "text-amber-300/80",
            btnGradient: "from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25",
            checkIcon: "text-amber-400"
        },
        data: {
            label: "CADDium Data",
            accent: "emerald",
            badgeBg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/30",
            icon: "fa-wand-magic-sparkles",
            iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20",
            cardBorder: "border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
            glowBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
            titleHover: "group-hover:text-emerald-400",
            subTitle: "text-emerald-300/80",
            btnGradient: "from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25",
            checkIcon: "text-emerald-400"
        },
        iot: {
            label: "CADDium IoT",
            accent: "cyan",
            badgeBg: "bg-cyan-950/90 text-cyan-300 border-cyan-500/30",
            icon: "fa-microchip",
            iconBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-cyan-500/20",
            cardBorder: "border-cyan-500/30 hover:border-cyan-500/80 hover:shadow-[0_0_40px_rgba(0,166,255,0.25)]",
            glowBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
            titleHover: "group-hover:text-cyan-400",
            subTitle: "text-cyan-300/80",
            btnGradient: "from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25",
            checkIcon: "text-cyan-400"
        },
        ai: {
            label: "CADDium AI",
            accent: "purple",
            badgeBg: "bg-purple-950/90 text-purple-300 border-purple-500/30",
            icon: "fa-brain",
            iconBg: "bg-purple-500/15 border-purple-500/30 text-purple-400 shadow-purple-500/20",
            cardBorder: "border-purple-500/30 hover:border-purple-500/80 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
            glowBg: "bg-purple-500/10 group-hover:bg-purple-500/20",
            titleHover: "group-hover:text-purple-400",
            subTitle: "text-purple-300/80",
            btnGradient: "from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 shadow-purple-500/25",
            checkIcon: "text-purple-400"
        }
    };

    function attachProductFilters() {
        const filterButtons = document.querySelectorAll('.product-filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterButtons.forEach(btn => {
            btn.onclick = () => {
                const filter = btn.getAttribute('data-filter');

                filterButtons.forEach(b => {
                    b.className = "product-filter-btn px-4 py-2 rounded-xl transition text-gray-300 hover:text-white";
                });
                btn.className = "product-filter-btn px-4 py-2 rounded-xl transition bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/20";

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            };
        });
    }

    function renderDynamicProducts(products) {
        if (!productsContainer) return;

        let cardsHtml = '';
        let counts = { all: products.length, software: 0, data: 0, iot: 0, ai: 0 };

        products.forEach(p => {
            const pkey = (p.pillar || 'software').toLowerCase();
            if (counts[pkey] !== undefined) counts[pkey]++;
            const meta = pillarMeta[pkey] || pillarMeta.software;

            const highlightsHtml = (p.highlights || []).map(h => `
                <div class="flex items-center gap-2.5 text-gray-300">
                    <i class="fa-solid fa-circle-check ${meta.checkIcon} text-xs"></i>
                    <span>${h}</span>
                </div>
            `).join('');

            const tagsHtml = (p.techTags || []).map(t => `
                <span class="bg-slate-900 border border-white/10 text-gray-300 text-[10px] font-mono px-2.5 py-1 rounded">${t}</span>
            `).join('');

            cardsHtml += `
                <div class="product-card glass-card rounded-2xl border ${meta.cardBorder} p-8 flex flex-col justify-between reveal active group transition-all duration-300 relative overflow-hidden" data-category="${pkey}">
                    <div class="absolute -right-10 -top-10 w-36 h-36 ${meta.glowBg} rounded-full filter blur-2xl transition duration-500"></div>
                    
                    <div>
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-14 h-14 rounded-2xl ${meta.iconBg} border flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition duration-300">
                                <i class="fa-solid ${meta.icon}"></i>
                            </div>
                            <div class="flex flex-col items-end gap-1.5">
                                <span class="text-[10px] font-mono font-bold ${meta.badgeBg} border px-3 py-1 rounded-full uppercase tracking-wider">
                                    ${p.pillarLabel || meta.label}
                                </span>
                                <span class="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ${p.status || "Live Production App"}
                                </span>
                            </div>
                        </div>

                        <h3 class="text-2xl font-black text-white font-brand mb-1 ${meta.titleHover} transition">
                            ${p.name}
                        </h3>
                        <p class="text-xs font-bold uppercase tracking-wider ${meta.subTitle} mb-4">
                            ${p.tagline}
                        </p>
                        <p class="text-gray-300 text-xs leading-relaxed mb-6">
                            ${p.description}
                        </p>

                        <div class="space-y-2.5 mb-6 pt-4 border-t border-white/10 text-xs">
                            ${highlightsHtml}
                        </div>

                        <div class="flex flex-wrap gap-1.5 mb-6">
                            ${tagsHtml}
                        </div>
                    </div>

                    <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                        <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-gradient-to-r ${meta.btnGradient} text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl text-center flex items-center justify-center gap-2.5 shadow-lg transition group/btn">
                            <span>Open Live Website</span>
                            <i class="fa-solid fa-arrow-up-right-from-square text-[11px] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"></i>
                        </a>
                        <button class="open-consultation px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5" title="Request customized deployment">
                            <i class="fa-solid fa-sliders"></i> <span>Custom Scope</span>
                        </button>
                    </div>
                </div>
            `;
        });

        // Add Future Pipeline Card
        cardsHtml += `
            <div class="product-card border border-dashed border-white/20 bg-slate-950/50 hover:bg-slate-950/80 rounded-2xl p-8 flex flex-col justify-between reveal active transition-all duration-300 relative overflow-hidden group" data-category="future">
                <div>
                    <div class="flex justify-between items-start mb-6">
                        <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition duration-300">
                            <i class="fa-solid fa-rocket"></i>
                        </div>
                        <span class="text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            Pipeline
                        </span>
                    </div>

                    <h3 class="text-2xl font-black text-white font-brand mb-1 group-hover:text-cyan-400 transition">
                        More Products in Development
                    </h3>
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                        Expanding the CADDium Ecosystem
                    </p>
                    <p class="text-gray-300 text-xs leading-relaxed mb-6">
                        We are continuously developing and deploying specialized solutions across IoT edge systems and predictive AI engines. Have an operational challenge that needs a custom engineered tool?
                    </p>

                    <div class="space-y-3 mb-6 pt-4 border-t border-white/10 text-xs">
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <i class="fa-solid fa-microchip text-cyan-400"></i>
                                <span class="text-white font-bold">CADDium IoT Gateway Suite</span>
                            </div>
                            <span class="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">In Progress</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <i class="fa-solid fa-brain text-purple-400"></i>
                                <span class="text-white font-bold">CADDium Vision QA Classifier</span>
                            </div>
                            <span class="text-[9px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">Upcoming</span>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-white/10">
                    <button class="open-consultation w-full bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 hover:text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition">
                        <span>Commission a Custom Product</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </div>
        `;

        productsContainer.innerHTML = cardsHtml;

        // Update Filter Buttons HTML
        if (filterContainer) {
            let filterHtml = `<button data-filter="all" class="product-filter-btn px-4 py-2 rounded-xl transition bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/20">All Products (${counts.all})</button>`;
            if (counts.software > 0) {
                filterHtml += `<button data-filter="software" class="product-filter-btn px-4 py-2 rounded-xl transition text-gray-300 hover:text-amber-400">Software (${counts.software})</button>`;
            }
            if (counts.data > 0) {
                filterHtml += `<button data-filter="data" class="product-filter-btn px-4 py-2 rounded-xl transition text-gray-300 hover:text-emerald-400">Data (${counts.data})</button>`;
            }
            if (counts.ai > 0) {
                filterHtml += `<button data-filter="ai" class="product-filter-btn px-4 py-2 rounded-xl transition text-gray-300 hover:text-purple-400">AI (${counts.ai})</button>`;
            }
            if (counts.iot > 0) {
                filterHtml += `<button data-filter="iot" class="product-filter-btn px-4 py-2 rounded-xl transition text-gray-300 hover:text-cyan-400">IoT (${counts.iot})</button>`;
            }
            filterHtml += `<button data-filter="future" class="product-filter-btn px-4 py-2 rounded-xl transition text-gray-400 hover:text-white">Upcoming & Custom</button>`;
            filterContainer.innerHTML = filterHtml;
        }

        // Reattach filter handlers & consultation modal triggers
        attachProductFilters();
        document.querySelectorAll('#products-container .open-consultation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openConsultationWizard();
            });
        });
    }

    // Fetch products from backend API
    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                renderDynamicProducts(data.data);
            } else {
                attachProductFilters();
            }
        })
        .catch(err => {
            console.warn("Using static product cards fallback:", err);
            attachProductFilters();
        });

    // --- 5. INTERACTIVE 4-PILLAR SANDBOX / PLAYGROUND TERMINAL ---
    const sandboxScenarios = {
        iot: {
            session: "caddium-terminal@edge-gateway-01:~$",
            task: "// Executing CADDium IoT Edge Telemetry Stream...",
            port: "PORT: 8883 (MQTTS)",
            code: `{
  "device_id": "CADD-EDGE-SENS-094",
  "temperature": 78.4,
  "vibration_g": 0.042,
  "pressure_bar": 4.19,
  "flow_rate_lpm": 124.8,
  "status": "OPTIMAL_RUNNING"
}`,
            status: "Status: 200 OK (Packet Ack in 4.2ms)",
            subtitle: "JSON Ingest Rate: 1,200 msg/sec",
            headers: ["Metric", "Current", "Threshold", "State"],
            rows: [
                ["Core Temp", "78.4 °C", "95.0 °C max", "In Spec"],
                ["Vibration Axis-Z", "0.042 g", "0.150 g max", "Balanced"],
                ["Line Pressure", "4.19 Bar", "4.0 - 5.5 Bar", "Normal"],
                ["Flow Rate", "124.8 LPM", "100.0 LPM min", "Stable"]
            ]
        },
        data: {
            session: "caddium-terminal@data-warehouse:~$",
            task: "// Executing CADDium Data Analytical SQL Query...",
            port: "PORT: 5432 (PostgreSQL)",
            code: `SELECT region, 
       SUM(produced_units) AS units, 
       SUM(revenue) AS total_rev,
       ROUND(AVG(oee_percentage), 2) AS avg_oee
FROM enterprise_mfg_log
WHERE log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region 
ORDER BY total_rev DESC;`,
            status: "Status: 200 OK (Query execution time: 7.8ms)",
            subtitle: "Total Rows Aggregated: 4.8M records",
            headers: ["Region Cluster", "Produced Units", "Total Revenue", "Avg OEE"],
            rows: [
                ["West Hub (MH/GJ)", "1,240,500 Units", "₹12.45 Cr", "89.4%"],
                ["South Cluster (KA/TN)", "980,200 Units", "₹9.82 Cr", "87.8%"],
                ["North Hub (NCR/PB)", "640,000 Units", "₹6.15 Cr", "85.2%"],
                ["East Hub (WB/OD)", "420,100 Units", "₹4.02 Cr", "84.1%"]
            ]
        },
        software: {
            session: "caddium-terminal@api-gateway:~$",
            task: "// Probing CADDium Cloud Microservice Mesh Health...",
            port: "PORT: 443 (HTTP/2 gRPC)",
            code: `GET /api/v2/mesh/health HTTP/2.0
Host: gateway.internal.caddium.com
Authorization: Bearer cadd_sec_live_902

Response Payload:
{
  "cluster": "caddium-prod-west-01",
  "healthy_nodes": 24,
  "active_services": ["auth", "orders", "inventory", "telemetry"],
  "average_latency_ms": 1.9
}`,
            status: "Status: 200 OK (Mesh Verification in 1.9ms)",
            subtitle: "Active Pods: 24/24 | Failover: Synchronized",
            headers: ["Microservice", "Protocol", "P99 Latency", "Cluster State"],
            rows: [
                ["Auth & Identity Service", "gRPC / TLS", "1.2 ms", "Healthy (100%)"],
                ["Order Dispatch Engine", "REST / JSON", "2.4 ms", "Healthy (100%)"],
                ["Telemetry Ingest Bus", "Kafka Event Stream", "1.8 ms", "Healthy (100%)"],
                ["Notification Dispatcher", "WebSockets / SMTP", "3.1 ms", "Healthy (100%)"]
            ]
        },
        ai: {
            session: "caddium-terminal@ai-inference-engine:~$",
            task: "// Running CADDium Neural Predictive Anomaly Inference...",
            port: "PORT: 8080 (TensorRT)",
            code: `# Loading CADDium Acoustic Predictive Anomaly Weights
model = CaddiumPredictiveEngine.load('v4.2-acoustic')
inference = model.evaluate_bearing_stream(window='72h', buffer_size=1024)

# Output Tensor:
{
  "component": "Spindle-Bearing-04",
  "failure_probability_72h": 0.012,
  "confidence_score": 0.994,
  "status": "SAFE_RUNNING"
}`,
            status: "Status: 200 OK (Inference completed in 11.2ms)",
            subtitle: "Model Confidence: 99.4% | False Positive Rate: <0.02%",
            headers: ["Component Tracked", "Variance Signature", "Failure Risk (72h)", "Action Trigger"],
            rows: [
                ["Main Spindle Bearing #04", "0.012% harmonic dev", "1.2% (Minimal)", "Continue Normal"],
                ["Gearbox Reducer #02", "0.084% thermal shift", "3.8% (Elevated)", "Routine Check Shift 3"],
                ["Hydraulic Fluid Pump #01", "0.005% acoustic dev", "0.4% (Minimal)", "Optimal"],
                ["Conveyor Drive Motor #07", "0.019% load deviation", "1.8% (Normal)", "Scheduled Maintenance"]
            ]
        }
    };

    const sandboxBtns = {
        iot: document.getElementById('scenario-iot'),
        data: document.getElementById('scenario-data'),
        software: document.getElementById('scenario-software'),
        ai: document.getElementById('scenario-ai')
    };

    function runSandboxScenario(key) {
        const scen = sandboxScenarios[key];
        if (!scen) return;

        // Update button states
        Object.keys(sandboxBtns).forEach(k => {
            const btn = sandboxBtns[k];
            btn.className = "w-full text-left p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 transition flex items-center justify-between font-semibold text-xs text-gray-300";
            btn.querySelector('i.fa-play').className = "fa-solid fa-play text-gray-500 text-[10px]";
        });

        const activeStyles = {
            iot: "border-cyan-500/50 bg-cyan-500/10 text-white",
            data: "border-emerald-500/50 bg-emerald-500/10 text-white",
            software: "border-amber-500/50 bg-amber-500/10 text-white",
            ai: "border-purple-500/50 bg-purple-500/10 text-white"
        };
        sandboxBtns[key].className = `w-full text-left p-4 rounded-xl border ${activeStyles[key]} transition flex items-center justify-between font-semibold text-xs text-white shadow-lg`;
        sandboxBtns[key].querySelector('i.fa-play').className = "fa-solid fa-play text-cyan-400 text-[10px]";

        // Display Loading
        document.getElementById('terminal-session-title').textContent = scen.session;
        document.getElementById('terminal-task-label').textContent = scen.task;
        document.querySelector('#terminal-task-label + span').textContent = scen.port;
        document.getElementById('terminal-code').textContent = "Executing instruction payload...";
        document.getElementById('terminal-exec-status').innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Processing...`;

        setTimeout(() => {
            document.getElementById('terminal-code').textContent = scen.code;
            document.getElementById('terminal-exec-status').innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> ${scen.status}`;
            document.querySelector('#terminal-output .text-gray-500').textContent = scen.subtitle;

            // Render Header
            const headTr = document.getElementById('terminal-table-head');
            headTr.innerHTML = "";
            scen.headers.forEach(h => {
                const th = document.createElement('th');
                th.className = "pb-2";
                th.textContent = h;
                headTr.appendChild(th);
            });

            // Render Body
            const body = document.getElementById('terminal-table-body');
            body.innerHTML = "";
            scen.rows.forEach(r => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="py-2 font-mono text-cyan-400 font-semibold">${r[0]}</td>
                    <td class="py-2 text-white font-bold">${r[1]}</td>
                    <td class="py-2 text-gray-400">${r[2]}</td>
                    <td class="py-2 text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> ${r[3]}</td>
                `;
                body.appendChild(tr);
            });
        }, 200);
    }

    Object.keys(sandboxBtns).forEach(k => {
        sandboxBtns[k].addEventListener('click', () => runSandboxScenario(k));
    });

    // --- 6. CASE STUDIES MODAL ENGINE ---
    const projectDetails = {
        'iot-telemetry': {
            title: "Industrial Sensor Grid & PLC Telemetry Suite",
            desc: "A continuous manufacturing plant required comprehensive edge monitoring across 400+ induction furnaces, CNC mills, and cooling manifolds. CADDium engineered an edge IoT architecture using industrial Modbus gateways that streams temperature, acoustic vibration, and line pressure via MQTT to a central control room. Reduced unpredicted machine downtime by 38% in the first quarter.",
            tech: ["CADDium IoT Edge Gateways", "MQTT Protocols", "Modbus RS-485", "PostgreSQL TimescaleDB", "Real-Time Telemetry"],
            outcomes: [
                "400+ physical industrial endpoints connected with sub-second latency",
                "Machine downtime incidents reduced by 38% year-over-year",
                "Automated emergency threshold triggers dispatched directly to engineers",
                "Real-time edge buffering ensures zero packet loss during network blips"
            ]
        },
        'enterprise-data': {
            title: "Multi-Tier Data Warehouse & Executive Power BI",
            desc: "An enterprise retail brand with 180 regional centers lacked unified operational visibility across distributed databases. CADDium designed a multi-tier data warehouse with automated nightly and 5-minute incremental ETL pipelines. We modeled custom DAX calculations and deployed executive Power BI suites providing real-time P&L, inventory depletion, and regional sales performance.",
            tech: ["CADDium Data Architecture", "Power BI Desktop & Service", "SQL Server / PostgreSQL", "Python Data Pipelines", "DAX Formulas"],
            outcomes: [
                "Daily report generation cycles slashed from 6 hours to under 30 seconds",
                "Consolidated 180 regional databases into one clean single source of truth",
                "Executive team enabled with instant drill-down across inventory and revenue",
                "Automated alerts triggered whenever regional KPI targets deviate"
            ]
        },
        'cloud-erp': {
            title: "Cloud Logistics ERP & High-Throughput Microservice Bus",
            desc: "A freight logistics enterprise required a modernized digital infrastructure to replace legacy desktop software. CADDium built a cloud-native ERP platform on a microservices architecture. It automates container dispatching, customer tracking portals, dynamic invoice generation, and vendor webhooks, supporting thousands of concurrent operations.",
            tech: ["CADDium Software Engineering", "Node.js & Express", "Docker & Kubernetes", "REST & GraphQL APIs", "PostgreSQL & Redis"],
            outcomes: [
                "Achieved 99.99% system availability through resilient container clusters",
                "Order dispatch processing time reduced by 65%",
                "Automated PDF invoicing and instant email/SMS webhooks for clients",
                "Scalable API gateway easily handles peak seasonal volume spikes"
            ]
        },
        'predictive-ai': {
            title: "Predictive Maintenance & Computer Vision QA Engine",
            desc: "A high-precision automotive components manufacturer experienced costly product rejections and unexpected spindle bearing breakdowns. CADDium deployed lightweight neural network models trained on high-frequency acoustic signatures and thermal imaging. The AI predicts mechanical failures up to 72 hours before they occur and automates visual defect classification.",
            tech: ["CADDium AI Models", "PyTorch / ONNX Runtime", "Computer Vision Inspection", "Acoustic Anomaly Detection", "Edge ML Inference"],
            outcomes: [
                "99.2% accuracy in detecting minute component surface scratches and burrs",
                "Preemptively averted 14 major mechanical spindle failures within 6 months",
                "False positive alert rate contained below 0.02%",
                "Reduced QA inspection labor overhead by 45%"
            ]
        }
    };

    const detailsModal = document.getElementById('details-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const modalDetailsCloseBtn = document.getElementById('modal-details-close-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    function openProjectDetails(key) {
        const proj = projectDetails[key];
        if (!proj) return;

        document.getElementById('modal-project-title').textContent = proj.title;
        document.getElementById('modal-project-desc').textContent = proj.desc;
        
        // Tech stack
        const techContainer = document.getElementById('modal-project-tech');
        techContainer.innerHTML = "";
        proj.tech.forEach(t => {
            const span = document.createElement('span');
            span.className = "bg-slate-900 border border-white/10 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded";
            span.textContent = t;
            techContainer.appendChild(span);
        });

        // Outcomes
        const outcomesList = document.getElementById('modal-project-outcomes');
        outcomesList.innerHTML = "";
        proj.outcomes.forEach(o => {
            const li = document.createElement('li');
            li.textContent = o;
            outcomesList.appendChild(li);
        });

        detailsModal.classList.remove('hidden');
        setTimeout(() => {
            detailsModal.classList.add('show-modal');
        }, 10);
        document.body.classList.add('overflow-hidden');
    }

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-project');
            openProjectDetails(key);
        });
    });

    function hideDetailsModal() {
        detailsModal.classList.remove('show-modal');
        setTimeout(() => {
            detailsModal.classList.add('hidden');
        }, 300);
        document.body.classList.remove('overflow-hidden');
    }

    closeDetailsModalBtn.addEventListener('click', hideDetailsModal);
    modalDetailsCloseBtn.addEventListener('click', hideDetailsModal);
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) hideDetailsModal();
    });

    // --- 7. MULTI-STEP CONSULTATION WIZARD ENGINE ---
    const consultationModal = document.getElementById('consultation-modal');
    const openModalButtons = document.querySelectorAll('.open-consultation');
    const closeModalButton = document.getElementById('close-modal');
    const wizardForm = document.getElementById('consultation-wizard-form');
    
    const wizardSteps = [
        document.getElementById('wizard-step-1'),
        document.getElementById('wizard-step-2'),
        document.getElementById('wizard-step-3')
    ];
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const progressBar = document.getElementById('wizard-progress-bar');
    const stepIndicator = document.getElementById('wizard-step-indicator');
    const successScreen = document.getElementById('wizard-success-screen');
    const successCloseBtn = document.getElementById('wizard-success-close');

    let currentStep = 1;

    function openConsultationWizard() {
        // If details modal was open, close it
        hideDetailsModal();

        consultationModal.classList.remove('hidden');
        setTimeout(() => {
            consultationModal.classList.add('show-modal');
        }, 10);
        document.body.classList.add('overflow-hidden');
        goToStep(1);
    }

    function hideConsultationWizard() {
        consultationModal.classList.remove('show-modal');
        setTimeout(() => {
            consultationModal.classList.add('hidden');
            wizardForm.reset();
            successScreen.classList.add('hidden');
            currentStep = 1;
            document.querySelectorAll('.wizard-pill-checkbox').forEach(pill => {
                pill.classList.remove('card-active');
                pill.querySelector('.checkbox-icon').className = "fa-solid fa-circle-check text-gray-600 checkbox-icon";
            });
        }, 300);
        document.body.classList.remove('overflow-hidden');
    }

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openConsultationWizard();
        });
    });

    closeModalButton.addEventListener('click', hideConsultationWizard);
    consultationModal.addEventListener('click', (e) => {
        if (e.target === consultationModal) hideConsultationWizard();
    });

    // Pill Checkboxes Toggle
    const pillCheckboxes = document.querySelectorAll('.wizard-pill-checkbox');
    pillCheckboxes.forEach(pill => {
        pill.addEventListener('click', () => {
            const input = pill.querySelector('input[type="checkbox"]');
            input.checked = !input.checked;
            
            const icon = pill.querySelector('.checkbox-icon');
            if (input.checked) {
                pill.classList.add('card-active');
                icon.className = "fa-solid fa-circle-check text-cyan-400 checkbox-icon animate-pulse";
            } else {
                pill.classList.remove('card-active');
                icon.className = "fa-solid fa-circle-check text-gray-600 checkbox-icon";
            }
        });
    });

    function validateStep(step) {
        if (step === 1) {
            const nameVal = document.getElementById('wizard-name').value.trim();
            const emailVal = document.getElementById('wizard-email').value.trim();
            const companyVal = document.getElementById('wizard-company').value.trim();
            
            if (!nameVal || !emailVal || !companyVal) {
                alert("Please fill in your name, business email, and company.");
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(emailVal)) {
                alert("Please enter a valid business email address.");
                return false;
            }
            return true;
        }
        if (step === 2) {
            const checkedPillars = document.querySelectorAll('input[name="wizard-tech"]:checked');
            if (checkedPillars.length === 0) {
                alert("Please select at least one CADDium pillar to proceed.");
                return false;
            }
            return true;
        }
        if (step === 3) {
            const goalsVal = document.getElementById('wizard-goals').value.trim();
            if (!goalsVal) {
                alert("Please share a brief summary of your project requirements.");
                return false;
            }
            return true;
        }
        return true;
    }

    function goToStep(step) {
        currentStep = step;
        
        wizardSteps.forEach((s, idx) => {
            if (idx + 1 === step) {
                s.classList.remove('hidden');
            } else {
                s.classList.add('hidden');
            }
        });

        const progressPct = (step / wizardSteps.length) * 100;
        progressBar.style.width = `${progressPct}%`;
        stepIndicator.textContent = `Step ${step} of 3`;

        if (step === 1) {
            prevBtn.setAttribute('disabled', 'true');
        } else {
            prevBtn.removeAttribute('disabled');
        }

        if (step === 3) {
            nextBtn.innerHTML = `<span>Dispatch Scope</span> <i class="fa-regular fa-paper-plane text-xs"></i>`;
        } else {
            nextBtn.innerHTML = `<span>Continue</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
        }
    }

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;

        if (currentStep < 3) {
            goToStep(currentStep + 1);
        } else {
            nextBtn.setAttribute('disabled', 'true');
            nextBtn.innerHTML = `<span>Transmitting...</span> <i class="fa-solid fa-spinner animate-spin"></i>`;
            
            const selectedPillars = Array.from(document.querySelectorAll('input[name="wizard-tech"]:checked')).map(cb => cb.value);

            const payload = {
                clientName: document.getElementById('wizard-name').value,
                email: document.getElementById('wizard-email').value,
                company: document.getElementById('wizard-company').value,
                technologies: selectedPillars,
                goals: document.getElementById('wizard-goals').value,
                urgency: document.getElementById('wizard-urgency').value
            };

            fetch('/api/consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    successScreen.classList.remove('hidden');
                } else {
                    alert(`Submission error: ${data.message}`);
                }
            })
            .catch(err => {
                console.error("Networking error:", err);
                alert("Unable to reach CADDium backend service.");
            })
            .finally(() => {
                nextBtn.removeAttribute('disabled');
                nextBtn.innerHTML = `<span>Dispatch Scope</span> <i class="fa-regular fa-paper-plane text-xs"></i>`;
            });
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    successCloseBtn.addEventListener('click', hideConsultationWizard);
});
