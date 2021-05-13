const schedule = "https://myoukaarata.github.io/#todayCompetitions";
const home = "https://myoukaarata.github.io";

workbox.precaching.precacheAndRoute([
  { url: "/", revision: "11" },
  { url: "/bundle.js", revision: "11" },
  { url: "/manifest.json", revision: "1" },
  { url: "/sw.js", revision: "3" },
  { url: "/clipart-ball-logo.png", revision: "1" },
  { url: "/assets/img/hero1.jpg", revision: "1" },
  { url: "/assets/img/hero2.jpg", revision: "1" },
  { url: "/assets/img/hero3.jpg", revision: "1" },
  { url: "/assets/img/hero4.jpg", revision: "1" },
  { url: "/assets/components/teamDetails.html", revision: "1" },
  { url: "/assets/components/playerMatches.html", revision: "1" },
  { url: "/assets/components/scheduleTeams.html", revision: "1" },
  { url: "/assets/components/specificPlayer.html", revision: "1" },
  { url: "/assets/components/nav.html", revision: "1" },
  { url: "/assets/components/home.html", revision: "1" },
  { url: "/assets/components/saved.html", revision: "1" },
  { url: "/assets/components/leagueStandings.html", revision: "1" },
  {
    url: "/assets/components/todayCompetitions.html",
    revision: "1",
  },
  {
    url: "/assets/components/bestCompetitionsScore.html",
    revision: "1",
  },
  { url: "/assets/icons/icon-72x72.png", revision: "1" },
  { url: "/assets/icons/icon-96x96.png", revision: "1" },
  { url: "/assets/icons/icon-128x128.png", revision: "1" },
  { url: "/assets/icons/icon-144x144.png", revision: "1" },
  { url: "/assets/icons/icon-152x152.png", revision: "1" },
  { url: "/assets/icons/icon-192x192.png", revision: "1" },
  { url: "/assets/icons/icon-384x384.png", revision: "1" },
  { url: "/assets/icons/icon-512x512.png", revision: "1" },
  {
    url: "https://fonts.googleapis.com/icon?family=Material+Icons",
    revision: "1",
  },
  {
    url:
      "https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    revision: "1",
  },
]);

workbox.routing.registerRoute(
  /https:\/\/api\.football-data\.org\/v2/,
  new workbox.strategies.NetworkFirst({
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 10,
      }),
    ]
  })
);

workbox.routing.registerRoute(
  /https:\/\/upload\.wikimedia\.org\/wikipedia/,
  new workbox.strategies.NetworkFirst({
    cacheName: "soccer_image",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 3 * 30 * 34 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Let's, check out today's match!";
  }
  let options = {
    body: body,
    icon: "clipart-ball-logo.png",
    badge: "clipart-ball-logo.png",
    vibrate: [100, 50, 100],
    requireInteraction: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "yes-schedule-action",
        title: "Go!",
      },
    ],
  };
  event.waitUntil(
    self.registration.showNotification("Today Schedule", options)
  );
});

self.addEventListener("notificationclick", async (e) => {
  switch (e.action) {
    case "yes-schedule-action":
      clients.openWindow(schedule);
      break;
    case "yes-welcome":
      clients.openWindow(home);
      break;
    default:
      break;
  }
});

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    skipWaiting();
  }
});
