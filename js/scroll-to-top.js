/**
 * @file scroll-to-top.js
 * @description Adds a scroll-to-top button to the website.
 * @author Shengyi Shi, Yuming Deng, Mingxuan Xu, Yanzhang Lu
 */

// Scroll to top button functionality
document.addEventListener("DOMContentLoaded", function () {
  // Create scroll to top button
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scrollTopBtn";
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up-circle-fill"></i>';
  scrollTopBtn.setAttribute("aria-label", "Scroll to top");
  scrollTopBtn.title = "Scroll to top";
  document.body.appendChild(scrollTopBtn);

  // Listen for scroll events
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  // Click button to scroll to top
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
