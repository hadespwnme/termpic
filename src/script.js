const inputUser   = document.getElementById('inputUser');
const inputHost   = document.getElementById('inputHost');
const inputPath   = document.getElementById('inputPath');
const inputCmd    = document.getElementById('inputCommand');
const inputOutput = document.getElementById('inputOutput');
const isRootBox   = document.getElementById('isRoot');
const termCode    = document.getElementById('terminalCode');
const themeSelect = document.getElementById('themeSelect');
const termWrapper = document.getElementById('terminalWrapper');

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[tag]));
}

themeSelect.addEventListener('change', () => {
  termWrapper.className = `theme-${themeSelect.value}`;
});

function formatOutputLines(raw) {
  return raw.split('\n').map(line => {
    if (!line.trim()) return '';

    const isRoot = line.includes(' root ');
    const isDir = line.startsWith('d');
    const isLink = line.startsWith('l');
    const isFile = line.startsWith('-');
    const isExec = isFile && /[x]/.test(line.slice(1, 10));
    const isDot = line.trim().startsWith('.');

    let cls = 'white';
    if (isRoot) cls = 'red';
    else if (isLink) cls = 'cyan';
    else if (isDir) cls = 'blue';
    else if (isExec) cls = 'green';
    else if (isDot) cls = 'gray';

    return `<code class="${cls}">${escapeHTML(line)}</code>`;
  });
}

function renderPreview() {
  const user = inputUser.value || 'user';
  const host = inputHost.value || 'hostname';
  const path = inputPath.value || '~';
  const cmd  = inputCmd.value || '';
  const out  = inputOutput.value || '';
  const root = isRootBox.checked;

  const promptUser = root ? 'root' : user;
  const promptChar = root ? '#' : '$';
  const prefix     = `${promptUser}@${host}:${path}${promptChar} `;
  const promptLine = `<code class="prompt">${escapeHTML(prefix + cmd)}</code>`;

  const outputLines = formatOutputLines(out);
  termCode.innerHTML = [promptLine, ...outputLines].join('\n');
}

document.getElementById('generateBtn').addEventListener('click', renderPreview);
isRootBox.addEventListener('change', renderPreview);
[inputUser, inputHost, inputPath, inputCmd, inputOutput]
  .forEach(el => el.addEventListener('input', renderPreview));

document.getElementById('downloadBtn').addEventListener('click', () => {
  html2canvas(document.getElementById('terminalWrapper'), {
    useCORS: true,
    scale: 2,
    backgroundColor: null
  }).then(canvas => {
    const a = document.createElement('a');
    a.download = 'terminal-snapshot.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }).catch(err => console.error('Screenshot gagal:', err));
});
