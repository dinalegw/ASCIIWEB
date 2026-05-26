document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const htmlInput = document.getElementById('html-input');
  const asciiOutput = document.getElementById('ascii-output');

  generateBtn.addEventListener('click', async () => {
    const html = htmlInput.value;
    asciiOutput.textContent = 'Loading...';


    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html })
      });

      const data = await response.json();
      if (response.ok) {
        asciiOutput.textContent = data.ascii;
      } else {
        asciiOutput.textContent = 'Error: ' + data.error;
      }
    } catch (err) {
      asciiOutput.textContent = 'Failed to connect to server';
    }
  });
});