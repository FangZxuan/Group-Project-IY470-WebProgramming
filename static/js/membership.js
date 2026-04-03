// Price data - simple array format: [uGym price, Power Zone price]
const prices = {
  none: [0, 0],
  super: [16, 13],
  off: [21, 19],
  any: [30, 24]
};

// Joining fees
const joiningFees = {
  uGym: 10,
  powerZone: 30
};

// Current selections
let gymType = 'none';
let extras = [];
let selectedGym = null;

// DOM elements
const uPrice = document.getElementById('uPrice');
const pPrice = document.getElementById('pPrice');
const uBreak = document.getElementById('uBreakdown');
const pBreak = document.getElementById('pBreakdown');

// Age gate functions
function verifyAge() {
  localStorage.setItem('ageVerified', 'true');
  document.getElementById('ageGate').classList.add('hidden');
}

function cancelAge() {
  alert('You must be over 16 to access this site.');
}

// Check age on page load
if (localStorage.getItem('ageVerified')) {
  document.getElementById('ageGate').classList.add('hidden');
}

//Alternative: Uncomment below to ALWAYS show age gate for testing
//localStorage.removeItem('ageVerified');

// Main calculation function
function calculate() {
  // Start with base gym prices
  let uTotal = prices[gymType][0];
  let pTotal = prices[gymType][1];
  
  // Create breakdown lists
  let uList = [];
  let pList = [];
  
  // Add gym access line
  if (gymType === 'none') {
    uList.push('<li><span class="item-name">No gym access</span><span class="item-price">£0</span></li>');
    pList.push('<li><span class="item-name">No gym access</span><span class="item-price">£0</span></li>');
  } else if (gymType === 'super') {
    uList.push('<li><span class="item-name">Gym Super Off-Peak</span><span class="item-price">£16</span></li>');
    pList.push('<li><span class="item-name">Gym Super Off-Peak</span><span class="item-price">£13</span></li>');
  } else if (gymType === 'off') {
    uList.push('<li><span class="item-name">Gym Off-Peak</span><span class="item-price">£21</span></li>');
    pList.push('<li><span class="item-name">Gym Off-Peak</span><span class="item-price">£19</span></li>');
  } else if (gymType === 'any') {
    uList.push('<li><span class="item-name">Gym Anytime</span><span class="item-price">£30</span></li>');
    pList.push('<li><span class="item-name">Gym Anytime</span><span class="item-price">£24</span></li>');
  }
  
  // Loop through selected extras
  for (let i = 0; i < extras.length; i++) {
    let extra = extras[i];
    
    if (extra === 'Swimming') {
      if (gymType === 'none') {
        // Standalone prices
        uTotal = uTotal + 25;
        pTotal = pTotal + 20;
        uList.push('<li><span class="item-name">Swimming only</span><span class="item-price">£25</span></li>');
        pList.push('<li><span class="item-name">Swimming only</span><span class="item-price">£20</span></li>');
      } else {
        // With gym membership
        uTotal = uTotal + 15;
        pTotal = pTotal + 12.5;
        uList.push('<li><span class="item-name">Swimming</span><span class="item-price">£15</span></li>');
        pList.push('<li><span class="item-name">Swimming</span><span class="item-price">£12.50</span></li>');
      }
    }
    
    if (extra === 'Classes') {
      if (gymType === 'none') {
        uTotal = uTotal + 20;
        pTotal = pTotal + 20;
        uList.push('<li><span class="item-name">Classes only</span><span class="item-price">£20</span></li>');
        pList.push('<li><span class="item-name">Classes only</span><span class="item-price">£20</span></li>');
      } else {
        uTotal = uTotal + 10;
        // Power Zone classes are free with gym
        uList.push('<li><span class="item-name">Classes</span><span class="item-price">£10</span></li>');
        pList.push('<li><span class="item-name">Classes</span><span class="item-price free">Free</span></li>');
      }
    }
    
    if (extra === 'Massage') {
      if (gymType === 'none') {
        uTotal = uTotal + 30;
        pTotal = pTotal + 30;
        uList.push('<li><span class="item-name">Massage only</span><span class="item-price">£30</span></li>');
        pList.push('<li><span class="item-name">Massage only</span><span class="item-price">£30</span></li>');
      } else {
        uTotal = uTotal + 25;
        pTotal = pTotal + 25;
        uList.push('<li><span class="item-name">Massage</span><span class="item-price">£25</span></li>');
        pList.push('<li><span class="item-name">Massage</span><span class="item-price">£25</span></li>');
      }
    }
    
    if (extra === 'Physio') {
      if (gymType === 'none') {
        uTotal = uTotal + 25;
        pTotal = pTotal + 30;
        uList.push('<li><span class="item-name">Physio only</span><span class="item-price">£25</span></li>');
        pList.push('<li><span class="item-name">Physio only</span><span class="item-price">£30</span></li>');
      } else {
        uTotal = uTotal + 20;
        pTotal = pTotal + 25;
        uList.push('<li><span class="item-name">Physio</span><span class="item-price">£20</span></li>');
        pList.push('<li><span class="item-name">Physio</span><span class="item-price">£25</span></li>');
      }
    }
  }
  
  // Update prices on screen
  uPrice.textContent = uTotal.toFixed(2);
  pPrice.textContent = pTotal.toFixed(2);
  
  // Update breakdown lists
  uBreak.innerHTML = uList.join('');
  pBreak.innerHTML = pList.join('');
  
  // Show which is cheaper
  showWinner(uTotal, pTotal);
}

// Show winner badge
function showWinner(uTotal, pTotal) {
  let uCard = document.getElementById('uGymCard');
  let pCard = document.getElementById('pGymCard');
  let winnerText = document.getElementById('winnerText');
  
  // Remove old badges
  let oldBadges = document.querySelectorAll('.winner-badge');
  for (let i = 0; i < oldBadges.length; i++) {
    oldBadges[i].remove();
  }
  
  uCard.classList.remove('winner');
  pCard.classList.remove('winner');
  
  if (uTotal < pTotal) {
    uCard.classList.add('winner');
    winnerText.innerHTML = '<strong>uGym</strong> offers better value';
    
    // Add badge to uGym
    let badge = document.createElement('div');
    badge.className = 'winner-badge';
    badge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> Best Value';
    uCard.querySelector('.gym-body').appendChild(badge);
    
  } else if (pTotal < uTotal) {
    pCard.classList.add('winner');
    winnerText.innerHTML = '<strong>Power Zone</strong> offers better value';
    
    // Add badge to Power Zone
    let badge = document.createElement('div');
    badge.className = 'winner-badge';
    badge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> Best Value';
    pCard.querySelector('.gym-body').appendChild(badge);
    
  } else {
    winnerText.innerHTML = '<strong>Same price</strong> - choose based on features';
  }
}

// Gym type selection - NEW FUNCTION ADDED
function selectGymType(type) {
  // Remove active from all gym cards
  let gymCards = document.querySelectorAll('#gymOptions .option-card');
  for (let i = 0; i < gymCards.length; i++) {
    gymCards[i].classList.remove('active');
  }
  
  // Add active to clicked
  let selectedCard = document.querySelector('[data-type="' + type + '"]');
  if (selectedCard) {
    selectedCard.classList.add('active');
  }
  
  // Update gym type
  gymType = type;
  
  // Recalculate
  calculate();
}

// Toggle extra service
function toggleService(service) {
  let card = document.querySelector('[data-service="' + service + '"]');
  let found = false;
  let position = -1;
  
  // Check if already selected
  for (let i = 0; i < extras.length; i++) {
    if (extras[i] === service) {
      found = true;
      position = i;
      break;
    }
  }
  
  if (found) {
    // Remove from extras
    extras.splice(position, 1);
    card.classList.remove('active');
  } else {
    // Add to extras
    extras.push(service);
    card.classList.add('active');
  }
  
  calculate();
}

// Select gym plan
function selectGym(gym) {
  let uBtn = document.getElementById('uSelectBtn');
  let pBtn = document.getElementById('pSelectBtn');
  let uCard = document.getElementById('uGymCard');
  let pCard = document.getElementById('pGymCard');
  let resultBar = document.getElementById('resultBar');
  let selectedName = document.getElementById('selectedGymName');
  
  if (selectedGym === gym) {
    // Deselect
    selectedGym = null;
    uBtn.classList.remove('selected');
    uBtn.innerHTML = 'Select Plan';
    pBtn.classList.remove('selected');
    pBtn.innerHTML = 'Select Plan';
    uCard.classList.remove('selected');
    pCard.classList.remove('power-selected');
    resultBar.classList.remove('visible');
  } else {
    // Select new gym
    selectedGym = gym;
    
    if (gym === 'uGym') {
      uBtn.classList.add('selected');
      uBtn.innerHTML = 'Selected';
      pBtn.classList.remove('selected');
      pBtn.innerHTML = 'Select Plan';
      uCard.classList.add('selected');
      pCard.classList.remove('power-selected');
      selectedName.textContent = 'uGym Membership';
    } else {
      pBtn.classList.add('selected');
      pBtn.innerHTML = 'Selected';
      uBtn.classList.remove('selected');
      uBtn.innerHTML = 'Select Plan';
      pCard.classList.add('power-selected');
      uCard.classList.remove('selected');
      selectedName.textContent = 'Power Zone Membership';
    }
    
    resultBar.classList.add('visible');
  }
}

// Reset everything
function resetAll() {
  gymType = 'none';
  extras = [];
  selectedGym = null;
  
  // Reset gym selection
  let allGymCards = document.querySelectorAll('#gymOptions .option-card');
  for (let i = 0; i < allGymCards.length; i++) {
    allGymCards[i].classList.remove('active');
  }
  document.querySelector('[data-type="none"]').classList.add('active');
  
  // Reset extras
  let allServiceCards = document.querySelectorAll('.service-card');
  for (let i = 0; i < allServiceCards.length; i++) {
    allServiceCards[i].classList.remove('active');
  }
  
  // Reset buttons
  document.getElementById('uSelectBtn').classList.remove('selected');
  document.getElementById('uSelectBtn').innerHTML = 'Select Plan';
  document.getElementById('pSelectBtn').classList.remove('selected');
  document.getElementById('pSelectBtn').innerHTML = 'Select Plan';
  document.getElementById('uGymCard').classList.remove('selected');
  document.getElementById('pGymCard').classList.remove('power-selected');
  document.getElementById('resultBar').classList.remove('visible');
  
  calculate();
}

// for invoice 
function getSelectedGymAccessLabel() {
  const labels = {
    none: "No Gym Access",
    super: "Super Off-Peak",
    off: "Off-Peak",
    any: "Anytime"
  };
  return labels[gymType] || "No Gym Access";
}

function getSelectedInvoiceItems() {
  const breakdownId = selectedGym === "uGym" ? "uBreakdown" : "pBreakdown";
  const list = document.getElementById(breakdownId);
  const items = [];

  if (!list) return items;

  const rows = list.querySelectorAll("li");

  for (let i = 0; i < rows.length; i++) {
    const nameEl = rows[i].querySelector(".item-name");
    const priceEl = rows[i].querySelector(".item-price");

    const name = nameEl ? nameEl.textContent.trim() : "";
    const rawPrice = priceEl ? priceEl.textContent.trim() : "£0";

    let numericPrice = 0;
    let displayPrice = rawPrice;

    if (rawPrice.toLowerCase() === "free") {
      numericPrice = 0;
      displayPrice = "Free";
    } else {
      numericPrice = parseFloat(rawPrice.replace("£", "")) || 0;
      displayPrice = "£" + numericPrice.toFixed(2);
    }

    items.push({
      name: name,
      price: numericPrice,
      displayPrice: displayPrice
    });
  }

  return items;
}

function saveInvoiceData() {
  if (!selectedGym) return;

  const monthlyPrice = selectedGym === "uGym"
    ? parseFloat(uPrice.textContent)
    : parseFloat(pPrice.textContent);

  const joiningFee = joiningFees[selectedGym] || 0;

  const invoiceData = {
    selectedGym: selectedGym,
    selectedGymLabel: selectedGym === "uGym" ? "uGym Membership" : "Power Zone Membership",
    gymAccess: getSelectedGymAccessLabel(),
    extras: extras,
    items: getSelectedInvoiceItems(),
    monthlyPrice: monthlyPrice,
    joiningFee: joiningFee,
    totalDueToday: monthlyPrice + joiningFee
  };

  localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
}

// Continue button
function continueToConfirm() {
  let price;
  let extrasList = extras.join(', ') || 'None';
  
  if (selectedGym === 'uGym') {
    price = uPrice.textContent;
  } else {
    price = pPrice.textContent;
  }
  
  // Save everything to localStorage
  localStorage.setItem('gymChoice', selectedGym);
  localStorage.setItem('gymType', gymType);
  localStorage.setItem('extras', extrasList);
  localStorage.setItem('monthlyPrice', price);
  localStorage.setItem('joiningFee', joiningFees[selectedGym]);
  
    // Save new invoice data
  saveInvoiceData();

  // Go to confirmation page
  window.location.href = '/confirm';
}

// Run first calculation after DOM loads
document.addEventListener('DOMContentLoaded', calculate);

