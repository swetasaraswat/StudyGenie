function showTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach((btn) => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  if (element) element.classList.add('active');

  window.scrollTo({ top: document.querySelector('.tab-navigation').offsetTop, behavior: 'smooth' });
}

function initializeApp() {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
    });
  }

  if (typeof AgoraRTC !== 'undefined') {
    initAgoraClient();
  }

  const pdfInput = document.getElementById('pdfInput');
  if (pdfInput) pdfInput.addEventListener('change', handlePdfUpload);

  loadHistory();
  showTab('tab-tools', document.getElementById('btn-tools'));
}

window.addEventListener('load', initializeApp);
