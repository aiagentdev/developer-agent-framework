// Landing Animation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * (innerWidth - size * 2) + size;
    let y = Math.random() * (innerHeight - size * 2) + size;
    let directionX = Math.random() * 3 - 1.5;
    let directionY = Math.random() * 3 - 1.5;
    let color = '#00ffbb';
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - (distance / 20000);
        ctx.strokeStyle = 'rgba(0,255,187,' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

init();
animate();

// Enter App
const enterButton = document.getElementById('enter-button');
const landing = document.getElementById('landing-animation');
const app = document.getElementById('app');

enterButton.addEventListener('click', () => {
  landing.classList.add('hidden');
  app.classList.remove('hidden');
});

// Variables
let svg;
let simulation;
let nodes = [];
let links = [];
let tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

// Fetch API Key
let apiKey = prompt('Please enter your Etherscan API Key');

// Form Submission
const form = document.getElementById('input-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const address = document.getElementById('address').value;
  const depth = parseInt(document.getElementById('depth').value);
  fetchData(address, depth);
});

// Fetch Data Function
async function fetchData(address, depth) {
  nodes = [];
  links = [];
  // Placeholder for actual API calls
  // Simulate fetching data and building nodes and links
  simulateData(address, depth);
  createGraph();
  updateInsights();
}

// Simulate Data Function
function simulateData(address, depth) {
  for (let i = 0; i < depth * 5; i++) {
    nodes.push({ id: 'Wallet ' + (i + 1), group: Math.floor(Math.random() * 3) + 1, size: Math.random() * 10 + 5 });
    if (i > 0) {
      links.push({ source: 'Wallet ' + i, target: 'Wallet ' + (i + 1), value: Math.random() * 100 });
    }
  }
}

// Create Graph Function
function createGraph() {
  d3.select('#graph').selectAll('*').remove();
  svg = d3.select('#graph');

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(svg.node().getBoundingClientRect().width / 2, svg.node().getBoundingClientRect().height / 2));

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', d => d.value / 10)
    .attr('class', 'link');

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', d => d.size)
    .attr('fill', d => color(d.group))
    .attr('class', 'node')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
}

// Color Scale Function
function color(group) {
  switch (group) {
    case 1:
      return '#ff0000'; // Exchange
    case 2:
      return '#00ff00'; // User
    case 3:
      return '#0000ff'; // Miner
    default:
      return '#ffffff';
  }
}

// Tooltip Functions
function handleMouseOver(event, d) {
  tooltip.transition().duration(200).style('opacity', 0.9);
  tooltip.html('Address: ' + d.id + '<br/>Balance: ' + (d.size * 10).toFixed(2) + ' ETH')
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 28) + 'px');
}

function handleMouseOut(d) {
  tooltip.transition().duration(500).style('opacity', 0);
}

// Node Click Function
function handleClick(event, d) {
  fetchData(d.id, 1);
}

// Update Insights Function
function updateInsights() {
  const insights = document.getElementById('insights');
  insights.innerHTML = '';
  nodes.slice(0, 5).forEach(node => {
    const li = document.createElement('li');
    li.textContent = node.id + ' - Balance: ' + (node.size * 10).toFixed(2) + ' ETH';
    li.addEventListener('click', () => {
      fetchData(node.id, 1);
    });
    insights.appendChild(li);
  });
}

// Customization Controls
const themeSelect = document.getElementById('theme');
const nodeSizeSlider = document.getElementById('node-size');
const edgeThicknessSlider = document.getElementById('edge-thickness');

themeSelect.addEventListener('change', changeTheme);
nodeSizeSlider.addEventListener('input', updateNodeSize);
edgeThicknessSlider.addEventListener('input', updateEdgeThickness);

function changeTheme() {
  const theme = themeSelect.value;
  if (theme === 'dark') {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
  } else if (theme === 'light') {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  } else if (theme === 'neon') {
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#39ff14';
  }
}

function updateNodeSize() {
  d3.selectAll('.node').attr('r', d => d.size * (nodeSizeSlider.value / 10));
}

function updateEdgeThickness() {
  d3.selectAll('.link').attr('stroke-width', d => (d.value / 10) * (edgeThicknessSlider.value / 3));
}

// Simulated Transaction Alerts
let alertsEnabled = false;
let alertsInterval;

function enableAlerts() {
  if (!alertsEnabled) {
    alertsEnabled = true;
    alertsInterval = setInterval(simulateTransactionAlert, 5000);
  }
}

function disableAlerts() {
  if (alertsEnabled) {
    alertsEnabled = false;
    clearInterval(alertsInterval);
  }
}

function simulateTransactionAlert() {
  // Randomly pick a node and highlight it
  const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
  gsap.fromTo(d3.selectAll('.node').filter(d => d.id === randomNode.id).node(), { scale: 1 }, { scale: 2, duration: 0.5, yoyo: true, repeat: 1 });
}
