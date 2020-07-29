import "regenerator-runtime";
import { Workbox } from "workbox-window";
import {
  requestPermission,
  notifikasiSederhana,
} from "./assets/js/register.js";
import { loadNav, loadPage } from "./assets/js/appShell.js";
import "./assets/css/style.css";
import "./assets/materialize/js/materialize.min.js";
const btnReload = document.querySelector("#btn-reload");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wb = new Workbox("/sw.js");
    wb.addEventListener("installed", () => {
      window.location.reload();
    });
    wb.addEventListener("waiting", () => {
      btnReload.classList.add("btn-reload-scale");
      document.querySelector("#reload").addEventListener("click", () => {
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });
        wb.messageSW({ type: "SKIP_WAITING" });
      });
    });
    wb.register();
    requestPermission();
    notifikasiSederhana();
  });
} else {
  console.log("service worker is not supported. please update your browser.");
}

document.addEventListener("DOMContentLoaded", function () {
  let sidenav = document.querySelector(".sidenav");
  M.Sidenav.init(sidenav);
  loadNav(sidenav);

  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  if (page.split("?id=")) page = page.split("?")[0];
  loadPage(page);
});
