
const STORAGE = {
  profileKey: "limoneta_profile",
  txKey: "limoneta_transactions",

  saveProfile(profile){ localStorage.setItem(this.profileKey, JSON.stringify(profile)); },
  getProfile(){ try { return JSON.parse(localStorage.getItem(this.profileKey) || "null"); } catch { return null; } },
  clearProfile(){ localStorage.removeItem(this.profileKey); },

  saveTransactions(txs){ localStorage.setItem(this.txKey, JSON.stringify(txs)); },
  getTransactions(){ try { return JSON.parse(localStorage.getItem(this.txKey) || "[]"); } catch { return []; } },
  clearTransactions(){ localStorage.removeItem(this.txKey); },
};
