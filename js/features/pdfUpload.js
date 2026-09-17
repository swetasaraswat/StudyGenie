async function handlePdfUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const pdfStatus = document.getElementById('pdfStatus');
  const inputTextarea = document.getElementById('inputText');

  pdfStatus.textContent = '📄 Processing PDF...';
  pdfStatus.style.color = '#fff';
  inputTextarea.value = '';

  try {
    const arrayBuffer = await file.arrayBuffer();

    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library failed to load');
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(' ') + '\n\n';
    }

    const trimmedText = fullText.trim();
    inputTextarea.value = trimmedText;

    if (trimmedText.length > 0) {
      pdfStatus.textContent = `✅ PDF loaded successfully! (${pdf.numPages} pages)`;
      pdfStatus.style.color = '#10b981';
    } else {
      pdfStatus.textContent = '⚠️ PDF loaded, but no text extracted';
      pdfStatus.style.color = '#f093fb';
    }
  } catch (error) {
    console.error('PDF error:', error);
    pdfStatus.textContent = '❌ Error loading PDF';
    pdfStatus.style.color = '#ef4444';
  }
}
