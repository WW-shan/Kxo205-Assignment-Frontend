document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  // 如果页面没有该按钮，直接返回（避免在没有按钮的页面报错）
  if (!themeToggle) return;

  // 给按钮添加简洁的自定义类（样式在 css 中定义）
  themeToggle.classList.add("theme-toggle-btn");

  const icon = themeToggle.querySelector("i");

  const updateIcon = (theme) => {
    if (!icon) return;
    icon.classList.toggle("bi-sun-fill", theme === "dark");
    icon.classList.toggle("bi-moon-fill", theme !== "dark");
  };

  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.remove("dark-mode");
  }

  updateIcon(currentTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark-mode");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  });
});
