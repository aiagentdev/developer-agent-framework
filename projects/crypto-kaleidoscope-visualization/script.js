'use strict';

let canvas = document.getElementById('kaleidoscope-canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight;

let animationSpeed = 5;
let patternComplexity = 5;
let isPaused = false;

let cryptoSelect = document.getElementById('crypto-select');
let animationSpeedSlider = document.getElementById('animation-speed');
let patternComplexitySlider = document.getElementById('pattern-complexity');
let pauseButton = document.getElementById('pause-button');
let captureButton = document.getElementById('capture-button');

let cryptocurrencies = [];
let selectedCrypto = null;
let marketData = {};

function init() {
  fetchCryptocurrencies();
  setupEventListeners();
  animate();
}

function fetchCryptocurrencies() {
  fetch('https://api.coingecko.com/api/v3/coins/list')
    .then(response => response.json())
    .then(data => {
      cryptocurrencies = data;
      populateCryptoSelect();
    });
}

function populateCryptoSelect() {
  cryptocurrencies.slice(0, 100).forEach(coin => {
    let option = document.createElement('option');
    option.value = coin.id;
    option.textContent = coin.name;
    cryptoSelect.appendChild(option);
  });
  selectedCrypto = cryptoSelect.value;
  fetchMarketData();
}

function fetchMarketData() {
  fetch(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}`)
    .then(response => response.json())
    .then(data => {
      marketData.priceChange = data.market_data.price_change_percentage_24h;
      marketData.tradingVolume = data.market_data.total_volume.usd;
      marketData.marketCap = data.market_data.market_cap.usd;
      updateVisualizationParameters();
    });
}

function updateVisualizationParameters() {
  // Map data to visualization parameters
  animationSpeed = Math.abs(marketData.priceChange) || 1;
  patternComplexity = Math.log10(marketData.tradingVolume) || 1;
  // Use market cap to influence color spectrum
}

function setupEventListeners() {
  cryptoSelect.addEventListener('change', () => {
    selectedCrypto = cryptoSelect.value;
    fetchMarketData();
  });

  animationSpeedSlider.addEventListener('input', () => {
    animationSpeed = animationSpeedSlider.value;
  });

  patternComplexitySlider.addEventListener('input', () => {
    patternComplexity = patternComplexitySlider.value;
  });

  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
  });

  captureButton.addEventListener('click', () => {
    let link = document.createElement('a');
    link.download = 'kaleidoscope.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

let angle = 0;

function drawKaleidoscope() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  let numSides = Math.floor(patternComplexity) * 4;
  let step = (Math.PI * 2) / numSides;
  let radius = Math.min(canvas.width, canvas.height) / 2;

  for (let i = 0; i < numSides; i++) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle + i * step);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.strokeStyle = `hsl(${(i * 360) / numSides}, 100%, 50%)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  angle += 0.01 * animationSpeed;

  ctx.restore();
}

function animate() {
  if (!isPaused) {
    drawKaleidoscope();
  }
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth * 0.75;
  canvas.height = window.innerHeight;
});

init();
