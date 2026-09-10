import axios from "axios";

export const notifySlack = async (
  webhookUrl: string,
  message: string,
): Promise<boolean> => {
  if (!webhookUrl) return false;

  try {
    await axios.post(webhookUrl, {
      text: message,
    });
    return true;
  } catch (err) {
    console.error("Error sending Slack notification:", err);
    return false;
  }
};
