let theme = localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
document.documentElement.setAttribute("data-theme",theme);
const change_theme = () => {
  theme = (theme=="dark"?"light":"dark");
  localStorage.setItem("theme",theme);
  document.documentElement.setAttribute("data-theme",theme);
}
