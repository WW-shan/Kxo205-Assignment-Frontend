/**
 * @file dark-mode.js
 * @description Toggles between light and dark mode for the website.
 * @author Shengyi Shi, Yuming Deng, Mingxuan Xu, Yanzhang Lu
 */

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  themeToggle.classList.add("theme-toggle-btn");

  const icon = themeToggle.querySelector("i");

  // Update icon based on theme
  const updateIcon = (theme) => {
    if (!icon) return;
    icon.classList.toggle("bi-sun-fill", theme === "dark");
    icon.classList.toggle("bi-moon-fill", theme !== "dark");
  };

  // Get theme from localStorage or system preference
  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  // Apply theme on load
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.remove("dark-mode");
  }

  updateIcon(currentTheme);

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark-mode");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  });
});
