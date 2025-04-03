const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let savedSignatureHash = localStorage.getItem('signatureHash') || null;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
    if (!drawing) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('authResult').innerText = "";
}

async function hashSignature(imageData) {
    const encoder = new TextEncoder();
    const data = encoder.encode(imageData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function saveSignature() {
    const imageData = normalizeSignature();
    savedSignatureHash = await hashSignature(imageData);
    localStorage.setItem('signatureHash', savedSignatureHash);
    alert("Signature saved successfully!");
}

async function verifySignature() {
    if (!savedSignatureHash) {
        alert("No saved signature to verify against!");
        return;
    }
    const imageData = normalizeSignature();
    const currentSignatureHash = await hashSignature(imageData);
    if (currentSignatureHash === savedSignatureHash) {
        document.getElementById('authResult').innerText = "✅ Signature Verified!";
        document.getElementById('authResult').style.color = "green";
    } else {
        document.getElementById('authResult').innerText = "❌ Signature does not match!";
        document.getElementById('authResult').style.color = "red";
    }
}

function normalizeSignature() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const grayscale = pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
        const binaryColor = grayscale < 128 ? 0 : 255;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = binaryColor;
    }
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas.toDataURL('image/png');
}

function downloadSignature() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'signature.png';
    link.click();
}
