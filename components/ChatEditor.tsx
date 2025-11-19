"use client";

import { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { MessengerType, Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramChat } from "@/components/messenger-themes/TelegramChat";
import { WhatsAppChat } from "@/components/messenger-themes/WhatsAppChat";
import { ViberChat } from "@/components/messenger-themes/ViberChat";
import { VKChat } from "@/components/messenger-themes/VKChat";
import * as htmlToImage from "html-to-image";
import { Download, Plus, Trash2, Zap } from "lucide-react";

const MAX_MESSAGES_PER_SCREEN = 10;

const THEME_VARS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];

const oklchToRgbString = (value: string) => {
  const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (!match) return null;
  const [, lRaw, cRaw, hRaw] = match;
  const L = parseFloat(lRaw);
  const C = parseFloat(cRaw);
  const H = (parseFloat(hRaw) * Math.PI) / 180;

  const a = Math.cos(H) * C;
  const b = Math.sin(H) * C;

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bChannel = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  r = clamp(r);
  g = clamp(g);
  bChannel = clamp(bChannel);

  const to255 = (x: number) => Math.round(x * 255);
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(bChannel)})`;
};

const applyLegacyColorsForExport = () => {
  const root = document.documentElement;
  const prevInline: Record<string, string> = {};

  THEME_VARS.forEach((name) => {
    prevInline[name] = root.style.getPropertyValue(name);
    const computed = getComputedStyle(root).getPropertyValue(name).trim();
    if (computed.toLowerCase().startsWith("oklch")) {
      const rgb = oklchToRgbString(computed);
      if (rgb) {
        root.style.setProperty(name, rgb);
      }
    }
  });

  return () => {
    THEME_VARS.forEach((name) => {
      if (prevInline[name]) {
        root.style.setProperty(name, prevInline[name]);
      } else {
        root.style.removeProperty(name);
      }
    });
  };
};

export function ChatEditor() {
  const [messenger, setMessenger] = useState<MessengerType>("telegram");
  const [contactName, setContactName] = useState("John Doe");
  const [contactAvatar, setContactAvatar] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Привет! Как дела?",
      sender: "contact",
      timestamp: "12:30",
    },
    { id: "2", text: "Отлично, спасибо!", sender: "user", timestamp: "12:31" },
  ]);
  const [messageCount, setMessageCount] = useState(2);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleMessageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setMessageCount(count);

    if (count > messages.length) {
      const newMessages = [...messages];
      for (let i = messages.length; i < count; i++) {
        newMessages.push({
          id: `${i + 1}`,
          text: "",
          sender: i % 2 === 0 ? "contact" : "user",
          timestamp: "12:00",
        });
      }
      setMessages(newMessages);
    } else if (count < messages.length) {
      setMessages(messages.slice(0, count));
    }
  };

  const handleMessageChange = (
    id: string,
    field: keyof Message,
    value: string,
  ) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, [field]: value } : msg)),
    );
  };

  const addMessage = () => {
    const newId = `${messages.length + 1}`;
    setMessages([
      ...messages,
      {
        id: newId,
        text: "",
        sender: messages.length % 2 === 0 ? "contact" : "user",
        timestamp: "12:00",
      },
    ]);
    setMessageCount(messages.length + 1);
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    setMessageCount(messages.length - 1);
  };

  const exportToImage = async () => {
    if (!chatRef.current) return;

    const restoreColors = applyLegacyColorsForExport();

    const screensCount = Math.ceil(messages.length / MAX_MESSAGES_PER_SCREEN);

    try {
      for (let i = 0; i < screensCount; i++) {
        const start = i * MAX_MESSAGES_PER_SCREEN;
        const end = Math.min(start + MAX_MESSAGES_PER_SCREEN, messages.length);
        const screenMessages = messages.slice(start, end);

        // Render a hidden clone so the visible preview remains untouched
        const container = document.createElement("div");
        const previewNode = chatRef.current;
        const width = previewNode?.offsetWidth ?? undefined;

        container.style.position = "fixed";
        container.style.left = "0";
        container.style.top = "0";
        container.style.opacity = "0";
        container.style.pointerEvents = "none";
        container.style.zIndex = "-1";
        if (width) container.style.width = `${width}px`;
        document.body.appendChild(container);

        const root = createRoot(container);
        root.render(renderChat(screenMessages));

        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

        const target = (container.firstElementChild ?? container) as HTMLElement;

        const dataUrl = await htmlToImage.toPng(target, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "transparent",
          style: {
            transform: "none",
          },
        });

        const link = document.createElement("a");
        link.download = `${messenger}-chat-${i + 1}.png`;
        link.href = dataUrl;
        link.click();

        root.unmount();
        container.remove();
      }
    } finally {
      restoreColors();
    }
  };

  const renderChat = (useMessages?: Message[]) => {
    const props = { contactName, contactAvatar, messages: useMessages ?? messages };

    switch (messenger) {
      case "telegram":
        return <TelegramChat {...props} />;
      case "whatsapp":
        return <WhatsAppChat {...props} />;
      case "viber":
        return <ViberChat {...props} />;
      case "vk":
        return <VKChat {...props} />;
      default:
        return <TelegramChat {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Cyberpunk Header */}
        <div className="mb-12 animate-slide-down">
          <div className="inline-block relative">
            <h1
              className="text-6xl md:text-7xl font-black text-neon-green uppercase tracking-wider animate-neon-pulse scanlines"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              &gt; CHAT_FORGE
            </h1>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-70"></div>
          </div>
          <div className="inline-block ml-6 mt-4">
            <p
              className="text-base font-semibold text-electric-blue tracking-widest"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              [ GENERATE • CUSTOMIZE • EXPORT ]
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6 animate-slide-left delay-50">
            <Card className="glass-card cyber-border-thick rounded-lg overflow-hidden">
              <CardHeader className="bg-cyber-gray cyber-border-pink border-b relative">
                <div className="absolute top-0 left-0 w-full h-0.5 holographic"></div>
                <CardTitle
                  className="text-xl text-neon-pink uppercase flex items-center gap-3 tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <Zap className="w-6 h-6" />
                  {`// CONFIG_PARAMS`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <Label htmlFor="messenger" className="label-terminal mb-2">
                    &gt; MESSENGER_TYPE
                  </Label>
                  <Select
                    value={messenger}
                    onValueChange={(value) =>
                      setMessenger(value as MessengerType)
                    }
                  >
                    <SelectTrigger id="messenger" className="mt-2 cyber-border bg-cyber-dark text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-cyber-dark border-neon-green">
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="viber">Viber</SelectItem>
                      <SelectItem value="vk">VK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contactName" className="label-terminal mb-2">
                    &gt; CONTACT_NAME
                  </Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-2 cyber-border bg-cyber-dark text-text-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="contactAvatar" className="label-terminal mb-2">
                    &gt; AVATAR_URL
                  </Label>
                  <Input
                    id="contactAvatar"
                    value={contactAvatar}
                    onChange={(e) => setContactAvatar(e.target.value)}
                    placeholder="https://..."
                    className="mt-2 cyber-border bg-cyber-dark text-text-primary placeholder:text-text-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="messageCount" className="label-terminal mb-2">
                    &gt; MESSAGE_COUNT
                  </Label>
                  <Input
                    id="messageCount"
                    type="number"
                    min="1"
                    value={messageCount}
                    onChange={handleMessageCountChange}
                    className="mt-2 cyber-border bg-cyber-dark text-text-primary"
                  />
                  <p className="text-xs mt-2 font-mono text-electric-blue">
                    {`// OUTPUT: ${Math.ceil(messageCount / MAX_MESSAGES_PER_SCREEN)} SCREENSHOT(S)`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card cyber-border-thick rounded-lg overflow-hidden">
              <CardHeader className="bg-cyber-gray cyber-border-blue border-b relative">
                <div className="absolute top-0 left-0 w-full h-0.5 holographic"></div>
                <div className="flex items-center justify-between">
                  <CardTitle
                    className="text-xl text-electric-blue uppercase flex items-center gap-3 tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {`// MSG_EDITOR`}
                  </CardTitle>
                  <Button
                    onClick={addMessage}
                    size="sm"
                    className="btn-cyber bg-cyber-dark text-neon-green hover:bg-cyber-gray-light border-neon-green"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    ADD
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pt-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="cyber-border bg-cyber-dark p-4 space-y-3 rounded-md transition-all hover:neon-glow-green"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-neon-green/30">
                      <Label className="font-bold uppercase text-amber tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                        [MSG_{String(index + 1).padStart(2, '0')}]
                      </Label>
                      <Button
                        onClick={() => removeMessage(message.id)}
                        size="sm"
                        variant="ghost"
                        className="text-neon-pink hover:bg-neon-pink/20 hover:text-neon-pink"
                        aria-label="Remove message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Label
                        htmlFor={`sender-${message.id}`}
                        className="label-terminal mb-2"
                      >
                        &gt; SENDER
                      </Label>
                      <Select
                        value={message.sender}
                        onValueChange={(value) =>
                          handleMessageChange(message.id, "sender", value)
                        }
                      >
                        <SelectTrigger
                          id={`sender-${message.id}`}
                          className="mt-2 cyber-border bg-cyber-gray text-text-primary"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cyber-dark border-neon-green">
                          <SelectItem value="user">YOU</SelectItem>
                          <SelectItem value="contact">CONTACT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`text-${message.id}`} className="label-terminal mb-2">
                        &gt; TEXT
                      </Label>
                      <Textarea
                        id={`text-${message.id}`}
                        value={message.text}
                        onChange={(e) =>
                          handleMessageChange(
                            message.id,
                            "text",
                            e.target.value,
                          )
                        }
                        placeholder="Type message..."
                        className="mt-2 cyber-border bg-cyber-gray text-text-primary placeholder:text-text-muted"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`timestamp-${message.id}`}
                        className="label-terminal mb-2"
                      >
                        &gt; TIME
                      </Label>
                      <Input
                        id={`timestamp-${message.id}`}
                        value={message.timestamp || ""}
                        onChange={(e) =>
                          handleMessageChange(
                            message.id,
                            "timestamp",
                            e.target.value,
                          )
                        }
                        placeholder="12:00"
                        className="mt-2 cyber-border bg-cyber-gray text-text-primary placeholder:text-text-muted"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button
              onClick={exportToImage}
              className="w-full btn-cyber bg-neon-green text-cyber-black hover:bg-neon-green/90 py-7 text-lg uppercase font-black tracking-wider neon-glow-green"
              size="lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Download className="w-6 h-6 mr-3" />
              &gt;&gt; EXPORT_NOW
            </Button>
          </div>

          {/* Preview Panel - neutral styling */}
          <div className="lg:sticky lg:top-8 lg:self-start animate-slide-right delay-100">
            <Card className="border-2 border-gray-700 rounded-lg shadow-2xl bg-gray-900 overflow-hidden">
              <CardHeader className="bg-gray-800 border-b border-gray-700">
                <CardTitle
                  className="text-lg text-gray-300 uppercase tracking-wide font-semibold"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {`// PREVIEW`}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center p-8 bg-gray-900">
                <div
                  ref={chatRef}
                  className="relative animate-pop delay-150"
                >
                  {renderChat()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
