/**
 * AgriTrace 360 - Main Application Controller
 * Handles UI interactions, QR scanner, multi-stage chain rendering, telemetry graphs, and blockchain audit.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentBatchId: "AGRI-2026-MNG-9842",
    soundEnabled: true,
    activeView: "view-trace",
    scanner: null,
    qrCodeGenerators: {}
  };

  // Initialize QR Scanner
  state.scanner = new AgriQRScanner({
    videoElement: document.getElementById("scanner-video"),
    onScanSuccess: (decodedText) => {
      handleScannedData(decodedText);
      closeScannerModal();
    }
  });

  // DOM Elements
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const viewSections = document.querySelectorAll(".view-section");
  const sampleBatchesContainer = document.getElementById("sample-batches-container");
  const directoryBatchesGrid = document.getElementById("directory-batches-grid");
  const advanceBatchList = document.getElementById("advance-batch-list");
  const chainStagesContainer = document.getElementById("chain-stages-container");
  const telemetryChartContainer = document.getElementById("telemetry-chart-container");
  const routeMapContainer = document.getElementById("route-map-container");

  // Search & Scan Inputs
  const searchInput = document.getElementById("input-batch-search");
  const btnSubmitSearch = document.getElementById("btn-submit-search");
  const btnOpenCameraScanner = document.getElementById("btn-open-camera-scanner");
  const btnUploadQrImage = document.getElementById("btn-upload-qr-image");
  const qrFileInput = document.getElementById("qr-file-input");
  const btnSoundToggle = document.getElementById("btn-sound-toggle");

  // Modals
  const modalCameraScanner = document.getElementById("modal-camera-scanner");
  const btnCloseScannerModal = document.getElementById("btn-close-scanner-modal");
  const btnModalStopCamera = document.getElementById("btn-modal-stop-camera");

  const modalPrintableLabel = document.getElementById("modal-printable-label");
  const btnCloseLabelModal = document.getElementById("btn-close-label-modal");
  const btnPrintLabelModal = document.getElementById("btn-print-label-modal");
  const btnTriggerPrint = document.getElementById("btn-trigger-print");
  const btnDownloadQrPng = document.getElementById("btn-download-qr-png");

  const modalFarmerTip = document.getElementById("modal-farmer-tip");
  const btnCloseTipModal = document.getElementById("btn-close-tip-modal");
  const btnOpenTipModal = document.getElementById("btn-open-tip-modal");
  const btnCardTip = document.getElementById("btn-card-tip");
  const btnSubmitFarmerTip = document.getElementById("btn-submit-farmer-tip");

  const btnVerifyBlockchain = document.getElementById("btn-verify-blockchain");
  const btnLedgerReverify = document.getElementById("btn-ledger-reverify");
  const btnCopyBatchId = document.getElementById("btn-copy-batch-id");

  // Create Batch Form
  const createBatchForm = document.getElementById("create-batch-form");
  const directorySearchInput = document.getElementById("directory-search-input");

  /* ==========================================================================
     Tab Navigation Management
     ========================================================================== */
  function switchView(viewId) {
    state.activeView = viewId;
    tabButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewId);
    });
    viewSections.forEach(section => {
      section.classList.toggle("active", section.id === viewId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewId === "view-directory") {
      renderDirectoryBatches();
    } else if (viewId === "view-register") {
      renderAdvanceBatchList();
    } else if (viewId === "view-ledger") {
      renderLedgerExplorer();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      switchView(btn.dataset.view);
    });
  });

  /* ==========================================================================
     Audio Toggle
     ========================================================================== */
  btnSoundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    btnSoundToggle.style.color = state.soundEnabled ? "var(--emerald-400)" : "var(--text-muted)";
    showToast(state.soundEnabled ? "Audio chime feedback enabled" : "Audio muted");
  });

  function playChime() {
    if (state.soundEnabled && state.scanner) {
      state.scanner.playScanBeep();
    }
  }

  function playBlockSound() {
    if (state.soundEnabled && state.scanner) {
      state.scanner.playBlockConfirmationSound();
    }
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--emerald-400);">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ==========================================================================
     QR Scanning & Decoding Logic
     ========================================================================== */
  function handleScannedData(rawCode) {
    let cleanId = rawCode.trim();
    if (cleanId.includes("batch=")) {
      const match = cleanId.match(/batch=([A-Z0-9-]+)/i);
      if (match) cleanId = match[1];
    } else if (cleanId.startsWith("{") && cleanId.endsWith("}")) {
      try {
        const obj = JSON.parse(cleanId);
        if (obj.batchId || obj.id) cleanId = obj.batchId || obj.id;
      } catch (e) {}
    }

    const found = getBatchById(cleanId);
    if (found) {
      selectBatch(found.id);
      showToast(`Batch verified: ${found.name} (${found.id})`);
      switchView("view-trace");
    } else {
      showToast(`Batch "${cleanId}" not found in ledger. Showing nearest record.`);
      const all = loadBatches();
      if (all.length > 0) selectBatch(all[0].id);
    }
  }

  // Camera Scanner Modal Controls
  btnOpenCameraScanner.addEventListener("click", async () => {
    modalCameraScanner.classList.add("open");
    try {
      const video = document.getElementById("scanner-video");
      await state.scanner.startCamera(video);
    } catch (err) {
      showToast(err.message || "Could not access webcam camera.");
    }
  });

  function closeScannerModal() {
    state.scanner.stopCamera();
    modalCameraScanner.classList.remove("open");
  }

  btnCloseScannerModal.addEventListener("click", closeScannerModal);
  btnModalStopCamera.addEventListener("click", closeScannerModal);

  // Upload QR Image File
  btnUploadQrImage.addEventListener("click", () => {
    qrFileInput.click();
  });

  qrFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast("Decoding uploaded QR code image...");
      const decoded = await state.scanner.decodeImageFile(file);
      handleScannedData(decoded);
    } catch (err) {
      showToast(err.message);
    }
    qrFileInput.value = "";
  });

  // Search input submission
  btnSubmitSearch.addEventListener("click", () => {
    const val = searchInput.value.trim();
    if (!val) {
      showToast("Please enter a Batch ID (e.g. AGRI-2026-MNG-9842) or scan with camera");
      return;
    }
    handleScannedData(val);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnSubmitSearch.click();
    }
  });

  /* ==========================================================================
     Sample Batches Bar (Instant 1-Click Scan)
     ========================================================================== */
  function renderSampleBatches() {
    if (!sampleBatchesContainer) return;
    const batches = loadBatches();
    sampleBatchesContainer.innerHTML = "";

    batches.slice(0, 4).forEach(batch => {
      const card = document.createElement("div");
      card.className = `sample-batch-card ${batch.id === state.currentBatchId ? "active-selected" : ""}`;
      card.innerHTML = `
        <img class="sample-batch-thumb" src="${batch.image}" alt="${batch.name}">
        <div class="sample-batch-info">
          <h4>${batch.name}</h4>
          <p>${batch.farmer.farm}</p>
        </div>
        <div class="sample-batch-scan-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Scan
        </div>
      `;
      card.addEventListener("click", () => {
        state.scanner.simulateScan(batch.id, () => {
          selectBatch(batch.id);
          showToast(`QR Code scanned: ${batch.name}`);
        });
      });
      sampleBatchesContainer.appendChild(card);
    });
  }

  /* ==========================================================================
     Batch Selection & Whole Supply Chain Rendering
     ========================================================================== */
  function selectBatch(batchId, scroll = true) {
    const batch = getBatchById(batchId);
    if (!batch) return;
    state.currentBatchId = batch.id;

    // Reveal the whole chain results container
    const resultsContainer = document.getElementById("trace-results-container");
    if (resultsContainer) {
      resultsContainer.style.display = "block";
      if (scroll) {
        setTimeout(() => {
          resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }

    renderProduceHero(batch);
    renderStepper(batch);
    renderChainTimeline(batch);
    renderFarmerStory(batch);
    renderPrintableLabel(batch);
  }

  /* ==========================================================================
     Produce Hero Banner
     ========================================================================== */
  function renderProduceHero(batch) {
    document.getElementById("produce-hero-img").src = batch.image;
    document.getElementById("produce-hero-img").alt = batch.name;
    document.getElementById("produce-badge-text").textContent = batch.badge || "Verified Produce";
    document.getElementById("produce-batch-id").textContent = batch.id;
    document.getElementById("produce-name").textContent = batch.name;
    document.getElementById("produce-variety").textContent = `${batch.variety} • ${batch.category}`;

    document.getElementById("produce-stat-farm").textContent = batch.farmer.farm;
    document.getElementById("produce-stat-harvest").textContent = batch.harvestDate;
    document.getElementById("produce-stat-grade").textContent = batch.grade || "Grade A+";
    document.getElementById("produce-stat-trust").querySelector("span").textContent = `${batch.trustScore}%`;

    const statusPill = document.getElementById("produce-status-pill");
    statusPill.textContent = batch.statusLabel || "In Supply Chain";
    statusPill.className = `stage-badge ${batch.status === 'retail' ? 'badge-completed' : 'badge-active'}`;

    // Render Small Scannable QR thumbnail
    const thumbContainer = document.getElementById("produce-qr-thumb-canvas");
    thumbContainer.innerHTML = "";
    if (window.QRCode) {
      new QRCode(thumbContainer, {
        text: `https://agritrace.io/verify?batch=${batch.id}`,
        width: 58,
        height: 58,
        colorDark: "#047857",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  // Copy Batch ID
  btnCopyBatchId.addEventListener("click", () => {
    navigator.clipboard.writeText(state.currentBatchId);
    showToast("Batch ID copied to clipboard!");
  });

  // Open printable label modal on QR thumbnail click
  document.getElementById("produce-qr-thumbnail-btn").addEventListener("click", () => {
    openPrintableLabelModal();
  });

  /* ==========================================================================
     Visual Stepper Progress Bar
     ========================================================================== */
  function renderStepper(batch) {
    const stages = batch.stages;
    const completedCount = stages.filter(s => s.status === "completed").length;
    const activeCount = stages.filter(s => s.status === "active").length;

    const progressFill = document.getElementById("stepper-progress-fill");
    const summaryBadge = document.getElementById("stepper-summary-badge");

    let percent = 0;
    if (completedCount === stages.length || (completedCount === stages.length - 1 && activeCount === 1)) {
      percent = 100;
    } else {
      percent = Math.max(10, ((completedCount) / (stages.length - 1)) * 100);
    }
    progressFill.style.width = `${percent}%`;

    summaryBadge.textContent = `${completedCount} of ${stages.length} Stages Verified`;

    // Update node states
    const nodes = document.querySelectorAll(".stepper-node");
    nodes.forEach((node, index) => {
      const stage = stages[index];
      node.classList.remove("completed", "active", "pending");
      if (stage) {
        node.classList.add(stage.status);
      }
      node.onclick = () => {
        const targetCard = document.getElementById(`stage-card-${stage.id}`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          targetCard.style.outline = "2px solid var(--emerald-400)";
          setTimeout(() => targetCard.style.outline = "none", 1500);
        }
      };
    });
  }

  /* ==========================================================================
     The Whole Chain Timeline Cards
     ========================================================================== */
  function renderChainTimeline(batch) {
    chainStagesContainer.innerHTML = "";

    batch.stages.forEach((stage) => {
      const card = document.createElement("article");
      card.id = `stage-card-${stage.id}`;
      card.className = `stage-card glass-panel ${stage.status}`;

      let badgeClass = "badge-completed";
      let badgeLabel = "Verified";
      if (stage.status === "active") {
        badgeClass = "badge-active";
        badgeLabel = "Active Stage";
      } else if (stage.status === "pending") {
        badgeClass = "badge-pending";
        badgeLabel = "Pending";
      }

      let metricsHtml = "";
      if (stage.metrics && stage.metrics.length > 0) {
        metricsHtml = `
          <div class="stage-metrics-grid">
            ${stage.metrics.map(m => `
              <div class="stage-metric-card">
                <div class="metric-label">${m.label}</div>
                <div class="metric-val">${m.value}</div>
                <div class="metric-sub">${m.sub}</div>
              </div>
            `).join("")}
          </div>
        `;
      }

      let certsHtml = "";
      if (stage.certificates && stage.certificates.length > 0) {
        certsHtml = stage.certificates.map(c => `<span class="cert-tag">${c}</span>`).join(" ");
      }

      card.innerHTML = `
        <div class="stage-card-header">
          <div class="stage-meta-left">
            <div class="stage-icon-circle">
              <span style="font-weight: 800; font-size: 1.1rem;">#${stage.stageIndex}</span>
            </div>
            <div class="stage-titles">
              <h4>
                ${stage.title}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--emerald-400);">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </h4>
              <p>${stage.facility}</p>
            </div>
          </div>

          <div class="stage-meta-right">
            <span class="stage-badge ${badgeClass}">${stage.badge || badgeLabel}</span>
            <div class="stage-timestamp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${stage.date} • ${stage.time}</span>
            </div>
          </div>
        </div>

        <div class="stage-actor-bar">
          <div class="actor-name">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Operator: ${stage.operator}
          </div>
          <div class="location-pin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${stage.location}
          </div>
        </div>

        ${metricsHtml}

        <p style="font-size: 0.88rem; color: #cbd5e1; margin-bottom: 12px; line-height: 1.5;">
          ${stage.notes || "Process recorded and confirmed under food safety protocols."}
        </p>

        <div class="stage-block-footer">
          <div class="block-links">
            <span style="color: var(--text-muted); font-size: 0.76rem; font-weight: 700;">BLOCK HASH:</span>
            <span class="mono-hash" title="Cryptographic SHA-256 Proof">${stage.blockHash ? stage.blockHash.slice(0, 18) + '...' + stage.blockHash.slice(-8) : 'Pending Block'}</span>
            <button class="copy-icon-btn" onclick="navigator.clipboard.writeText('${stage.blockHash}'); showToast('Block hash copied!');" title="Copy Full Hash">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>

          <div class="block-links">
            ${certsHtml}
          </div>
        </div>
      `;

      chainStagesContainer.appendChild(card);
    });
  }

  /* ==========================================================================
     Interactive Cold Chain Telemetry Chart (SVG Sparkline)
     ========================================================================== */
  function renderTelemetryChart(batch) {
    const data = batch.telemetryHistory || [];
    if (data.length === 0) {
      telemetryChartContainer.innerHTML = `<div style="padding: 20px; color: var(--text-muted);">No telemetry points recorded.</div>`;
      return;
    }

    const width = 560;
    const height = 180;
    const padding = 32;

    const temps = data.map(d => d.temp);
    const minTemp = Math.min(...temps, batch.temperatureThreshold?.min || 2) - 1.5;
    const maxTemp = Math.max(...temps, batch.temperatureThreshold?.max || 14) + 1.5;

    const getX = (idx) => padding + (idx / (data.length - 1)) * (width - padding * 2);
    const getY = (val) => height - padding - ((val - minTemp) / (maxTemp - minTemp)) * (height - padding * 2);

    const thresholdMinY = getY(batch.temperatureThreshold?.min || 10);
    const thresholdMaxY = getY(batch.temperatureThreshold?.max || 13.5);
    const thresholdHeight = Math.abs(thresholdMinY - thresholdMaxY);
    const thresholdTop = Math.min(thresholdMinY, thresholdMaxY);

    const points = data.map((d, i) => `${getX(i)},${getY(d.temp)}`).join(" ");
    const areaPoints = `${getX(0)},${height - padding} ` + points + ` ${getX(data.length - 1)},${height - padding}`;

    let svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;" preserveAspectRatio="none">
        <defs>
          <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Safe Threshold Envelope Band -->
        <rect x="${padding}" y="${thresholdTop}" width="${width - padding * 2}" height="${thresholdHeight}" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.25)" stroke-dasharray="4 4" rx="4"/>
        <text x="${width - padding - 8}" y="${thresholdTop + 14}" fill="#34d399" font-size="10" text-anchor="end" font-weight="600">Safe Envelope: ${batch.temperatureThreshold.min}°C - ${batch.temperatureThreshold.max}°C</text>

        <!-- Grid Lines -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

        <!-- Area fill under temperature line -->
        <polygon points="${areaPoints}" fill="url(#telemetryGrad)"/>

        <!-- Temperature Line -->
        <polyline points="${points}" fill="none" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Sensor Data Points -->
        ${data.map((d, i) => `
          <circle cx="${getX(i)}" cy="${getY(d.temp)}" r="4" fill="#ffffff" stroke="#0891b2" stroke-width="2">
            <title>${d.time}: ${d.temp}°C, ${d.humidity}% RH</title>
          </circle>
          <text x="${getX(i)}" y="${height - 12}" fill="#94a3b8" font-size="9" text-anchor="middle">${d.time.split(" ")[0]}</text>
        `).join("")}
      </svg>
    `;

    telemetryChartContainer.innerHTML = svgHtml;
  }

  /* ==========================================================================
     Geographic Route Diagram (SVG Breadcrumbs)
     ========================================================================== */
  function renderRouteMap(batch) {
    const stages = batch.stages;
    const width = 560;
    const height = 180;
    const nodeCount = stages.length;

    const stepX = (width - 80) / (nodeCount - 1);
    const posY = height / 2;

    let svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
        <line x1="40" y1="${posY}" x2="${width - 40}" y2="${posY}" stroke="rgba(255,255,255,0.12)" stroke-width="4" stroke-dasharray="6 6"/>
        <line x1="40" y1="${posY}" x2="${40 + (stages.filter(s => s.status === 'completed').length - 1) * stepX}" y2="${posY}" stroke="#10b981" stroke-width="4"/>

        ${stages.map((s, idx) => {
          const cx = 40 + idx * stepX;
          const isDone = s.status === "completed";
          const isActive = s.status === "active";
          const fillColor = isDone ? "#10b981" : (isActive ? "#f59e0b" : "#334155");

          return `
            <g transform="translate(${cx}, ${posY})">
              ${isActive ? `<circle cx="0" cy="0" r="16" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.6">
                <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
              </circle>` : ''}
              
              <circle cx="0" cy="0" r="10" fill="${fillColor}" stroke="#ffffff" stroke-width="2"/>
              <text x="0" y="-18" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="700">${s.title.split(" ")[0]}</text>
              <text x="0" y="24" fill="#94a3b8" font-size="9" text-anchor="middle">${s.location.split(",")[0]}</text>
            </g>
          `;
        }).join("")}
      </svg>
    `;

    routeMapContainer.innerHTML = svgHtml;
  }

  /* ==========================================================================
     Farmer Story & Sustainability
     ========================================================================== */
  function renderFarmerStory(batch) {
    const f = batch.farmer;
    document.getElementById("farmer-avatar-letter").textContent = f.name.charAt(0);
    document.getElementById("farmer-name").textContent = f.name;
    document.getElementById("farmer-role-location").textContent = `${f.role} • ${f.farm}`;
    document.getElementById("farmer-quote").textContent = `"${f.quote}"`;
    document.getElementById("farmer-tip-count").textContent = `${f.tipCount || 140} Consumers thanked this grower`;

    document.getElementById("modal-tip-farmer-name").textContent = f.name;
    document.getElementById("modal-tip-farm-name").textContent = `${f.farm} (${f.location})`;
  }

  function renderSustainability(batch) {
    document.getElementById("eco-carbon-val").textContent = batch.carbonSavings || "-20% CO₂";
    document.getElementById("eco-water-val").textContent = batch.waterSaved || "300 Liters";
    document.getElementById("eco-pack-val").textContent = batch.packaging || "100% Recyclable";
  }

  /* ==========================================================================
     Printable Label Modal
     ========================================================================== */
  function renderPrintableLabel(batch) {
    document.getElementById("label-produce-name").textContent = batch.name;
    document.getElementById("label-produce-farm").textContent = batch.farmer.farm;
    document.getElementById("label-batch-id").textContent = batch.id;
    document.getElementById("label-harvest-date").textContent = batch.harvestDate;
    document.getElementById("label-expiry-date").textContent = batch.expiryDate;
    document.getElementById("label-quality-grade").textContent = batch.grade || "Grade A+";
    document.getElementById("label-temp-range").textContent = `${batch.temperatureThreshold.min}°C - ${batch.temperatureThreshold.max}°C`;
    
    const latestStage = batch.stages.filter(s => s.blockHash && s.blockHash.startsWith("0x")).slice(-1)[0];
    document.getElementById("label-mini-hash").textContent = latestStage ? latestStage.blockHash.slice(0, 16) + '...' : '0xVerified';

    const labelQrContainer = document.getElementById("printable-qr-code-canvas");
    labelQrContainer.innerHTML = "";
    if (window.QRCode) {
      new QRCode(labelQrContainer, {
        text: `https://agritrace.io/verify?batch=${batch.id}`,
        width: 100,
        height: 100,
        colorDark: "#111827",
        colorLight: "#f3f4f6",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }

  function openPrintableLabelModal() {
    renderPrintableLabel(getBatchById(state.currentBatchId));
    modalPrintableLabel.classList.add("open");
  }

  btnPrintLabelModal.addEventListener("click", openPrintableLabelModal);
  btnCloseLabelModal.addEventListener("click", () => modalPrintableLabel.classList.remove("open"));

  btnTriggerPrint.addEventListener("click", () => {
    window.print();
  });

  btnDownloadQrPng.addEventListener("click", () => {
    const canvas = document.querySelector("#printable-qr-code-canvas canvas") || document.querySelector("#printable-qr-code-canvas img");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `QR-LABEL-${state.currentBatchId}.png`;
      link.href = canvas.src || canvas.toDataURL("image/png");
      link.click();
      showToast("QR code downloaded!");
    }
  });

  /* ==========================================================================
     Farmer Gratitude / Tip
     ========================================================================== */
  function openFarmerTipModal() {
    modalFarmerTip.classList.add("open");
  }

  btnOpenTipModal.addEventListener("click", openFarmerTipModal);
  btnCardTip.addEventListener("click", openFarmerTipModal);
  btnCloseTipModal.addEventListener("click", () => modalFarmerTip.classList.remove("open"));

  btnSubmitFarmerTip.addEventListener("click", () => {
    const batch = getBatchById(state.currentBatchId);
    if (batch) {
      batch.farmer.tipCount = (batch.farmer.tipCount || 100) + 1;
      updateBatch(batch);
      renderFarmerStory(batch);
      playBlockSound();
      showToast("Thank-you gratitude note delivered directly to the farmer!");
      modalFarmerTip.classList.remove("open");
      document.getElementById("input-farmer-note").value = "";
    }
  });

  /* ==========================================================================
     Ledger Verification Actions
     ========================================================================== */
  btnVerifyBlockchain.addEventListener("click", () => {
    const batch = getBatchById(state.currentBatchId);
    const result = LedgerEngine.verifyBatchChain(batch);
    playBlockSound();
    if (result.valid) {
      showToast(`Whole chain verified: ${result.blockCount} blocks cryptographically linked and intact!`);
    } else {
      showToast(`Verification issue: ${result.reason}`);
    }
  });

  btnLedgerReverify.addEventListener("click", () => {
    playBlockSound();
    showToast("Whole blockchain ledger verified. All blocks validated with Proof-of-Origin consensus!");
    renderLedgerExplorer();
  });

  /* ==========================================================================
     Directory View - List View Rendering
     ========================================================================== */
  let currentDirectoryCategory = "ALL";

  function renderDirectoryBatches(filterText = "") {
    const listContainer = document.getElementById("directory-batches-list");
    if (!listContainer) return;
    const batches = loadBatches();
    listContainer.innerHTML = "";

    const filtered = batches.filter(b => {
      // Category filter
      if (currentDirectoryCategory !== "ALL" && b.category.toLowerCase() !== currentDirectoryCategory.toLowerCase()) {
        return false;
      }
      // Text filter
      if (!filterText) return true;
      const q = filterText.toLowerCase();
      return b.name.toLowerCase().includes(q) ||
             b.id.toLowerCase().includes(q) ||
             b.category.toLowerCase().includes(q) ||
             b.farmer.farm.toLowerCase().includes(q) ||
             b.farmer.location.toLowerCase().includes(q);
    });

    const countBadge = document.getElementById("directory-count-badge");
    if (countBadge) {
      countBadge.textContent = `Showing ${filtered.length} of ${batches.length} Batches`;
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="glass-panel" style="padding: 36px; text-align: center; color: var(--text-muted);">
          No produce batches found matching "${filterText || currentDirectoryCategory}".
        </div>
      `;
      return;
    }

    filtered.forEach(batch => {
      const row = document.createElement("div");
      row.className = "directory-row-item";
      row.innerHTML = `
        <!-- Col 1: Produce & Variety -->
        <div class="dir-col-produce">
          <img src="${batch.image}" alt="${batch.name}" class="dir-produce-thumb">
          <div class="dir-produce-text">
            <h4>${batch.name}</h4>
            <p>${batch.variety} • <span class="cert-tag" style="font-size: 0.65rem; padding: 2px 6px;">${batch.category}</span></p>
          </div>
        </div>

        <!-- Col 2: Batch ID -->
        <div>
          <span class="mono-hash" style="font-size: 0.74rem; cursor: pointer;" title="Click to copy Batch ID">${batch.id}</span>
        </div>

        <!-- Col 3: Farm Origin & Grower -->
        <div class="dir-col-farm">
          <div class="farm-name">${batch.farmer.farm}</div>
          <div class="farm-loc">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${batch.farmer.location.split("(")[0]}
          </div>
        </div>

        <!-- Col 4: Harvest Date -->
        <div class="dir-col-date">
          <div class="date-main">${batch.harvestDate}</div>
          <div class="date-expiry">Exp: ${batch.expiryDate}</div>
        </div>

        <!-- Col 5: Supply Chain Status -->
        <div class="dir-col-status">
          <span class="dir-status-pill ${batch.status === 'retail' ? 'badge-completed' : 'badge-active'}">
            <span class="pulse-dot" style="width: 6px; height: 6px; ${batch.status !== 'retail' ? 'background: var(--amber-400); box-shadow: 0 0 6px var(--amber-400);' : ''}"></span>
            ${batch.statusLabel}
          </span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">Trust Score: <strong style="color: var(--emerald-400);">${batch.trustScore}%</strong></span>
        </div>

        <!-- Col 6: Action Button -->
        <div class="dir-col-action">
          <button class="btn-primary" style="padding: 7px 14px; font-size: 0.78rem;" data-trace-id="${batch.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Scan & Trace
          </button>
        </div>
      `;

      // Copy batch ID on mono hash click
      const monoEl = row.querySelector(".mono-hash");
      monoEl.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(batch.id);
        showToast(`Copied ${batch.id} to clipboard!`);
      });

      // Click to scan & open whole chain trace
      row.addEventListener("click", () => {
        state.scanner.simulateScan(batch.id, () => {
          selectBatch(batch.id, true);
          switchView("view-trace");
          showToast(`Displaying whole chain for ${batch.name}`);
        });
      });

      listContainer.appendChild(row);
    });
  }

  // Filter chips interaction
  const chipButtons = document.querySelectorAll("#directory-category-chips .directory-chip-btn");
  chipButtons.forEach(chip => {
    chip.addEventListener("click", () => {
      chipButtons.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentDirectoryCategory = chip.dataset.category;
      const searchVal = directorySearchInput ? directorySearchInput.value : "";
      renderDirectoryBatches(searchVal);
    });
  });

  if (directorySearchInput) {
    directorySearchInput.addEventListener("input", (e) => {
      renderDirectoryBatches(e.target.value);
    });
  }

  /* ==========================================================================
     Register & Mint New Batch
     ========================================================================== */
  /* ==========================================================================
     Register & Mint Produce Batch Across All 5 Supply Chain Facilities
     ========================================================================== */
  // Set default harvest date to 3 days ago for realistic store timeline
  const harvestDateInput = document.getElementById("form-harvest-date");
  if (harvestDateInput && !harvestDateInput.value) {
    const defaultHarvest = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
    harvestDateInput.value = defaultHarvest;
  }

  // Autofill In-Store Produce Presets
  const btnAutofillFacilities = document.getElementById("btn-autofill-facilities");
  const SAMPLE_IN_STORE_PRESETS = [
    {
      name: "Heirloom Cherry Tomatoes",
      variety: "Sweet SunGold Vine-Ripened",
      category: "Vine Vegetable",
      image: "assets/images/strawberry.jpg",
      grade: "Grade A+ Certified Organic",
      brix: "11.2° Bx",
      soil: "6.5 (Loamy silt)",
      quote: "Hand-harvested at sunrise when the vine sugars peak. Zero synthetic pesticides.",
      farm: "Sunny Brook Organic Terraces",
      farmer: "Arthur Pendelton",
      farmLoc: "Devon Organic Valley, UK",
      packhouseName: "Devon Central Agro-Processing Packhouse",
      packhouseLoc: "South West Logistics Hub, Devon, UK",
      packhouseOperator: "Dr. Eleanor Vance (Chief Food Safety Inspector)",
      packhouseNotes: "Ozonated micro-bubble wash, NIR optical weight grading & biodegradable pulp punnets.",
      coldHubName: "Apex Regional Cold Logistics Terminal #4",
      coldHubLoc: "Bristol Inland Freight Hub, UK",
      coldHubTemp: "4.2°C",
      coldHubOperator: "Automated Climate Gateway CH-88",
      transitCarrier: "GreenLine Eco-Reefer Freight Van #VR-402",
      transitRoute: "M4 Highway Corridor: Bristol to Central London",
      transitTemp: "4.5°C",
      transitOperator: "Swift Logistics Fleet Operator",
      storeName: "Artisan Fresh Organic Supermarket",
      storeLoc: "142 High Street, Kensington, London W8 4SG",
      storeShelf: "Aisle 1 - Organic Fresh Produce Island #B-3",
      storeOperator: "Markus Davies (Department Manager)"
    },
    {
      name: "Crisp Washington Fuji Apples",
      variety: "Highland Late Harvest Honey-Crisp",
      category: "Orchard Fruit",
      image: "assets/images/mango.jpg",
      grade: "Grade Extra Fancy Organic",
      brix: "14.8° Bx",
      soil: "6.8 (Volcanic Ash Loam)",
      quote: "Tree-ripened under cool alpine mountain nights and hand-picked with care.",
      farm: "Cascade Crest Highland Orchards",
      farmer: "David Miller",
      farmLoc: "Yakima Valley, Washington, USA",
      packhouseName: "Yakima Valley Cold-Wash & Optical Sort Terminal",
      packhouseLoc: "Yakima Agro-Logistics Center, WA",
      packhouseOperator: "Sarah Jenkins (Postharvest QA Lead)",
      packhouseNotes: "Chilled purified water bath, density sorting, and honeycomb fiber cradles.",
      coldHubName: "Pacific Northwest CA Cold Terminal #12",
      coldHubLoc: "Port of Seattle Cold Logistics Hub, WA",
      coldHubTemp: "1.8°C",
      coldHubOperator: "IoT Sensor Node PNW-09",
      transitCarrier: "Trans-West Temperature Express Reefer #994",
      transitRoute: "I-5 South Pacific Corridor to San Francisco",
      transitTemp: "2.2°C",
      transitOperator: "Trans-West Cold Carrier Fleet",
      storeName: "Whole Harvest Artisan Market #104",
      storeLoc: "450 Market Street, San Francisco, CA 94105",
      storeShelf: "Organic Orchard Island - Display Bin A-2",
      storeOperator: "Chloe Hernandez (Produce Lead)"
    },
    {
      name: "Hydroponic Butterhead Lettuce",
      variety: "Zero-Pesticide Clean Crisphead",
      category: "Leafy Greens",
      image: "assets/images/lettuce.jpg",
      grade: "Grade A+ CEA Certified",
      brix: "4.8° Bx",
      soil: "Pure Water Nutrient Film (pH 5.9)",
      quote: "Grown in pure filtered rainwater inside our closed-loop vertical solar greenhouse.",
      farm: "SkyHarvest Vertical Hydroponic Greenhouse",
      farmer: "Elena Wood",
      farmLoc: "Kent Sustainable Bio-Park, UK",
      packhouseName: "Kent Automated Cleanroom Packhouse",
      packhouseLoc: "Kent Bio-Park Logistics Gate 3, UK",
      packhouseOperator: "Dr. Liam Gallagher (Food Safety Lead)",
      packhouseNotes: "Root-intact packaging in breathable plant-based cellulose film.",
      coldHubName: "South East Fresh Logistics Terminal #2",
      coldHubLoc: "Maidstone Inland Logistics Terminal, UK",
      coldHubTemp: "3.5°C",
      coldHubOperator: "CleanChill Automated Gateway Node 14",
      transitCarrier: "CleanRoute Electric Reefer Transit Van #EV-18",
      transitRoute: "A20 / M20 Route directly into Central London",
      transitTemp: "3.8°C",
      transitOperator: "Zero-Emission Urban Delivery Lead",
      storeName: "GreenGrocer Premier Food Hall",
      storeLoc: "Covent Garden Market Hall, London WC2E 8RD",
      storeShelf: "Chilled Greens Wall - Shelf 3",
      storeOperator: "Oliver Bennett (Store Merchandiser)"
    }
  ];

  let currentPresetIndex = 0;
  if (btnAutofillFacilities) {
    btnAutofillFacilities.addEventListener("click", () => {
      const preset = SAMPLE_IN_STORE_PRESETS[currentPresetIndex % SAMPLE_IN_STORE_PRESETS.length];
      currentPresetIndex++;

      // Crop Info
      document.getElementById("form-name").value = preset.name;
      document.getElementById("form-variety").value = preset.variety;
      document.getElementById("form-category").value = preset.category;
      document.getElementById("form-image-preset").value = preset.image;
      document.getElementById("form-grade").value = preset.grade;
      document.getElementById("form-brix").value = preset.brix;
      document.getElementById("form-soil").value = preset.soil;
      document.getElementById("form-farmer-quote").value = preset.quote;

      // Facility 1: Farm
      document.getElementById("form-farm").value = preset.farm;
      document.getElementById("form-farmer").value = preset.farmer;
      document.getElementById("form-location").value = preset.farmLoc;
      const hDate = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
      document.getElementById("form-harvest-date").value = hDate;

      // Facility 2: Packhouse
      document.getElementById("form-packhouse-name").value = preset.packhouseName;
      document.getElementById("form-packhouse-loc").value = preset.packhouseLoc;
      document.getElementById("form-packhouse-operator").value = preset.packhouseOperator;
      document.getElementById("form-packhouse-notes").value = preset.packhouseNotes;

      // Facility 3: Cold Hub
      document.getElementById("form-cold-hub-name").value = preset.coldHubName;
      document.getElementById("form-cold-hub-loc").value = preset.coldHubLoc;
      document.getElementById("form-cold-hub-temp").value = preset.coldHubTemp;
      document.getElementById("form-cold-hub-operator").value = preset.coldHubOperator;

      // Facility 4: Transit
      document.getElementById("form-transit-carrier").value = preset.transitCarrier;
      document.getElementById("form-transit-route").value = preset.transitRoute;
      document.getElementById("form-transit-temp").value = preset.transitTemp;
      document.getElementById("form-transit-operator").value = preset.transitOperator;

      // Facility 5: Store
      document.getElementById("form-store-name").value = preset.storeName;
      document.getElementById("form-store-loc").value = preset.storeLoc;
      document.getElementById("form-store-shelf").value = preset.storeShelf;
      document.getElementById("form-store-operator").value = preset.storeOperator;

      playBlockSound();
      showToast(`Autofilled "${preset.name}" with complete 5-facility in-store journey!`);
    });
  }

  if (createBatchForm) {
    createBatchForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Read Crop Details
      const name = document.getElementById("form-name").value.trim();
      const variety = document.getElementById("form-variety").value.trim();
      const category = document.getElementById("form-category").value;
      const image = document.getElementById("form-image-preset").value;
      const grade = document.getElementById("form-grade").value.trim() || "Grade A+ Certified Organic";
      const brix = document.getElementById("form-brix").value.trim() || "11.2° Bx";
      const soil = document.getElementById("form-soil").value.trim() || "6.5";
      const quote = document.getElementById("form-farmer-quote").value.trim() || "Hand-harvested with sustainable precision.";

      // Read Facility 1: Farm
      const farm = document.getElementById("form-farm").value.trim();
      const farmer = document.getElementById("form-farmer").value.trim();
      const farmLoc = document.getElementById("form-location").value.trim();
      const harvestDateVal = document.getElementById("form-harvest-date").value || new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

      // Read Facility 2: Packhouse
      const packhouseName = document.getElementById("form-packhouse-name")?.value.trim() || `${farm} Central Packhouse`;
      const packhouseLoc = document.getElementById("form-packhouse-loc")?.value.trim() || farmLoc;
      const packhouseOperator = document.getElementById("form-packhouse-operator")?.value.trim() || "QA Inspection Team";
      const packhouseNotes = document.getElementById("form-packhouse-notes")?.value.trim() || "Ozonated micro-bubble wash & optical defect sorting.";

      // Read Facility 3: Cold Storage Hub
      const coldHubName = document.getElementById("form-cold-hub-name")?.value.trim() || "Regional Cold Logistics Terminal #4";
      const coldHubLoc = document.getElementById("form-cold-hub-loc")?.value.trim() || "Inland Distribution Port";
      const coldHubTemp = document.getElementById("form-cold-hub-temp")?.value.trim() || "4.2°C";
      const coldHubOperator = document.getElementById("form-cold-hub-operator")?.value.trim() || "Automated Climate Gateway CH-88";

      // Read Facility 4: Refrigerated Transit
      const transitCarrier = document.getElementById("form-transit-carrier")?.value.trim() || "GreenLine Eco-Reefer Freight Van #VR-402";
      const transitRoute = document.getElementById("form-transit-route")?.value.trim() || "Interstate Freight Corridor to Retailer";
      const transitTemp = document.getElementById("form-transit-temp")?.value.trim() || "4.5°C";
      const transitOperator = document.getElementById("form-transit-operator")?.value.trim() || "Swift Logistics Carrier Lead";

      // Read Facility 5: Destination Supermarket
      const storeName = document.getElementById("form-store-name")?.value.trim() || "Artisan Fresh Organic Supermarket";
      const storeLoc = document.getElementById("form-store-loc")?.value.trim() || "142 High Street, Kensington, London";
      const storeShelf = document.getElementById("form-store-shelf")?.value.trim() || "Aisle 1 - Organic Fresh Produce Island";
      const storeOperator = document.getElementById("form-store-operator")?.value.trim() || "Markus Davies (Department Manager)";

      // Generate Unique Batch ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const codePrefix = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || "CRV";
      const batchId = `AGRI-2026-${codePrefix}-${randomSuffix}`;
      const today = new Date().toISOString().split("T")[0];

      // Sequential chronological dates across the journey
      const harvestD = new Date(harvestDateVal);
      const packhouseD = new Date(harvestD.getTime() + 1 * 86400000).toISOString().split("T")[0];
      const coldHubD = new Date(harvestD.getTime() + 2 * 86400000).toISOString().split("T")[0];
      const transitD = new Date(harvestD.getTime() + 2.5 * 86400000).toISOString().split("T")[0];
      const storeD = today;

      // 1. Genesis Block: Farm Harvest
      const block1 = await LedgerEngine.createBlock(
        batchId,
        1,
        "Farm Cultivation & Harvest",
        farm,
        farmer,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { brix, soil, farmLoc, harvestDate: harvestDateVal }
      );

      // 2. Block 2: Packhouse QA & Washing
      const block2 = await LedgerEngine.createBlock(
        batchId,
        2,
        "Packhouse QA & Ozonated Washing",
        packhouseName,
        packhouseOperator,
        block1.blockHash,
        { packhouseLoc, packhouseNotes, date: packhouseD }
      );

      // 3. Block 3: Cold Storage Hub
      const block3 = await LedgerEngine.createBlock(
        batchId,
        3,
        "Smart Cold Storage & IoT Hub",
        coldHubName,
        coldHubOperator,
        block2.blockHash,
        { coldHubLoc, temp: coldHubTemp, date: coldHubD }
      );

      // 4. Block 4: Refrigerated Freight Transit
      const block4 = await LedgerEngine.createBlock(
        batchId,
        4,
        "Refrigerated Freight & Transit",
        transitCarrier,
        transitOperator,
        block3.blockHash,
        { transitRoute, temp: transitTemp, date: transitD }
      );

      // 5. Block 5: Retail Supermarket Shelf (Where Scanned)
      const block5 = await LedgerEngine.createBlock(
        batchId,
        5,
        "Retail Freshness Shelf (Store)",
        storeName,
        storeOperator,
        block4.blockHash,
        { storeLoc, storeShelf, date: storeD }
      );

      const newBatch = {
        id: batchId,
        name,
        variety,
        category,
        grade,
        badge: "In-Store Verified Produce",
        image,
        status: "retail",
        statusLabel: "Available on Store Shelf",
        trustScore: 99.9,
        harvestDate: harvestDateVal,
        expiryDate: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
        packaging: "Compostable Certified Punnet",
        carbonSavings: "-22% CO₂ vs Global Supply Average",
        waterSaved: "340 Liters",
        farmer: {
          name: farmer,
          role: "Lead Grower & Agronomist",
          farm,
          location: farmLoc,
          coordinates: "51.5074° N, 0.1278° W",
          experience: "Certified Organic Agriculturist",
          quote,
          tipCount: 1
        },
        specs: {
          brixSweetness: brix,
          weightPerUnit: "Standard Retail Punnet",
          pesticideDetection: "0.00 ppm Organic Pass",
          ripenessWindow: "Peak Freshness (Ready to Eat)"
        },
        qrPayload: batchId,
        temperatureThreshold: { min: 3.5, max: 8.0, unit: "°C" },
        stages: [
          {
            id: "stage-1",
            stageIndex: 1,
            title: "Farm Cultivation & Harvest",
            facility: farm,
            location: farmLoc,
            coords: [51.5074, 0.1278],
            date: harvestDateVal,
            time: "06:30 Sunrise",
            operator: farmer,
            status: "completed",
            badge: "Harvest Verified",
            icon: "sprout",
            metrics: [
              { label: "Cultivation Soil", value: soil, sub: "Tested Loam" },
              { label: "Brix Sweetness", value: brix, sub: "Natural Sweetness" },
              { label: "Quality Grade", value: grade, sub: "Origin Confirmed" },
              { label: "Harvest Method", value: "Hand Picked", sub: "Gentle handling" }
            ],
            notes: `Harvested at ${farm}. ${quote}`,
            certificates: ["Certified Organic Farm Origin", "GlobalGAP Compliance"],
            blockHash: block1.blockHash,
            prevHash: block1.prevHash
          },
          {
            id: "stage-2",
            stageIndex: 2,
            title: "Packhouse QA & Ozonated Washing",
            facility: packhouseName,
            location: packhouseLoc,
            coords: [51.5120, 0.1340],
            date: packhouseD,
            time: "11:15 Morning",
            operator: packhouseOperator,
            status: "completed",
            badge: "QA Pass 100%",
            icon: "check-circle",
            metrics: [
              { label: "Sanitization", value: "Ozonated Wash", sub: "Residue Free" },
              { label: "Sorting Calibration", value: "Optical NIR Scan", sub: "Uniform size & color" },
              { label: "Inspection Status", value: "Pesticide 0.00ppm", sub: "Safety clearance" },
              { label: "Packaging Type", value: "Eco Pulp Punnet", sub: "100% Recyclable" }
            ],
            notes: `${packhouseNotes} Packaging sealed with cryptographic batch label.`,
            certificates: ["ISO 22000 Food Safety", "HACCP Certified Facility"],
            blockHash: block2.blockHash,
            prevHash: block2.prevHash
          },
          {
            id: "stage-3",
            stageIndex: 3,
            title: "Smart Cold Storage & IoT Hub",
            facility: coldHubName,
            location: coldHubLoc,
            coords: [51.5200, 0.1400],
            date: coldHubD,
            time: "18:45 Evening",
            operator: coldHubOperator,
            status: "completed",
            badge: "Temp Maintained",
            icon: "thermometer",
            metrics: [
              { label: "Chamber Temp", value: coldHubTemp, sub: "Controlled climate" },
              { label: "Relative Humidity", value: "90% RH", sub: "Moisture lock" },
              { label: "Ethylene Level", value: "< 0.05 ppm", sub: "Catalytic scrub" },
              { label: "Telemetry Node", value: "Active IoT", sub: "100% packet uptime" }
            ],
            notes: `Stored in automated climate-controlled chamber at ${coldHubName}. Zero temperature breaches detected.`,
            certificates: ["GDP Cold Chain Compliance", "IoT Gateway Audited"],
            blockHash: block3.blockHash,
            prevHash: block3.prevHash
          },
          {
            id: "stage-4",
            stageIndex: 4,
            title: "Refrigerated Freight & Transit",
            facility: transitCarrier,
            location: transitRoute,
            coords: [51.5300, 0.1500],
            date: transitD,
            time: "07:20 Morning",
            operator: transitOperator,
            status: "completed",
            badge: "Reefer Verified",
            icon: "truck",
            metrics: [
              { label: "Transit Temp", value: transitTemp, sub: "Reefer active" },
              { label: "Corridor Route", value: transitRoute, sub: "GPS monitored" },
              { label: "Tamper Seal", value: "SEAL-INTACT", sub: "Cryptographic lock" },
              { label: "Transit Health", value: "Optimal Freshness", sub: "Shock-padded" }
            ],
            notes: `Refrigerated transit via ${transitCarrier} along ${transitRoute}. Cargo seal verified upon store delivery.`,
            certificates: ["Refrigerated Logistics Standard", "Cold Freight Certified"],
            blockHash: block4.blockHash,
            prevHash: block4.prevHash
          },
          {
            id: "stage-5",
            stageIndex: 5,
            title: "Retail Freshness Shelf (Where Scanned)",
            facility: storeName,
            location: storeLoc,
            coords: [51.5014, -0.1919],
            date: storeD,
            time: "09:30 Morning",
            operator: storeOperator,
            status: "completed",
            badge: "Active on Shelf",
            icon: "store",
            metrics: [
              { label: "Display Location", value: storeShelf, sub: "Store shelf slot" },
              { label: "Store Facility", value: storeName, sub: "Verified Retailer" },
              { label: "Consumer QR", value: "Active on Display", sub: "Scannable in store" },
              { label: "Freshness Window", value: "Peak Quality", sub: "Ready for consumer" }
            ],
            notes: `Merchandised on store shelf at ${storeName} (${storeShelf}). Available for consumer purchase and instant QR traceability.`,
            certificates: ["Certified Retail Partner", "Store Freshness Guarantee"],
            blockHash: block5.blockHash,
            prevHash: block5.prevHash
          }
        ],
        telemetryHistory: [
          { time: "Farm Harvest", temp: 8.0, humidity: 88 },
          { time: "Packhouse Wash", temp: 6.2, humidity: 89 },
          { time: "Cold Hub Storage", temp: 4.2, humidity: 90 },
          { time: "Reefer Transit", temp: 4.5, humidity: 89 },
          { time: "Store Delivery", temp: 5.0, humidity: 88 }
        ]
      };

      addBatch(newBatch);
      playBlockSound();
      showToast(`Batch ${newBatch.id} minted across 5 verified facilities! Ready to scan in store.`);

      // Render & display newly minted batch in trace view
      renderSampleBatches();
      selectBatch(newBatch.id, true);
      switchView("view-trace");

      // Open printable label modal so user can view/scan the generated packaging QR sticker
      setTimeout(() => {
        openPrintableLabelModal(newBatch.id);
      }, 400);
    });
  }

  /* ==========================================================================
     Advance Stage Portal (Simulate Supply Chain Logistics Movement)
     ========================================================================== */
  function renderAdvanceBatchList() {
    if (!advanceBatchList) return;
    const batches = loadBatches();
    advanceBatchList.innerHTML = "";

    batches.forEach(batch => {
      const pendingStageIndex = batch.stages.findIndex(s => s.status === "pending");
      const hasPending = pendingStageIndex !== -1;
      const nextStage = hasPending ? batch.stages[pendingStageIndex] : null;

      const card = document.createElement("div");
      card.className = "glass-panel";
      card.style.padding = "16px";
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";
      card.style.flexWrap = "wrap";
      card.style.gap = "14px";

      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${batch.image}" style="width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover;">
          <div>
            <div style="font-size: 0.76rem; font-family: var(--font-mono); color: var(--amber-400);">${batch.id}</div>
            <div style="font-weight: 700; font-size: 1.05rem;">${batch.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${batch.farmer.farm} • Current: <strong>${batch.statusLabel}</strong></div>
          </div>
        </div>

        <div>
          ${hasPending ? `
            <button class="btn-primary" style="padding: 9px 18px; font-size: 0.84rem;" data-advance-id="${batch.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              Advance to: ${nextStage.title}
            </button>
          ` : `
            <span class="stage-badge badge-completed">
              All 5 Stages Completed
            </span>
          `}
        </div>
      `;

      if (hasPending) {
        const btn = card.querySelector(`[data-advance-id="${batch.id}"]`);
        btn.addEventListener("click", async () => {
          await advanceBatchStage(batch.id, pendingStageIndex);
        });
      }

      advanceBatchList.appendChild(card);
    });
  }

  async function advanceBatchStage(batchId, stageIndex) {
    const batch = getBatchById(batchId);
    if (!batch) return;

    const prevStage = batch.stages[stageIndex - 1];
    const currentStage = batch.stages[stageIndex];

    const today = new Date().toISOString().split("T")[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBlock = await LedgerEngine.createBlock(
      batch.id,
      stageIndex + 1,
      currentStage.title,
      currentStage.facility,
      currentStage.operator,
      prevStage.blockHash,
      { timestamp: today + " " + timeNow }
    );

    currentStage.status = "completed";
    currentStage.date = today;
    currentStage.time = timeNow;
    currentStage.blockHash = newBlock.blockHash;
    currentStage.prevHash = prevStage.blockHash;
    currentStage.badge = "Stage Verified";

    if (stageIndex + 1 < batch.stages.length) {
      batch.stages[stageIndex + 1].status = "active";
      batch.stages[stageIndex + 1].prevHash = newBlock.blockHash;
      batch.status = "transit";
      batch.statusLabel = `In Progress: ${batch.stages[stageIndex + 1].title}`;
    } else {
      batch.status = "retail";
      batch.statusLabel = "Available on Supermarket Shelf";
    }

    updateBatch(batch);
    playBlockSound();
    showToast(`Block mined & stage advanced: ${currentStage.title}`);
    renderAdvanceBatchList();
    if (batch.id === state.currentBatchId) {
      selectBatch(batch.id);
    }
  }

  /* ==========================================================================
     Ledger Explorer View
     ========================================================================== */
  function renderLedgerExplorer() {
    const blocksList = document.getElementById("ledger-blocks-list");
    if (!blocksList) return;
    const batches = loadBatches();
    blocksList.innerHTML = "";

    let totalBlocks = 0;

    batches.forEach(batch => {
      batch.stages.forEach(stage => {
        if (stage.blockHash && stage.blockHash.startsWith("0x")) {
          totalBlocks++;
          const blockCard = document.createElement("div");
          blockCard.className = "glass-panel";
          blockCard.style.padding = "18px";
          blockCard.style.borderLeft = "4px solid var(--emerald-400)";

          blockCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="stage-badge badge-completed">Stage ${stage.stageIndex}</span>
                <span style="font-weight: 700; font-size: 1.05rem;">${batch.name}</span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-400);">${batch.id}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${stage.date} • ${stage.time}</div>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">
              ${stage.title} • Facility: <strong>${stage.facility}</strong> • Operator: <strong>${stage.operator}</strong>
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="color: var(--text-muted); font-weight: 700;">BLOCK HASH:</span>
                <span class="mono-hash">${stage.blockHash}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="color: var(--text-muted); font-weight: 700;">PREV HASH:</span>
                <span class="mono-hash" style="color: #94a3b8;">${stage.prevHash}</span>
              </div>
            </div>
          `;

          blocksList.appendChild(blockCard);
        }
      });
    });

    const totalEl = document.getElementById("ledger-total-blocks");
    if (totalEl) totalEl.textContent = `${totalBlocks} Blocks`;
  }

  /* ==========================================================================
     Initial App Bootstrap
     ========================================================================== */
  // On load, keep the whole chain info hidden until a QR code is scanned or batch ID entered
  const urlParams = new URLSearchParams(window.location.search);
  const paramBatch = urlParams.get("batch");
  if (paramBatch) {
    handleScannedData(paramBatch);
  }
});
