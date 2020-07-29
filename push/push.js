const webPush = require("/usr/lib/node_modules/web-push");
//endpoint,p256dh,dan auth bisa dilihat di console
const endpoint = "";
const p256dh = "";
const auth = "";

// isi dengan generate vapid keys
const publicKey = "";
const privateKey = "";

const vapidKeys = {
  publicKey,
  privateKey,
};

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubs = {
  endpoint,
  keys: {
    p256dh,
    auth,
  },
};

const payload = "Let's, check out today's match!";

const opt = {
  gcmAPIKey: "",
  TTL: 60,
};

webPush.sendNotification(pushSubs, payload, opt);
