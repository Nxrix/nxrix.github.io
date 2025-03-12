let theme = localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
document.documentElement.setAttribute("data-theme",theme);
document.querySelector('meta[name="theme-color"]').setAttribute("content",(theme?"#fff":"#000"));
const change_theme = () => {
  theme = (theme=="dark"?"light":"dark");
  localStorage.setItem("theme",theme);
  document.documentElement.setAttribute("data-theme",theme);
  document.querySelector('meta[name="theme-color"]').setAttribute("content",(theme?"#fff":"#000"));
}
