function notifikasiSederhana() {
  const title = "Soccer News";
  const opt = {
    tag: "welcome",
    body:
      "Hey, welcome to Soccer News App! You can find everything you want about football in here.",
    icon: "clipart-ball-logo.png",
    badge: "clipart-ball-logo.png",
    requireInteraction: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "yes-welcome",
        title: "Go!",
      },
    ],
  };
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready.then((registration) =>
      registration.showNotification(title, opt)
    );
  } else {
    console.log("notication not allowed");
  }
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const subscribe = async () => {
  try {
    const serverKey = "";
    const opt = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(serverKey),
    };
    const reg = await navigator.serviceWorker.getRegistration();
    const subscribe = await reg.pushManager.subscribe(opt);
    console.log("endpoint subs: ", subscribe.endpoint);
    console.log(
      "p256dh subs: ",
      btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(subscribe.getKey("p256dh"))
        )
      )
    );
    console.log(
      "auth key subs: ",
      btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(subscribe.getKey("auth"))
        )
      )
    );
  } catch (error) {
    console.error("cannot subscribe: ", error.message);
  }
};

const requestPermission = async () => {
  if ("Notification" in window) {
    const result = await Notification.requestPermission();
    if (result === "denied") {
      console.log("Notification not allowed");
      return;
    } else if (result === "default") {
      console.log("the user closes the notification dialog box");
      return;
    }
    console.log("notification is allowed");
  }
  if ("PushManager" in window) {
    subscribe();
  }
};

export { requestPermission, notifikasiSederhana };
