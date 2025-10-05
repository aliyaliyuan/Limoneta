
const form = document.getElementById("signupForm");
if (!form) {
  // Not on index.html
} else {
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const profile = {
      name: (data.get("name") || "").trim(),
      income: Number(data.get("income") || 0),
      rent: data.get("rent") ? Number(data.get("rent")) : null,
      goal: data.get("goal") || "save",
      nestAccountId: (data.get("accountId") || "").trim() || null,
      createdAt: new Date().toISOString(),
    };
    STORAGE.saveProfile(profile);
    // Keep any existing transactions; if none, start fresh
    if (!STORAGE.getTransactions().length) STORAGE.saveTransactions([]);
    window.location.href = "dashboard.html";
  });
}
