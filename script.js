// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (optional)
const btn = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;

const saved = localStorage.getItem("theme");
if (saved === "dark") root.classList.add("dark");

btn?.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
});
