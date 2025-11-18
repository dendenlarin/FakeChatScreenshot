import { ChatConfig, Message } from "@/types";

interface TemplateStyles {
  backgroundColor: string;
  headerBg: string;
  userMsgBg: string;
  contactMsgBg: string;
  textColor: string;
  inputBg: string;
  iconColor: string;
}

const messengerStyles: Record<string, TemplateStyles> = {
  telegram: {
    backgroundColor: "#0F1419",
    headerBg: "#212121",
    userMsgBg: "#8774E1",
    contactMsgBg: "#212121",
    textColor: "#FFFFFF",
    inputBg: "#181818",
    iconColor: "#8774E1",
  },
  whatsapp: {
    backgroundColor: "#0B141A",
    headerBg: "#202C33",
    userMsgBg: "#005C4B",
    contactMsgBg: "#202C33",
    textColor: "#FFFFFF",
    inputBg: "#202C33",
    iconColor: "#00A884",
  },
  viber: {
    backgroundColor: "#5B4B8D",
    headerBg: "#7360A5",
    userMsgBg: "#7360A5",
    contactMsgBg: "#FFFFFF",
    textColor: "#FFFFFF",
    inputBg: "#5B4B8D",
    iconColor: "#7360A5",
  },
  vk: {
    backgroundColor: "#FFFFFF",
    headerBg: "#5181B8",
    userMsgBg: "#5181B8",
    contactMsgBg: "#E5EAF0",
    textColor: "#000000",
    inputBg: "#F0F2F5",
    iconColor: "#5181B8",
  },
};

function generateMessageHTML(
  message: Message,
  isUser: boolean,
  styles: TemplateStyles
): string {
  const alignment = isUser ? "flex-end" : "flex-start";
  const bgColor = isUser ? styles.userMsgBg : styles.contactMsgBg;
  const textColor = isUser || styles.textColor === "#FFFFFF" ? "#FFFFFF" : "#000000";
  const borderRadius = isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px";

  return `
    <div style="display: flex; justify-content: ${alignment}; margin-bottom: 8px;">
      <div style="
        max-width: 70%;
        background-color: ${bgColor};
        color: ${textColor};
        border-radius: ${borderRadius};
        padding: 8px 12px;
      ">
        <div style="font-size: 14px; white-space: pre-wrap; word-wrap: break-word;">
          ${message.text}
        </div>
        ${
          message.timestamp
            ? `<div style="font-size: 10px; margin-top: 4px; opacity: 0.7;">
                ${message.timestamp}
              </div>`
            : ""
        }
      </div>
    </div>
  `;
}

export function generateChatHTML(config: ChatConfig): string {
  const styles = messengerStyles[config.messenger] || messengerStyles.telegram;
  const { contactName, contactAvatar, messages } = config;

  const messagesHTML = messages
    .map((msg) => generateMessageHTML(msg, msg.sender === "user", styles))
    .join("");

  const avatarHTML = contactAvatar
    ? `<img src="${contactAvatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`
    : `<div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 18px;
      ">
        ${contactName.charAt(0).toUpperCase()}
      </div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  <div style="
    width: 390px;
    height: 620px;
    background-color: ${styles.backgroundColor};
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  ">
    <!-- Status Bar -->
    <div style="
      height: 44px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      color: white;
      font-size: 14px;
    ">
      <div>9:41</div>
      <div style="display: flex; gap: 4px; align-items: center;">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0H3.5C4.32843 0 5 0.671573 5 1.5V10.5C5 11.3284 4.32843 12 3.5 12H1.5C0.671573 12 0 11.3284 0 10.5V1.5Z"/>
          <path d="M6 3C6 2.17157 6.67157 1.5 7.5 1.5H9.5C10.3284 1.5 11 2.17157 11 3V10.5C11 11.3284 10.3284 12 9.5 12H7.5C6.67157 12 6 11.3284 6 10.5V3Z"/>
          <path d="M12.5 4C11.6716 4 11 4.67157 11 5.5V10.5C11 11.3284 11.6716 12 12.5 12H14.5C15.3284 12 16 11.3284 16 10.5V5.5C16 4.67157 15.3284 4 14.5 4H12.5Z"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
          <path d="M0.5 5.5L4.5 1.5L8.5 5.5M12.5 5.5L8.5 1.5M8.5 1.5V10.5"/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="white">
          <rect x="0" y="0" width="22" height="12" rx="2.5" stroke="white" fill="none"/>
          <rect x="23" y="4" width="1" height="4" fill="white"/>
        </svg>
      </div>
    </div>

    <!-- Header -->
    <div style="
      background-color: ${styles.headerBg};
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    ">
      ${avatarHTML}
      <div style="flex: 1;">
        <div style="color: white; font-weight: 500; font-size: 16px;">
          ${contactName}
        </div>
        <div style="color: rgba(255,255,255,0.6); font-size: 12px;">
          online
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div style="
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background-color: ${styles.backgroundColor};
    ">
      ${messagesHTML}
    </div>

    <!-- Input Area -->
    <div style="
      background-color: ${styles.headerBg};
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    ">
      <div style="
        flex: 1;
        background-color: ${styles.inputBg};
        border-radius: 20px;
        padding: 8px 16px;
        color: rgba(255,255,255,0.5);
        font-size: 14px;
      ">
        Message
      </div>
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: ${styles.iconColor};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
