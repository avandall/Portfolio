/**
 * AI-Powered Systems Developer Portfolio - Interactive Script (`app.js`)
 * High-Contrast Engineering Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactModal();
    initDiagramControls();
    initLatencySimulator();
    initWMSInspector();
    initCollapsibleCards();
});

/* ==========================================================================
   1. Contact Modal Controller
   ========================================================================== */
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openBtns = [
        document.getElementById('open-contact-btn-nav'),
        document.getElementById('open-contact-btn-hero'),
        document.getElementById('open-contact-btn-footer')
    ];
    const closeBtn = document.getElementById('close-modal-btn');

    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    const mailtoUrl = `mailto:vunguyen.ai.engineer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender Email: " + email + "\n\n" + message)}`;
    window.location.href = mailtoUrl;

    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   2. Architecture Diagram Filter Chips (Project 1)
   ========================================================================== */
function initDiagramControls() {
    const chips = document.querySelectorAll('.diagram-controls .chip');
    const nodeGroups = document.querySelectorAll('.node-group');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const step = chip.dataset.step;

            nodeGroups.forEach(node => {
                if (step === 'all' || node.classList.contains(`step-${step}`)) {
                    node.classList.remove('dimmed');
                } else {
                    node.classList.add('dimmed');
                }
            });
        });
    });
}

/* ==========================================================================
   3. Time-to-First-Audio (TTFA) Latency Simulator (Project 1)
   ========================================================================== */
function initLatencySimulator() {
    const playStandardBtn = document.getElementById('play-standard-btn');
    const playOptimizedBtn = document.getElementById('play-optimized-btn');

    const progStandard = document.getElementById('prog-standard');
    const statusStandard = document.getElementById('status-standard');

    const progOptimized = document.getElementById('prog-optimized');
    const statusOptimized = document.getElementById('status-optimized');

    let standardTimer = null;
    let optimizedTimer = null;

    if (playStandardBtn) {
        playStandardBtn.addEventListener('click', () => {
            if (standardTimer) clearInterval(standardTimer);

            playStandardBtn.disabled = true;
            progStandard.style.width = '0%';
            statusStandard.textContent = '[STATUS: WAITING_REST_RESPONSE_3500MS...]';
            statusStandard.className = 'sim-status text-danger';

            let elapsed = 0;
            const total = 3500;

            standardTimer = setInterval(() => {
                elapsed += 100;
                const pct = Math.min((elapsed / total) * 100, 100);
                progStandard.style.width = `${pct}%`;

                if (elapsed >= total) {
                    clearInterval(standardTimer);
                    statusStandard.textContent = '🔊 [AUDIO_RECEIVED: LATENCY = 3,500ms]';
                    statusStandard.className = 'sim-status text-danger';
                    playStandardBtn.disabled = false;
                    playTone(440, 0.3);
                }
            }, 100);
        });
    }

    if (playOptimizedBtn) {
        playOptimizedBtn.addEventListener('click', () => {
            if (optimizedTimer) clearInterval(optimizedTimer);

            playOptimizedBtn.disabled = true;
            progOptimized.style.width = '0%';
            statusOptimized.textContent = '[STATUS: INITIALIZING_WS_STREAM...]';
            statusOptimized.className = 'sim-status text-emerald';

            setTimeout(() => {
                playTone(880, 0.15);
                statusOptimized.textContent = '⚡ [FILLER_PLAYED: "Hmm..." at 150ms | WS_STREAMING...]';
            }, 150);

            let elapsed = 0;
            const total = 1200;

            optimizedTimer = setInterval(() => {
                elapsed += 100;
                const pct = Math.min((elapsed / total) * 100, 100);
                progOptimized.style.width = `${pct}%`;

                if (elapsed >= total) {
                    clearInterval(optimizedTimer);
                    statusOptimized.textContent = '✨ [STREAM_COMPLETE: TTFA = 150ms | ZERO_PERCEIVED_DELAY]';
                    statusOptimized.className = 'sim-status text-emerald';
                    playOptimizedBtn.disabled = false;
                }
            }, 100);
        });
    }
}

function playTone(freq, duration) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio Context error', e);
    }
}

/* ==========================================================================
   4. Enterprise WMS Architecture & 19 MCP Tools Inspector (Project 3 - WMS_Root)
   ========================================================================== */

const MCP_TOOLS_DATA = [
    {
        name: "get_stock_availability",
        category: "Inventory Queries",
        desc: "Fetch real-time on-hand, reserved, and available stock balance across multi-warehouse locations with atomic read locks.",
        params: `{ "sku": "SKU-9921", "warehouse_id": "WH-HCM-01" }`,
        snippet: `async def get_stock_availability(sku: str, warehouse_id: str) -> StockResponse:\n    return await db.fetch_stock_isolated(sku, warehouse_id)`
    },
    {
        name: "allocate_inventory",
        category: "Order Fulfillment",
        desc: "Lock and reserve specific inventory line items for pending customer orders using row-level FOR UPDATE locks.",
        params: `{ "order_id": "ORD-5541", "sku": "SKU-9921", "qty": 50 }`,
        snippet: `async def allocate_inventory(order_id: str, sku: str, qty: int):\n    async with db.transaction():\n        await lock_stock_row(sku)\n        return await execute_allocation(order_id, qty)`
    },
    {
        name: "release_inventory_lock",
        category: "Order Fulfillment",
        desc: "Release expired or canceled inventory lock reservations back into available pickable stock.",
        params: `{ "reservation_id": "RES-8812" }`,
        snippet: `async def release_inventory_lock(reservation_id: str):\n    return await redis_client.release_distributed_lock(reservation_id)`
    },
    {
        name: "create_inbound_shipment",
        category: "Receiving & Logistics",
        desc: "Register a new inbound supplier manifest and generate receiving dock staging tickets.",
        params: `{ "supplier_id": "SUP-401", "expected_pallets": 12 }`,
        snippet: `async def create_inbound_shipment(supplier_id: str, expected_pallets: int):\n    return await shipment_service.create_manifest(supplier_id, expected_pallets)`
    },
    {
        name: "verify_barcode_scan",
        category: "Dock Operations",
        desc: "Validate scanned EAN13 or QR barcode against global product master catalog.",
        params: `{ "barcode": "8935001294812" }`,
        snippet: `async def verify_barcode_scan(barcode: str):\n    return await catalog_service.lookup_barcode(barcode)`
    },
    {
        name: "generate_picking_route",
        category: "Warehouse Logistics",
        desc: "Calculate shortest TSP warehouse aisle path for picking operators.",
        params: `{ "picker_id": "EMP-94", "order_items": ["BIN-A12", "BIN-B04"] }`,
        snippet: `async def generate_picking_route(order_items: list[str]):\n    return await route_optimizer.calculate_shortest_path(order_items)`
    },
    {
        name: "query_rag_knowledge",
        category: "AI & RAG",
        desc: "Query hybrid ChromaDB vector embeddings + BM25 keyword index for warehouse SOP guidelines.",
        params: `{ "query": "Hazardous chemical spill handling procedure" }`,
        snippet: `async def query_rag_knowledge(query: str):\n    return await hybrid_retriever.search(query, top_k=3)`
    },
    {
        name: "trigger_cycle_count",
        category: "Audit & Compliance",
        desc: "Initiate periodic physical inventory audit check on a specific rack zone.",
        params: `{ "zone_id": "ZONE-COLD-02" }`,
        snippet: `async def trigger_cycle_count(zone_id: str):\n    return await audit_service.start_cycle_count(zone_id)`
    },
    {
        name: "calculate_freight_cost",
        category: "Shipping & Rates",
        desc: "Compute 3PL shipping carrier freight rate by volumetric weight and destination zone.",
        params: `{ "weight_kg": 45.2, "volumetric_cbm": 0.35, "postal_code": "70000" }`,
        snippet: `async def calculate_freight_cost(weight_kg: float, volumetric_cbm: float):\n    return await rate_engine.get_cheapest_carrier_quote(weight_kg, volumetric_cbm)`
    },
    {
        name: "get_warehouse_capacity",
        category: "Metrics & Analytics",
        desc: "Return total cubic meters capacity vs allocated storage space metrics.",
        params: `{ "warehouse_id": "WH-HCM-01" }`,
        snippet: `async def get_warehouse_capacity(warehouse_id: str):\n    return await analytics_service.get_utilization_metrics(warehouse_id)`
    },
    {
        name: "update_bin_location",
        category: "Dock Operations",
        desc: "Transfer putaway SKU units from receiving staging dock to final storage bin location.",
        params: `{ "sku": "SKU-9921", "from_bin": "DOCK-01", "to_bin": "RACK-C14-3" }`,
        snippet: `async def update_bin_location(sku: str, to_bin: str):\n    return await location_service.move_stock(sku, to_bin)`
    },
    {
        name: "generate_shipping_label",
        category: "Shipping & Rates",
        desc: "Render ZPL / PDF carrier shipping label with tracking number barcode.",
        params: `{ "order_id": "ORD-5541", "carrier": "DHL_EXPRESS" }`,
        snippet: `async def generate_shipping_label(order_id: str, carrier: str):\n    return await carrier_api.create_label(order_id, carrier)`
    },
    {
        name: "audit_stock_movement",
        category: "Audit & Compliance",
        desc: "Fetch immutable transaction ledger history for audit verification.",
        params: `{ "sku": "SKU-9921", "limit": 50 }`,
        snippet: `async def audit_stock_movement(sku: str):\n    return await ledger_service.get_history(sku)`
    },
    {
        name: "reconcile_discrepancy",
        category: "Audit & Compliance",
        desc: "Adjust system stock balance following verified physical cycle count audit.",
        params: `{ "sku": "SKU-9921", "actual_qty": 48, "reason": "Damaged box" }`,
        snippet: `async def reconcile_discrepancy(sku: str, actual_qty: int):\n    return await audit_service.reconcile(sku, actual_qty)`
    },
    {
        name: "flag_damaged_goods",
        category: "Quality Control",
        desc: "Quarantine damaged inventory units out of active pickable stock.",
        params: `{ "sku": "SKU-9921", "qty": 2, "quarantine_bin": "QUARANTINE-A" }`,
        snippet: `async def flag_damaged_goods(sku: str, qty: int):\n    return await qc_service.quarantine_items(sku, qty)`
    },
    {
        name: "get_low_stock_alerts",
        category: "Inventory Queries",
        desc: "Fetch all SKUs currently below automated safety reorder points.",
        params: `{ "warehouse_id": "WH-HCM-01" }`,
        snippet: `async def get_low_stock_alerts(warehouse_id: str):\n    return await reorder_service.check_safety_stock(warehouse_id)`
    },
    {
        name: "assign_picker_task",
        category: "Warehouse Logistics",
        desc: "Dispatch priority picking order task to available handheld RF scanner operator.",
        params: `{ "picker_id": "EMP-94", "task_id": "TSK-1029" }`,
        snippet: `async def assign_picker_task(picker_id: str, task_id: str):\n    return await dispatch_service.assign(picker_id, task_id)`
    },
    {
        name: "export_inventory_csv",
        category: "Metrics & Analytics",
        desc: "Generate and stream bulk inventory stock snapshot CSV export payload.",
        params: `{ "format": "csv", "include_zero_stock": false }`,
        snippet: `async def export_inventory_csv():\n    return await report_generator.stream_csv()`
    },
    {
        name: "get_system_health",
        category: "Infrastructure",
        desc: "Check gRPC service connectivity, Redis stream latency, and PostgreSQL connection pool health.",
        params: `{ "detailed": true }`,
        snippet: `async def get_system_health():\n    return await health_checker.ping_all_services()`
    }
];

function initWMSInspector() {
    const tabBtns = document.querySelectorAll('.wms-tab-btn');
    const panels = document.querySelectorAll('.wms-panel');
    const toolsListContainer = document.getElementById('mcp-tools-list');
    const toolDetailContainer = document.getElementById('mcp-tool-detail');

    let selectedToolIndex = 0;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.dataset.tab;
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    function renderMCPTools() {
        if (!toolsListContainer || !toolDetailContainer) return;

        toolsListContainer.innerHTML = MCP_TOOLS_DATA.map((tool, idx) => `
            <button class="mcp-tool-pill ${idx === selectedToolIndex ? 'active' : ''}" data-index="${idx}">
                🛠️ ${tool.name}
            </button>
        `).join('');

        const currentTool = MCP_TOOLS_DATA[selectedToolIndex];
        toolDetailContainer.innerHTML = `
            <div class="mcp-detail-header">
                <span class="mcp-detail-name">mcp://${currentTool.name}</span>
                <span class="badge badge-purple">${currentTool.category}</span>
            </div>
            <p class="mcp-detail-desc">${currentTool.desc}</p>
            
            <div style="margin-bottom: 1rem;">
                <div class="code-title-bar">
                    <span>SAMPLE_INPUT_PARAMETERS.JSON</span>
                    <span class="code-lang">JSON</span>
                </div>
                <pre class="code-block"><code>${currentTool.params}</code></pre>
            </div>

            <div>
                <div class="code-title-bar">
                    <span>WMS_MCP_SERVER_EXECUTOR.PY</span>
                    <span class="code-lang">Python</span>
                </div>
                <pre class="code-block"><code>${currentTool.snippet}</code></pre>
            </div>
        `;

        const pills = toolsListContainer.querySelectorAll('.mcp-tool-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                selectedToolIndex = parseInt(pill.dataset.index, 10);
                renderMCPTools();
            });
        });
    }

    renderMCPTools();
}

/* ==========================================================================
   5. Collapsible Deep Dive Cards Handler
   ========================================================================== */
function initCollapsibleCards() {
    const expandBtns = document.querySelectorAll('.btn-action-expand');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetWrapper = document.getElementById(targetId);

            if (targetWrapper) {
                const isOpen = targetWrapper.classList.contains('open');
                if (isOpen) {
                    targetWrapper.classList.remove('open');
                    btn.classList.remove('active');
                } else {
                    targetWrapper.classList.add('open');
                    btn.classList.add('active');
                }
            }
        });
    });
}