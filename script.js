// ==========================================
// 1. THEME TOGGLE (DARK / LIGHT MODE)
// ==========================================
const themeBtn = document.getElementById("theme-btn");
const themeIcon = themeBtn.querySelector(".theme-icon");

themeBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  themeIcon.textContent = newTheme === "dark" ? "🌙" : "☀️";
});

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
function getInteger(id, name) {
  const input = document.getElementById(id).value.trim();
  if (input === "") throw new Error(`${name} wajib diisi.`);
  const val = Number(input);
  if (!Number.isSafeInteger(val)) throw new Error(`${name} harus berupa bilangan bulat valid.`);
  return val;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderResult(containerId, valueHtml, stepsText) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <span class="res-title">HASIL PERHITUNGAN</span>
    <div class="res-value">${valueHtml}</div>
    <div class="res-steps">${stepsText}</div>
    <button class="copy-btn" onclick="copyToClipboard('${valueHtml.replace(/'/g, "\\'")}')">📋 Salin Hasil</button>
  `;
}

function renderError(containerId, message) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <span class="res-title">ERR / INPUT TIDAK VALID</span>
    <div class="res-badge danger">Gagal</div>
    <div class="res-steps" style="color: #ef4444;">${message}</div>
  `;
}

window.copyToClipboard = function(text) {
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  navigator.clipboard.writeText(cleanText);
  showToast("Hasil berhasil disalin ke clipboard!");
};

// ==========================================
// 3. KALKULATOR 01: MODULO
// ==========================================
document.getElementById("mod-btn").addEventListener("click", () => {
  try {
    const a = getInteger("mod-a", "Bilangan (a)");
    const m = getInteger("mod-m", "Modulus (m)");
    if (m <= 0) throw new Error("Modulus (m) harus lebih besar dari 0.");

    const r = ((a % m) + m) % m;
    const q = Math.floor(a / m);

    renderResult(
      "mod-result",
      `${a} mod ${m} = <strong>${r}</strong>`,
      `Persamaan: a = (q × m) + r\n${a} = (${q} × ${m}) + ${r}\n\nSisa hasil pembagian non-negatif adalah ${r}.`
    );
  } catch (err) {
    renderError("mod-result", err.message);
  }
});

// ==========================================
// 4. KALKULATOR 02: KONGRUENSIS
// ==========================================
document.getElementById("con-btn").addEventListener("click", () => {
  try {
    const a = getInteger("con-a", "Bilangan a");
    const b = getInteger("con-b", "Bilangan b");
    const m = getInteger("con-m", "Modulus m");
    if (m <= 0) throw new Error("Modulus (m) harus lebih besar dari 0.");

    const diff = a - b;
    const isCongruent = diff % m === 0;
    const k = diff / m;

    const badge = isCongruent
      ? `<span class="res-badge success">KONGRUEN ✓</span>`
      : `<span class="res-badge danger">TIDAK KONGRUEN ✕</span>`;

    const formula = isCongruent ? "≡" : "≢";
    const statusText = isCongruent
      ? `Karena (${a} − ${b}) = ${diff} habis dibagi oleh ${m} (kelipatan k = ${k}).`
      : `Karena (${a} − ${b}) = ${diff} TIDAK habis dibagi oleh ${m}.`;

    renderResult(
      "con-result",
      `${badge} <br>${a} ${formula} ${b} (mod ${m})`,
      `Pembuktian: a − b = k × m\n${a} − (${b}) = ${diff}\n${statusText}`
    );
  } catch (err) {
    renderError("con-result", err.message);
  }
});

// ==========================================
// 5. KALKULATOR 03: KONVERSI SISTEM BILANGAN
// ==========================================
document.getElementById("base-btn").addEventListener("click", () => {
  const raw = document.getElementById("base-val").value.trim();
  const from = Number(document.getElementById("base-from").value);

  try {
    if (!raw) throw new Error("Input bilangan wajib diisi.");

    const patterns = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/
    };

    if (!patterns[from].test(raw)) {
      throw new Error(`Format tidak cocok untuk Basis ${from}.`);
    }

    const dec = parseInt(raw, from);
    if (!Number.isSafeInteger(dec)) throw new Error("Angka terlalu besar untuk diproses.");

    const bin = dec.toString(2);
    const oct = dec.toString(8);
    const hex = dec.toString(16).toUpperCase();

    renderResult(
      "base-result",
      `Desimal: <strong>${dec}</strong>`,
      `• Biner (Basis 2)    : ${bin}\n• Oktal (Basis 8)    : ${oct}\n• Desimal (Basis 10)  : ${dec}\n• Heksa (Basis 16)   : ${hex}`
    );
  } catch (err) {
    renderError("base-result", err.message);
  }
});

// ==========================================
// 6. KALKULATOR 04: KOMBINATORIKA (P & C)
// ==========================================
function calcFactorial(n) {
  let res = 1n;
  for (let i = 2n; i <= BigInt(n); i++) res *= i;
  return res;
}

document.getElementById("comb-btn").addEventListener("click", () => {
  try {
    const n = getInteger("comb-n", "Total objek (n)");
    const r = getInteger("comb-r", "Objek dipilih (r)");

    if (n < 0 || r < 0) throw new Error("Nilai n dan r tidak boleh negatif.");
    if (r > n) throw new Error("Syarat r ≤ n harus terpenuhi.");
    if (n > 100) throw new Error("Gunakan n ≤ 100 agar performa tetap cepat.");

    const nFact = calcFactorial(n);
    const rFact = calcFactorial(r);
    const nrFact = calcFactorial(n - r);

    const P = nFact / nrFact;
    const C = nFact / (rFact * nrFact);

    renderResult(
      "comb-result",
      `P(${n},${r}) = <strong>${P.toLocaleString()}</strong> | C(${n},${r}) = <strong>${C.toLocaleString()}</strong>`,
      `Rumus Permutasi : P(n,r) = n! / (n−r)!\nRumus Kombinasi : C(n,r) = n! / [r! × (n−r)!]\n\nHasil hitung untuk n = ${n} dan r = ${r}.`
    );
  } catch (err) {
    renderError("comb-result", err.message);
  }
});

// ==========================================
// 7. IMAGE UPLOAD PREVIEW
// ==========================================
const uploadInput = document.getElementById("upload-input");
const previewGrid = document.getElementById("preview-grid");

uploadInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (!files.length) return;

  // Hapus pesan kosong
  const noImgMsg = previewGrid.querySelector(".no-images");
  if (noImgMsg) noImgMsg.remove();

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const item = document.createElement("div");
      item.className = "preview-item";
      item.innerHTML = `<img src="${evt.target.result}" alt="Bukti Belajar">`;
      previewGrid.appendChild(item);
    };

    reader.readAsDataURL(file);
  });
});