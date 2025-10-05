// js/app.js

// --- Utilities ---
const $ = (sel)=> document.querySelector(sel);
const $$ = (sel)=> Array.from(document.querySelectorAll(sel));
const currency = (n)=> (isNaN(n)?0:n).toLocaleString(undefined,{style:'currency',currency:'USD'});

const RULE = { needs: 0.50, wants: 0.30, savings: 0.20 };

const KEYWORDS = {
  needs: [
    "rent","mortgage","utility","electric","water","coned","con ed","national grid",
    "grocery","trader joe","aldi","whole foods","market","supermarket",
    "mta","metrocard","uber","lyft","gas","fuel","insurance","copay","pharmacy","cvS","walgreens"
  ],
  wants: [
    "restaurant","cafe","coffee","starbucks","dunkin","pizza","chipotle","takeout",
    "netflix","spotify","hulu","disney","prime video","amc","movie","game","concert",
    "sephora","ulta","nike","adidas","target","amazon","fashion","clothes","electronics"
  ],
  savings: [
    "transfer to savings","deposit to savings","stash","acorns","roth","brokerage","vanguard","fidelity"
  ]
};

function autoCategorize(desc){
  const d = (desc||"").toLowerCase();
  for (const k of KEYWORDS.savings) if (d.includes(k)) return "savings";
  for (const k of KEYWORDS.needs)   if (d.includes(k)) return "needs";
  for (const k of KEYWORDS.wants)   if (d.includes(k)) return "wants";
  // Heuristics: groceries, rent & transit count as needs; restaurants default wants
  if (d.includes("grocery") || d.includes("rent") || d.includes("metro") || d.includes("bus")) return "needs";
  if (d.includes("restaurant") || d.includes("bar")) return "wants";
  return "wants"; // Default bias to wants if unknown
}

function computeBuckets(transactions){
  const sums = { needs:0, wants:0, savings:0, total:0 };
  for (const t of transactions){
    sums.total += t.amount;
    sums[t.category] += t.amount;
  }
  return sums;
}

function makeTip(profile, buckets){
  const income = profile.income || 0;
  const targets = {
    needs: income * RULE.needs,
    wants: income * RULE.wants,
    savings: income * RULE.savings,
  };

  // Simple nudges
  const gaps = {
    needs: buckets.needs - targets.needs,
    wants: buckets.wants - targets.wants,
    savings: targets.savings - buckets.savings,
  };

  if (gaps.savings > 0 && gaps.savings < 20)
    return `Try saving ${currency(Math.min(5, Math.ceil(gaps.savings)))} more this week to stay on track.`;

  if (gaps.wants > 0)
    return `You're over your wants target by ${currency(gaps.wants)}. Consider one at-home meal or skipping a subscription.`;

  if (gaps.needs > 0)
    return `Needs spending is high by ${currency(gaps.needs)}. Look for small wins: reduce utilities by turning off idle devices.`;

  return `Nice! You're tracking within the 50–30–20 targets. Consider a ${currency(10)} automatic transfer to savings.`;
}

// --- State ---
let profile = STORAGE.getProfile();
if (!profile) {
  // no profile, bounce back
  if (window.location.pathname.endsWith("dashboard.html")) {
    window.location.replace("index.html");
  }
}

let transactions = STORAGE.getTransactions();

// --- UI Bindings ---
const helloEl = $("#hello");
const goalLineEl = $("#goalLine");
const incomeValueEl = $("#incomeValue");
const rentValueEl = $("#rentValue");
const mtdSpendEl = $("#mtdSpend");

const needsBar = $("#needsBar");
const wantsBar = $("#wantsBar");
const savingsBar = $("#savingsBar");

const needsAmounts = $("#needsAmounts");
const wantsAmounts = $("#wantsAmounts");
const savingsAmounts = $("#savingsAmounts");

const tipEl = $("#tip");
const txBody = $("#txBody");

const fetchBtn = $("#fetchBtn");
const seedBtn = $("#seedBtn");
const addTxForm = $("#addTxForm");
const resetBtn = $("#resetBtn");

// --- Rendering ---
function renderHeader(){
  helloEl.textContent = `Hi, ${profile.name}!`;
  const goalText = {
    save: "Goal: Build savings.",
    learn: "Goal: Understand money better.",
    debt: "Goal: Pay down debt.",
  }[profile.goal] || "Goal: Build savings.";
  goalLineEl.textContent = goalText;

  incomeValueEl.textContent = currency(profile.income);
  rentValueEl.textContent = profile.rent != null ? currency(profile.rent) : "—";
}

function renderTable(){
  txBody.innerHTML = "";
  for (let i=0; i<transactions.length; i++){
    const t = transactions[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td class="right">${currency(t.amount)}</td>
      <td>${t.category}</td>
      <td><button data-i="${i}" class="deleteBtn">Delete</button></td>
    `;
    txBody.appendChild(tr);
  }

  // Bind delete buttons
  $$("#txBody .deleteBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = Number(btn.dataset.i);
      transactions.splice(idx,1);
      STORAGE.saveTransactions(transactions);
      updateAll();
    });
  });
}

function renderBarsAndStats(){
  // Month-to-date spend
  const monthPrefix = new Date().toISOString().slice(0,7); // "YYYY-MM"
  const mtd = transactions.filter(t => (t.date||"").startsWith(monthPrefix));
  const mtdTotal = mtd.reduce((s,t)=>s+t.amount,0);
  mtdSpendEl.textContent = currency(mtdTotal);

  const buckets = computeBuckets(mtd);
  const income = profile.income || 0;
  const targets = {
    needs: income * RULE.needs,
    wants: income * RULE.wants,
    savings: income * RULE.savings
  };

  needsAmounts.textContent = `${currency(buckets.needs)} / ${currency(targets.needs)}`;
  wantsAmounts.textContent = `${currency(buckets.wants)} / ${currency(targets.wants)}`;
  savingsAmounts.textContent = `${currency(buckets.savings)} / ${currency(targets.savings)}`;

  // % fills, capped at 100
  const pc = (val, target)=> target>0 ? Math.min(100, Math.round((val/target)*100)) : 0;
  needsBar.style.width = pc(buckets.needs, targets.needs) + "%";
  wantsBar.style.width = pc(buckets.wants, targets.wants) + "%";
  savingsBar.style.width = pc(buckets.savings, targets.savings) + "%";

  tipEl.textContent = makeTip(profile, buckets);
}

function updateAll(){
  renderTable();
  renderBarsAndStats();
}

// --- Event handlers ---
if (fetchBtn){
  fetchBtn.addEventListener("click", async ()=>{
    fetchBtn.disabled = true; fetchBtn.textContent = "Fetching…";
    const res = await NessieAPI.fetchPurchases(profile.nestAccountId);
    if (res.ok && res.data.length){
      // merge + categorize
      const normalized = res.data.map(t => ({
        ...t,
        category: autoCategorize(t.description)
      }));
      transactions = [...transactions, ...normalized];
      STORAGE.saveTransactions(transactions);
      updateAll();
      fetchBtn.textContent = "Fetched ✓";
    } else {
      alert(res.reason || "No data from Nessie. Try adding transactions manually or seed sample data.");
      fetchBtn.textContent = "Fetch from Nessie";
    }
    fetchBtn.disabled = false;
  });
}

if (seedBtn){
  seedBtn.addEventListener("click", ()=>{
    const seeded = NessieAPI.sampleSeed().map(t=> ({...t, category: autoCategorize(t.description)}));
    transactions = [...transactions, ...seeded];
    STORAGE.saveTransactions(transactions);
    updateAll();
  });
}

if (addTxForm){
  addTxForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const data = new FormData(addTxForm);
    const date = data.get("date");
    const description = (data.get("description")||"").trim();
    const amount = Number(data.get("amount")||0);
    const override = data.get("overrideCategory") || "";

    if (!date || !description || !amount){
      alert("Please fill all fields.");
      return;
    }

    const category = override || autoCategorize(description);
    transactions.push({ date, description, amount, category, source:"manual" });
    STORAGE.saveTransactions(transactions);
    addTxForm.reset();
    updateAll();
  });
}

if (resetBtn){
  resetBtn.addEventListener("click", ()=>{
    if (confirm("Reset your Limoneta profile and transactions?")){
      STORAGE.clearProfile();
      STORAGE.clearTransactions();
      window.location.replace("index.html");
    }
  });
}

// --- Init ---
if (window.location.pathname.endsWith("dashboard.html")){
  renderHeader();
  // Backfill categories for any uncategorized items
  transactions = transactions.map(t => ({ ...t, category: t.category || autoCategorize(t.description) }));
  STORAGE.saveTransactions(transactions);
  updateAll();
}
