(function(){
  const grid = document.getElementById('grid');
  const cells = Array.from(grid.querySelectorAll('.cell'));
  const status = document.getElementById('status');
  const btnRestart = document.getElementById('restart');
  const btnUndo = document.getElementById('undo');
  const btnClearScore = document.getElementById('clearScore');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');
  const WIN = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  let board, current, over, history;
  let scoreX = 0, scoreO = 0, scoreD = 0;
  function init(){
    board = Array(9).fill(null);
    current = 'X';
    over = false;
    history = [];
    cells.forEach((c,i)=>{
      c.textContent = '';
      c.classList.remove('x','o','win');
      c.disabled = false;
      c.setAttribute('aria-label', `Feld ${i+1} leer`);
    });
    setStatus(`Am Zug: ${current}`);
  }
  function setStatus(text){ status.textContent = text; }
  function updateScore(){ scoreXEl.textContent = scoreX; scoreOEl.textContent = scoreO; scoreDEl.textContent = scoreD; }
  function place(i){
    if (over || board[i]) return;
    board[i] = current;
    history.push(i);
    const cell = cells[i];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase());
    cell.setAttribute('aria-label', `Feld ${i+1}: ${current}`);
    const line = getWinLine();
    if (line){
      line.forEach(idx=>cells[idx].classList.add('win'));
      over = true;
      setStatus(`${current} hat gewonnen!`);
      if (current === 'X') scoreX++; else scoreO++;
      updateScore();
      disableAll();
      return;
    }
    if (board.every(Boolean)){
      over = true;
      setStatus(`Unentschieden!`);
      scoreD++; updateScore(); disableAll(); return;
    }
    current = current === 'X' ? 'O' : 'X';
    setStatus(`Am Zug: ${current}`);
  }
  function getWinLine(){
    for (const [a,b,c] of WIN){
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a,b,c];
    }
    return null;
  }
  function disableAll(){ cells.forEach(c=>c.disabled=true); }
  function restart(){ init(); }
  function undo(){
    if (history.length === 0) return;
    if (over){
      over = false; cells.forEach(c=>c.disabled=false); cells.forEach(c=>c.classList.remove('win'));
    }
    const last = history.pop();
    board[last] = null;
    const cell = cells[last];
    cell.textContent = '';
    cell.classList.remove('x','o');
    cell.setAttribute('aria-label', `Feld ${last+1} leer`);
    current = current === 'X' ? 'O' : 'X';
    setStatus(`Am Zug: ${current}`);
  }  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.cell');
    if (!btn) return;
    const i = Number(btn.dataset.index);
    place(i);
  });
  window.addEventListener('keydown', (e)=>{
    const k = e.key.toLowerCase();
    if (k >= '1' && k <= '9'){ place(Number(k)-1); return; }
    if (k === 'r') { restart(); return; }
    if (k === 'z') { undo(); return; }
  });
  document.getElementById('restart').addEventListener('click', restart);
  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('clearScore').addEventListener('click', ()=>{ scoreX=0; scoreO=0; scoreD=0; updateScore(); });
  init(); updateScore();
})();
