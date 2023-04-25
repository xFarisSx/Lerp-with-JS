/** @type {HTMLCanvasElement} */

const canvas = myCanvas;
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const A = {
  x: 300,
  y: 300,
};

const B = {
  x: 700,
  y: 100,
};

const orange = {
    r:230, g:150, b:0
}
const blue = {
    r:0, g:70, b:160
}

const lowFreq = 200
const highFreq = 600

let audioCtx = null;
let osc = null
canvas.onclick=function(e) {
    if(audioCtx == null){
        audioCtx = new (AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext)()
             osc = audioCtx.createOscillator()
            osc.frequency.value = 200
            osc.start()

            const node = audioCtx.createGain()
            node.gain.value = 0.01

            osc.connect(node)
            node.connect(audioCtx.destination)
    }
}

animate();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sec = new Date().getTime() / 1000;
  const t = (Math.sin(sec*1*Math.PI) + 1) / 2;
  const C = vLerp(A, B, t);
  drawDot(C, "");
  drawDot(A, "A");
  drawDot(B, "B");

  const {r, g, b} = vLerp(orange , blue, t)
  canvas.style.backgroundColor = 
  `rgb(${r}, ${g}, ${b})`

  if(osc) {
    osc.frequency.value = lerp(lowFreq, highFreq, t)
  }

  ctx.strokeStyle = "white"
  ctx.textAlign = 'center'
  ctx.textBaseline = "top"
  ctx.font = "bold 40px Arial"
  ctx.setLineDash([lerp(3, 130, t), 130])
  ctx.strokeText("Click for sound", canvas.width/2, 10)
  ctx.setLineDash([])
  ctx.fillStyle = `rgb(255, 255, 255, ${lerp(0, 0.7, t)})`
  ctx.fillText("Click for sound", canvas.width/2, 10)

  requestAnimationFrame(animate);
}

function vLerp(A, B, t) {
  const res = {}
  for (let attr in A){
    res[attr]=lerp(A[attr], B[attr], t)
  }
  return res
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawDot(pos, label) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, pos.x, pos.y);
}
