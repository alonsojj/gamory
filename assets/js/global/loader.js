export function hideAllLoader() {
  const mainOverlay = document.getElementsByClassName("loader-overlay");
  if (mainOverlay)
    for (const element of mainOverlay) {
      element.classList.add("fade-out");
      setTimeout(() => {
        element.classList.remove("fade-out");
        element.classList.remove("loader-overlay");
      }, 500);
    }
}
export function hideLoader(element) {
  element.classList.add("fade-out");
  setTimeout(() => {
    element.classList.remove("fade-out");
    element.classList.remove("loader-overlay");
  }, 300);
}
export function showLoader(element) {
  element.classList.remove("loader-overlay");
}
