// js/nessie.js
// 1) Copy js/config.sample.js to js/config.js and fill values.
// 2) If config.js is missing or fetch fails/returns empty, we fall back to sample data.

let NESSIE = {
  hasConfig: false,
  apiKey: null,
  accountId: null,
};

(async function tryLoadConfig(){
  try {
    const mod = await import('./config.js'); // dynamic so app still runs if missing
    if (mod && mod.default) {
      NESSIE.apiKey = mod.default.API_KEY;
      NESSIE.accountId = mod.default.ACCOUNT_ID || null;
      NESSIE.hasConfig = !!NESSIE.apiKey;
    }
  } catch(e) {
    // config.js not present; proceed without it
  }
})();

const NessieAPI = {
  async fetchPurchases(accountIdFromProfile){
    const accountId = accountIdFromProfile || NESSIE.accountId;
    const key = NESSIE.apiKey;
    if (!key || !accountId) return { ok:false, data:[], reason:"Missing API key or Account ID" };

    // Example Nessie endpoint pattern (subject to change in their docs):
    // GET https://api.nessieisreal.com/accounts/{accountId}/purchases?key={API_KEY}
    const url = `http://api.nessieisreal.com/accounts/${encodeURIComponent(accountId)}/purchases?key=${encodeURIComponent(key)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return { ok:true, data:[], reason:"No purchases for this account." };
      }
      // Normalize to our shape
      const txs = data.map(p => ({
        date: (p.purchase_date || p.transaction_date || new Date().toISOString().slice(0,10)).slice(0,10),
        description: p.description || p.merchant || "Purchase",
        amount: Math.abs(Number(p.amount || p.purchase_amount || 0)),
        source: "nessie",
      }));
      return { ok:true, data:txs };
    } catch (err) {
      return { ok:false, data:[], reason:String(err) };
    }
  },

  sampleSeed(){
    const today = new Date();
    const iso = (d)=> d.toISOString().slice(0,10);
    return [
      { date: iso(today), description: "Rent payment", amount: 900.00, source:"sample" },
      { date: iso(today), description: "Grocery - Trader Joe's", amount: 64.22, source:"sample" },
      { date: iso(new Date(today - 86400000*2)), description: "MTA MetroCard", amount: 33.00, source:"sample" },
      { date: iso(new Date(today - 86400000*3)), description: "Restaurant - Pizza Night", amount: 22.50, source:"sample" },
      { date: iso(new Date(today - 86400000*4)), description: "Streaming Subscription", amount: 12.99, source:"sample" },
      { date: iso(new Date(today - 86400000*5)), description: "Transfer to Savings", amount: 50.00, source:"sample" },
    ];
  }
};
