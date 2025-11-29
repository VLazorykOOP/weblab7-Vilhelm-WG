// canvas-figures.js
// Малює сцену, еквівалентну наданому SVG, використовуючи координати viewBox

(function(){
  const canvas = document.getElementById('scene');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // SVG viewBox: -4 -4 10 8
  const vb = { x: -4, y: -4, w: 10, h: 8 };

  function toCanvasX(x){
    return (x - vb.x) * (canvas.width / vb.w);
  }
  function toCanvasY(y){
    // SVG y increases down normally; the SVG content used a group transform scale(1,-1)
    // so coordinates in the markup are in a Cartesian system (y up). We map that to canvas y down.
    return canvas.height - (y - vb.y) * (canvas.height / vb.h);
  }

  // Helper to draw a filled & stroked rect from SVG-like coords
  function drawSVGRect(x,y,w,h, fill, stroke, opacity){
    const cx = toCanvasX(x);
    const cy = toCanvasY(y + h); // SVG rect y is top; our toCanvasY maps cartesian; compute top->canvas
    const cw = w * (canvas.width / vb.w);
    const ch = h * (canvas.height / vb.h);
    ctx.globalAlpha = opacity || 1;
    ctx.fillStyle = fill || 'blue';
    ctx.fillRect(cx, cy, cw, ch);
    if (stroke){ ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.strokeRect(cx, cy, cw, ch); }
    ctx.globalAlpha = 1;
  }

  function drawSVGCircle(cx,cy,r, fill, stroke, opacity){
    const x = toCanvasX(cx);
    const y = toCanvasY(cy);
    const sx = canvas.width / vb.w;
    const sy = canvas.height / vb.h;
    // approximate radius by average scale
    const rad = r * (sx + sy) / 2;
    ctx.beginPath();
    ctx.globalAlpha = opacity || 1;
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fillStyle = fill || 'blue';
    ctx.fill();
    if (stroke){ ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  function drawSVGPolygon(points, fill, stroke, opacity, transform){
    // points: array of {x,y}
    ctx.save();
    if (transform){ // transform = {translate:[dx,dy], rotate:angle, scale: [sx,sy]}
      const tx = toCanvasX(transform.translate[0]);
      const ty = toCanvasY(transform.translate[1]);
      ctx.translate(tx, ty);
      if (transform.rotate) ctx.rotate(transform.rotate);
      if (transform.scale) ctx.scale(transform.scale[0], transform.scale[1]);
    }
    ctx.beginPath();
    points.forEach((p,i) => {
      const x = toCanvasX(p.x) - (transform ? toCanvasX(transform.translate[0]) : 0);
      const y = toCanvasY(p.y) - (transform ? toCanvasY(transform.translate[1]) : 0);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.globalAlpha = opacity || 1;
    ctx.fillStyle = fill || 'blue';
    ctx.fill();
    if (stroke){ ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Scene objects (using coordinate values from provided SVG)
  const scene = {
    // circles
    circle1: { cx:-2, cy:1, r:1, fill:'blue', stroke:'black', opacity:0.6 },
    circle2: { cx:1, cy:1, r:1, fill:'blue', stroke:'black', opacity:0.6 },
    // rects and squares
    rect1: { x:-3, y:-1.5, w:2, h:1.5, fill:'blue', stroke:'black', opacity:0.6 },
    rect2: { x:2, y:1, w:1, h:1, fill:'blue', stroke:'black', opacity:0.6 },
    rect3: { x:3, y:0, w:1, h:1, fill:'blue', stroke:'black', opacity:0.6 },
    rect4: { x:4, y:-2, w:1, h:1, fill:'blue', stroke:'black', opacity:0.6 },
    rect5: { x:0, y:-2, w:1, h:1, fill:'blue', stroke:'black', opacity:0.6 },
    rect6: { x:1, y:-3, w:2, h:1, fill:'blue', stroke:'black', opacity:0.6 },
    // small square near diamond and diamond polygon
    sqNear: { x:3.8, y:1, w:0.8, h:0.8, fill:'blue', stroke:'black', opacity:0.6 },
    diamondPoly: { points:[ {x:3,y:0},{x:4,y:-1},{x:3,y:-2},{x:2,y:-1} ], fill:'blue', stroke:'black', opacity:0.6 }
  };

  // We'll animate: move circle2 (the right circle) left-right, pulse circle1, rotate diamond slightly,
  // and move rect6 (bottom rectangle) up-down.
  const anim = { t:0, running:false };

  function clear(){ ctx.clearRect(0,0,canvas.width, canvas.height); }

  function drawAxes(){
    ctx.save();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
    // x axis from x = -3.5 to 5.5 (from svg)
    const x1 = toCanvasX(-3.5), x2 = toCanvasX(5.5), y0 = toCanvasY(0);
    ctx.beginPath(); ctx.moveTo(x1,y0); ctx.lineTo(x2,y0); ctx.stroke();
    // arrow
    ctx.beginPath(); ctx.moveTo(x2,y0); ctx.lineTo(x2-10,y0-6); ctx.moveTo(x2,y0); ctx.lineTo(x2-10,y0+6); ctx.stroke();
    // y axis from y=-3.5 to 3
    const y1 = toCanvasY(-3.5), y2 = toCanvasY(3);
    const x0 = toCanvasX(0);
    ctx.beginPath(); ctx.moveTo(x0,y1); ctx.lineTo(x0,y2); ctx.stroke();
    // arrow
    ctx.beginPath(); ctx.moveTo(x0,y2); ctx.lineTo(x0-6,y2+10); ctx.moveTo(x0,y2); ctx.lineTo(x0+6,y2+10); ctx.stroke();
    ctx.globalAlpha = 1; ctx.restore();
  }

  function drawScene(){
    clear();
    drawAxes();

    // draw rects and circles using SVG coords
    drawSVGRect(scene.rect1.x, scene.rect1.y, scene.rect1.w, scene.rect1.h, scene.rect1.fill, scene.rect1.stroke, scene.rect1.opacity);
    drawSVGCircle(scene.circle1.cx, scene.circle1.cy, scene.circle1.r, scene.circle1.fill, scene.circle1.stroke, scene.circle1.opacity);

    // circle2 animated
    drawSVGCircle(scene.circle2.cx, scene.circle2.cy, scene.circle2.r, scene.circle2.fill, scene.circle2.stroke, scene.circle2.opacity);

    drawSVGRect(scene.rect2.x, scene.rect2.y, scene.rect2.w, scene.rect2.h, scene.rect2.fill, scene.rect2.stroke, scene.rect2.opacity);
    drawSVGRect(scene.rect3.x, scene.rect3.y, scene.rect3.w, scene.rect3.h, scene.rect3.fill, scene.rect3.stroke, scene.rect3.opacity);
    drawSVGRect(scene.rect4.x, scene.rect4.y, scene.rect4.w, scene.rect4.h, scene.rect4.fill, scene.rect4.stroke, scene.rect4.opacity);
    drawSVGRect(scene.rect5.x, scene.rect5.y, scene.rect5.w, scene.rect5.h, scene.rect5.fill, scene.rect5.stroke, scene.rect5.opacity);
    // rect6 as longer bottom rectangle (from svg it was x=1 y=-3 width=2 height=1)
    drawSVGRect(scene.rect6.x, scene.rect6.y, scene.rect6.w, scene.rect6.h, scene.rect6.fill, scene.rect6.stroke, scene.rect6.opacity);

    // diamond polygon
    drawSVGPolygon(scene.diamondPoly.points, scene.diamondPoly.fill, scene.diamondPoly.stroke, scene.diamondPoly.opacity, {
      translate: [0,0]
    });

    // small square near diamond
    drawSVGRect(scene.sqNear.x, scene.sqNear.y, scene.sqNear.w, scene.sqNear.h, scene.sqNear.fill, scene.sqNear.stroke, scene.sqNear.opacity);
  }

  // initialize scene values from SVG values (some were hard-coded earlier)
  function initScene(){
    // set circle positions
    scene.circle1 = { cx:-2, cy:1.5, r:1, fill:'blue', stroke:'black' };
    scene.circle2 = { cx:1, cy:1.5, r:1, fill:'blue', stroke:'black' };
    scene.rect1 = { x:-3, y:-1.5, w:2, h:1.5, fill:'blue', stroke:'black' };
    scene.rect2 = { x:2, y:1, w:1, h:1, fill:'blue', stroke:'black' };
    scene.rect3 = { x:3, y:0, w:1, h:1, fill:'blue', stroke:'black' };
    scene.rect4 = { x:4, y:-2, w:1, h:1, fill:'blue', stroke:'black' };
    scene.rect5 = { x:0, y:-2, w:1, h:1, fill:'blue', stroke:'black' };
    scene.rect6 = { x:1, y:-3, w:2, h:1, fill:'blue', stroke:'black' };
    scene.diamondPoly = { points:[ {x:3,y:0},{x:4,y:-1},{x:3,y:-2},{x:2,y:-1} ], fill:'blue', stroke:'black' };
    scene.sqNear = { x:3.8, y:1, w:0.8, h:0.8, fill:'blue', stroke:'black', };
  }

  function update(dt){
    anim.t += dt;
    const t = anim.t;
    // animate circle2 horizontally
    scene.circle2.cx = 1 + Math.sin(t*1.2) * 0.25;
    // pulse circle1 radius
    scene.circle1.r = 1 + Math.sin(t*1.6) * 0.12;
    // move rect6 up-down
    scene.rect6.y = -3 + Math.sin(t*1.0) * 0.25;
    // rotate diamond by adjusting points around its center (approx)
    const cx = 3, cy = -1; // diamond center
    const angle = Math.sin(t*0.9) * 0.6;
    const base = [{x:3,y:0},{x:4,y:-1},{x:3,y:-2},{x:2,y:-1}];
    scene.diamondPoly.points = base.map(p => {
      const dx = p.x - cx, dy = p.y - cy;
      const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
      return { x: cx + rx, y: cy + ry };
    });
    // move small square near diamond in circular path
    scene.sqNear.x = 3.3 + Math.cos(t*1.6) * 0.5;
    scene.sqNear.y = 1 + Math.sin(t*1.6) * 0.4;
  }

  let last = null;
  function raf(ts){
    if (!anim.running) return; if (!last) last = ts; const dt = (ts-last)/1000; last = ts;
    update(dt); drawScene(); requestAnimationFrame(raf);
  }

  // buttons
  const animateBtn = document.getElementById('animateBtn');
  const resetBtn = document.getElementById('resetBtn');
  animateBtn.addEventListener('click', ()=>{
    anim.running = !anim.running; if (anim.running){ animateBtn.textContent = 'Stop'; last = null; requestAnimationFrame(raf); } else animateBtn.textContent = 'Animate';
  });
  resetBtn.addEventListener('click', ()=>{ anim.running = false; animateBtn.textContent = 'Animate'; anim.t = 0; initScene(); drawScene(); });

  // init
  initScene(); drawScene();

})();