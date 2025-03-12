let theme = localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
const change_theme = () => {
  theme = (theme=="dark"?"light":"dark");
  document.documentElement.setAttribute("data-theme",theme);
}
