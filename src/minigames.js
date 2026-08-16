// Trois mini-jeux rétro sur un canvas 2D partagé : Snake et Casse-briques
// (bornes d'arcade) et Pong contre Robin (la TV du salon).
// API : start(name) → update(dt, input) renvoie null tant que ça joue, puis
// un objet résultat. abort() quitte proprement (Échap).

const COL = {
  bg: "#14101f",
  fg: "#fdf6ff",
  pink: "#ff8fb1",
  red: "#e04a54",
  teal: "#5fa8a0",
  dim: "#544a75",
};

export function createMinigames() {
  const panel = document.getElementById("minigame");
  const titleEl = document.getElementById("mini-title");
  const canvas = document.getElementById("mini-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  let game = null;

  function drawHeart(x, y, s) {
    ctx.fillStyle = COL.red;
    ctx.fillRect(x + s * 0.15, y, s * 0.3, s * 0.55);
    ctx.fillRect(x + s * 0.55, y, s * 0.3, s * 0.55);
    ctx.fillRect(x, y + s * 0.2, s, s * 0.45);
    ctx.fillRect(x + s * 0.2, y + s * 0.65, s * 0.6, s * 0.2);
    ctx.fillRect(x + s * 0.4, y + s * 0.85, s * 0.2, s * 0.15);
  }

  function clear() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
  }

  // ---------------------------------------------------------------- SNAKE --
  function snakeStart() {
    const N = 13;
    return {
      name: "snake",
      N,
      cell: Math.floor(H / N) - 1,
      snake: [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 9, y: 6 },
      score: 0,
      tick: 0,
      speed: 0.16,
    };
  }
  function snakeUpdate(g, dt, input) {
    // direction (pas de demi-tour)
    if (input.dx !== 0 || input.dy !== 0) {
      const d = Math.abs(input.dx) >= Math.abs(input.dy)
        ? { x: Math.sign(input.dx), y: 0 }
        : { x: 0, y: Math.sign(input.dy) };
      if (d.x !== -g.dir.x || d.y !== -g.dir.y) g.nextDir = d;
    }
    g.tick += dt;
    if (g.tick >= g.speed) {
      g.tick = 0;
      g.dir = g.nextDir;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      if (
        head.x < 0 || head.y < 0 || head.x >= g.N || head.y >= g.N ||
        g.snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        return { name: "snake", score: g.score };
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1;
        g.speed = Math.max(0.09, g.speed - 0.004);
        do {
          g.food = { x: Math.floor(Math.random() * g.N), y: Math.floor(Math.random() * g.N) };
        } while (g.snake.some((s) => s.x === g.food.x && s.y === g.food.y));
      } else {
        g.snake.pop();
      }
    }
    // rendu
    clear();
    const c = g.cell;
    const ox = Math.floor((W - g.N * c) / 2);
    const oy = Math.floor((H - g.N * c) / 2);
    ctx.strokeStyle = COL.dim;
    ctx.strokeRect(ox - 1.5, oy - 1.5, g.N * c + 3, g.N * c + 3);
    drawHeart(ox + g.food.x * c + 1, oy + g.food.y * c + 1, c - 2);
    g.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? COL.pink : COL.teal;
      ctx.fillRect(ox + s.x * c + 1, oy + s.y * c + 1, c - 2, c - 2);
    });
    ctx.fillStyle = COL.fg;
    ctx.font = "10px monospace";
    ctx.fillText(`SCORE ${g.score}`, ox, oy - 5);
    return null;
  }

  // --------------------------------------------------------- CASSE-BRIQUES --
  function breakoutStart() {
    const bricks = [];
    const cols = 6;
    const rows = 4;
    const bw = 38;
    const bh = 11;
    for (let r = 0; r < rows; r++) {
      for (let cI = 0; cI < cols; cI++) {
        bricks.push({ x: 8 + cI * (bw + 3), y: 18 + r * (bh + 3), w: bw, h: bh, row: r });
      }
    }
    return {
      name: "breakout",
      paddle: { x: W / 2 - 22, w: 44, h: 6, y: H - 14 },
      ball: { x: W / 2, y: H - 40, vx: 75, vy: -95, r: 3 },
      bricks,
      total: bricks.length,
      broken: 0,
    };
  }
  function breakoutUpdate(g, dt, input) {
    g.paddle.x = Math.max(0, Math.min(W - g.paddle.w, g.paddle.x + input.dx * 190 * dt));
    const b = g.ball;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x < b.r || b.x > W - b.r) b.vx *= -1;
    if (b.y < b.r) b.vy = Math.abs(b.vy);
    // raquette
    if (
      b.vy > 0 && b.y + b.r >= g.paddle.y && b.y < g.paddle.y + g.paddle.h + 4 &&
      b.x >= g.paddle.x - 2 && b.x <= g.paddle.x + g.paddle.w + 2
    ) {
      b.vy = -Math.abs(b.vy) * 1.03;
      b.vx += ((b.x - (g.paddle.x + g.paddle.w / 2)) / (g.paddle.w / 2)) * 45;
    }
    // briques
    for (let i = g.bricks.length - 1; i >= 0; i--) {
      const br = g.bricks[i];
      if (b.x > br.x - b.r && b.x < br.x + br.w + b.r && b.y > br.y - b.r && b.y < br.y + br.h + b.r) {
        g.bricks.splice(i, 1);
        g.broken += 1;
        b.vy *= -1;
        break;
      }
    }
    if (g.bricks.length === 0) return { name: "breakout", broken: g.broken, total: g.total, win: true };
    if (b.y > H + 10) return { name: "breakout", broken: g.broken, total: g.total, win: false };
    // rendu
    clear();
    const rowColors = ["#e04a54", "#ff8fb1", "#e8a53d", "#5fa8a0"];
    for (const br of g.bricks) {
      ctx.fillStyle = rowColors[br.row];
      ctx.fillRect(br.x, br.y, br.w, br.h);
    }
    ctx.fillStyle = COL.fg;
    ctx.fillRect(g.paddle.x, g.paddle.y, g.paddle.w, g.paddle.h);
    ctx.fillStyle = COL.pink;
    ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    ctx.fillStyle = COL.fg;
    ctx.font = "10px monospace";
    ctx.fillText(`${g.broken}/${g.total}`, 8, 12);
    return null;
  }

  // ------------------------------------------------------------------ PONG --
  function pongStart() {
    return {
      name: "pong",
      p1: { y: H / 2 - 20, h: 40, x: 8 },
      p2: { y: H / 2 - 20, h: 40, x: W - 12 },
      ball: { x: W / 2, y: H / 2, vx: 120, vy: 55, r: 3 },
      s1: 0,
      s2: 0,
      serveTimer: 0,
    };
  }
  function pongServe(g, toward) {
    g.ball = { x: W / 2, y: H / 2, vx: 120 * toward, vy: (Math.random() - 0.5) * 130, r: 3 };
    g.serveTimer = 0.6;
  }
  function pongUpdate(g, dt, input) {
    g.p1.y = Math.max(0, Math.min(H - g.p1.h, g.p1.y + input.dy * 170 * dt));
    // Robin suit la balle (avec un peu de retard, il n'est pas parfait)
    const target = g.ball.vx > 0 ? g.ball.y - g.p2.h / 2 : H / 2 - g.p2.h / 2;
    const diff = target - g.p2.y;
    g.p2.y += Math.max(-105 * dt, Math.min(105 * dt, diff));
    if (g.serveTimer > 0) {
      g.serveTimer -= dt;
    } else {
      const b = g.ball;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < b.r || b.y > H - b.r) b.vy *= -1;
      if (b.vx < 0 && b.x - b.r <= g.p1.x + 4 && b.x > g.p1.x && b.y > g.p1.y - 4 && b.y < g.p1.y + g.p1.h + 4) {
        b.vx = Math.abs(b.vx) * 1.05;
        b.vy += ((b.y - (g.p1.y + g.p1.h / 2)) / (g.p1.h / 2)) * 60;
      }
      if (b.vx > 0 && b.x + b.r >= g.p2.x && b.x < g.p2.x + 4 && b.y > g.p2.y - 4 && b.y < g.p2.y + g.p2.h + 4) {
        b.vx = -Math.abs(b.vx) * 1.05;
        b.vy += ((b.y - (g.p2.y + g.p2.h / 2)) / (g.p2.h / 2)) * 60;
      }
      if (b.x < -10) {
        g.s2 += 1;
        if (g.s2 >= 3) return { name: "pong", win: false, s1: g.s1, s2: g.s2 };
        pongServe(g, 1);
      }
      if (b.x > W + 10) {
        g.s1 += 1;
        if (g.s1 >= 3) return { name: "pong", win: true, s1: g.s1, s2: g.s2 };
        pongServe(g, -1);
      }
    }
    // rendu
    clear();
    ctx.fillStyle = COL.dim;
    for (let y = 0; y < H; y += 14) ctx.fillRect(W / 2 - 1, y, 2, 8);
    ctx.fillStyle = COL.pink;
    ctx.fillRect(g.p1.x, g.p1.y, 5, g.p1.h);
    ctx.fillStyle = COL.teal;
    ctx.fillRect(g.p2.x, g.p2.y, 5, g.p2.h);
    ctx.fillStyle = COL.fg;
    ctx.fillRect(g.ball.x - 3, g.ball.y - 3, 6, 6);
    ctx.font = "12px monospace";
    ctx.fillText(`TOI ${g.s1}`, W / 2 - 60, 14);
    ctx.fillText(`${g.s2} ROBIN`, W / 2 + 14, 14);
    return null;
  }

  // -------------------------------------------------- LE TRAVAIL (données) --
  function newQuery(level) {
    const dirs = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    ];
    const len = Math.min(3 + level, 7);
    return Array.from({ length: len }, () => dirs[Math.floor(Math.random() * 4)]);
  }
  function workStart() {
    return {
      name: "work",
      seq: newQuery(0),
      idx: 0,
      queries: 0,
      time: 22,
      flash: 0,
      prev: { x: 0, y: 0 },
    };
  }
  function drawArrow(x, y, s, dir, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const c = s / 2;
    if (dir.x === 1) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + s, y + c);
      ctx.lineTo(x, y + s);
    } else if (dir.x === -1) {
      ctx.moveTo(x + s, y);
      ctx.lineTo(x, y + c);
      ctx.lineTo(x + s, y + s);
    } else if (dir.y === 1) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + c, y + s);
    } else {
      ctx.moveTo(x + c, y);
      ctx.lineTo(x + s, y + s);
      ctx.lineTo(x, y + s);
    }
    ctx.closePath();
    ctx.fill();
  }
  function workUpdate(g, dt, input) {
    g.time -= dt;
    if (g.flash > 0) g.flash -= dt;
    if (g.time <= 0) return { name: "work", queries: g.queries };
    // détection d'appuis directionnels (fronts montants)
    const cur = { x: Math.sign(input.dx), y: Math.sign(input.dy) };
    let pressed = null;
    if (cur.x !== 0 && g.prev.x === 0) pressed = { x: cur.x, y: 0 };
    else if (cur.y !== 0 && g.prev.y === 0) pressed = { x: 0, y: cur.y };
    g.prev = cur;
    if (pressed) {
      const want = g.seq[g.idx];
      if (pressed.x === want.x && pressed.y === want.y) {
        g.idx += 1;
        if (g.idx >= g.seq.length) {
          g.queries += 1;
          g.seq = newQuery(g.queries);
          g.idx = 0;
        }
      } else {
        g.idx = 0;
        g.flash = 0.25; // erreur : la requête repart de zéro
      }
    }
    // rendu
    clear();
    if (g.flash > 0) {
      ctx.fillStyle = "#4a1a22";
      ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = COL.fg;
    ctx.font = "11px monospace";
    ctx.fillText(`REQUÊTES : ${g.queries}`, 12, 20);
    // chrono
    ctx.fillStyle = COL.dim;
    ctx.fillRect(12, 30, W - 24, 6);
    ctx.fillStyle = g.time < 5 ? COL.red : COL.teal;
    ctx.fillRect(12, 30, (W - 24) * (g.time / 22), 6);
    // la séquence
    const s = 24;
    const total = g.seq.length * (s + 8) - 8;
    const ox = (W - total) / 2;
    g.seq.forEach((d, i) => {
      const color = i < g.idx ? COL.teal : i === g.idx ? COL.pink : COL.dim;
      drawArrow(ox + i * (s + 8), H / 2 - s / 2, s, d, color);
    });
    ctx.fillStyle = COL.dim;
    ctx.font = "9px monospace";
    ctx.fillText("Reproduis la requête avec les flèches !", 12, H - 12);
    return null;
  }

  // ------------------------------------------------------------------ API --
  const TITLES = {
    snake: "🐍 SNAKE — mange les cœurs !",
    breakout: "🧱 CASSE-BRIQUES",
    pong: "🏓 PONG — toi contre Robin !",
    work: "📊 RUSH DE DONNÉES — au boulot !",
  };
  const STARTERS = { snake: snakeStart, breakout: breakoutStart, pong: pongStart, work: workStart };
  const UPDATERS = { snake: snakeUpdate, breakout: breakoutUpdate, pong: pongUpdate, work: workUpdate };

  function start(name) {
    game = STARTERS[name]();
    titleEl.textContent = TITLES[name];
    panel.classList.remove("hidden");
    clear();
  }

  function update(dt, input) {
    if (!game) return null;
    const res = UPDATERS[game.name](game, dt, input);
    if (res) {
      game = null;
      panel.classList.add("hidden");
    }
    return res;
  }

  function abort() {
    game = null;
    panel.classList.add("hidden");
  }

  // pour les tests (accès direct à l'état du jeu en cours)
  function peek() {
    return game;
  }

  return { start, update, abort, peek };
}
