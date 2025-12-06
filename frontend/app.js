const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const statusEl = document.getElementById('status');
const reportSection = document.getElementById('report');
const reportContent = document.getElementById('reportContent');
const backBtn = document.getElementById('backBtn');
const emailInput = document.getElementById('email');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!fileInput.files.length) {
    statusEl.textContent = 'Please select a PDF file.';
    return;
  }
  statusEl.textContent = 'Uploading and analyzing...';
  const fd = new FormData();
  fd.append('resume', fileInput.files[0]);
  if (emailInput.value) fd.append('email', emailInput.value);

  try {
    const resp = await fetch('http://localhost:4000/api/analyze', { method: 'POST', body: fd });
    if (!resp.ok) {
      const err = await resp.json().catch(()=>({error:'unknown'}));
      statusEl.textContent = 'Analysis failed: ' + (err.error || resp.statusText);
      return;
    }
    const data = await resp.json();
    renderReport(data);
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = 'Network error: ' + err.message;
  }
});

function renderReport(data) {
  reportSection.classList.remove('hidden');
  document.querySelector('.upload-card').classList.add('hidden');
  reportContent.innerHTML = `
    <p><strong>Domain:</strong> ${escapeHtml(data.domain || '')}</p>
    <p><strong>Skills:</strong> ${Array.isArray(data.skills) ? data.skills.map(s=>`<span class="tag">${escapeHtml(s)}</span>`).join('') : escapeHtml(String(data.skills||''))}</p>
    <h3>Strengths</h3>
    <ul>${(data.feedback?.strengths||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')||'<li>—</li>'}</ul>
    <h3>Weaknesses</h3>
    <ul>${(data.feedback?.weaknesses||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')||'<li>—</li>'}</ul>
    <h3>Suggested Improvements</h3>
    <ul>${(data.feedback?.improvements||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')||'<li>—</li>'}</ul>
  `;
}

backBtn.addEventListener('click', () => {
  reportSection.classList.add('hidden');
  document.querySelector('.upload-card').classList.remove('hidden');
  fileInput.value = '';
  reportContent.innerHTML = '';
});

function escapeHtml(str){ return String(str).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }


