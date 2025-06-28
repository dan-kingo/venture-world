import fetch from "node-fetch";

export const sendExpoNotification = async (token: string, title: string, body: string) => {
  const message = {
    to: token,
    sound: "default",
    title,
    body,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    console.log("Expo notification response:", data);
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};
