/**
 * AgriTrace 360 - QR Scanner & Audio Feedback Controller
 * Handles live webcam camera feeds, image file decoding, simulated laser scanning, and audio chimes.
 */

class AgriQRScanner {
  constructor(options = {}) {
    this.videoElement = options.videoElement || null;
    this.canvasElement = options.canvasElement || null;
    this.onScanSuccess = options.onScanSuccess || null;
    this.stream = null;
    this.scanning = false;
    this.animationFrameId = null;
    this.audioContext = null;
  }

  // Audio synthesizer for crystal-clear tactile confirmation
  playScanBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = "sine";
      // Ascending crisp dual-tone chime
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.08); // F#6
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn("Audio chime unsupported or blocked:", e);
    }
  }

  // Play pleasant mechanical ledger block confirmation chord
  playBlockConfirmationSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const now = this.audioContext.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      notes.forEach((freq, idx) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.35);
      });
    } catch (e) {
      console.warn("Audio block sound blocked:", e);
    }
  }

  // Start webcam video scanner
  async startCamera(videoElement, canvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API not supported in this browser. Please use the simulated scanner or upload a QR image.");
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      this.videoElement.srcObject = this.stream;
      this.videoElement.setAttribute("playsinline", true);
      await this.videoElement.play();
      this.scanning = true;
      this.requestFrameLoop();
      return true;
    } catch (err) {
      console.error("Camera access failed:", err);
      throw err;
    }
  }

  // Continuous frame loop analyzing camera video frames with jsQR
  requestFrameLoop() {
    if (!this.scanning) return;

    if (this.videoElement && this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      const canvas = this.canvasElement || document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          const rawData = code.data.trim();
          this.playScanBeep();
          this.stopCamera();
          if (this.onScanSuccess) {
            this.onScanSuccess(rawData);
          }
          return;
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.requestFrameLoop());
  }

  // Stop camera stream cleanly
  stopCamera() {
    this.scanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  // Decode QR code from an image file (PNG, JPG, WebP)
  decodeImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          if (window.jsQR) {
            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              this.playScanBeep();
              resolve(code.data.trim());
              return;
            }
          }
          reject(new Error("No QR code detected in this image. Make sure the QR code is clear and well-lit."));
        };
        img.onerror = () => reject(new Error("Failed to load image file."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Could not read uploaded file."));
      reader.readAsDataURL(file);
    });
  }

  // Simulate an authentic optical scan of any batch with laser sweep animation
  simulateScan(batchId, onComplete) {
    this.playScanBeep();
    if (onComplete) {
      setTimeout(() => {
        onComplete(batchId);
      }, 400);
    }
  }
}

window.AgriQRScanner = AgriQRScanner;
