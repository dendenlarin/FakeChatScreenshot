export type MessengerType = "telegram" | "whatsapp" | "viber" | "vk";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp?: string;
}

export interface ChatConfig {
  messenger: MessengerType;
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export interface MessengerTheme {
  backgroundColor: string;
  headerColor: string;
  userMessageColor: string;
  contactMessageColor: string;
  userTextColor: string;
  contactTextColor: string;
  timestampColor: string;
}
