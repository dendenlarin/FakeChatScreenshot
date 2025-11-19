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
import { Download, Plus, Trash2, Sparkles } from "lucide-react";

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
    <div className="relative">
      {/* Art Deco Pattern Overlay */}
      <div className="art-deco-pattern" />

      <div className="min-h-screen bg-background text-foreground px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Elegant Header */}
          <div className="text-center mb-16 animate-page-reveal">
            <div className="inline-block mb-4">
              <Sparkles className="w-8 h-8 text-brass mx-auto animate-gentle-float" strokeWidth={1.5} />
            </div>
            <h1
              className="text-6xl md:text-7xl font-bold mb-4 text-gradient-burgundy tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Atelier de Conversation
            </h1>
            <p
              className="text-xl text-warm-gray italic mb-6"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Craft Authentic Chat Narratives
            </p>
            <div className="ornamental-divider max-w-md mx-auto">
              <span className="w-2 h-2 rounded-full bg-brass animate-gentle-pulse"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Editor Panel */}
            <div className="space-y-8 animate-slide-left delay-100">
              <Card className="elevated-card art-deco-border corner-decoration rounded-lg overflow-hidden">
                <CardHeader className="border-b border-light-gray pb-4">
                  <CardTitle
                    className="text-2xl text-burgundy flex items-center gap-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <div className="w-1 h-6 bg-brass"></div>
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label htmlFor="messenger" className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block">
                      Messenger
                    </Label>
                    <Select
                      value={messenger}
                      onValueChange={(value) =>
                        setMessenger(value as MessengerType)
                      }
                    >
                      <SelectTrigger id="messenger" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="viber">Viber</SelectItem>
                        <SelectItem value="vk">VK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contactName" className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block">
                      Contact Name
                    </Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactAvatar" className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block">
                      Avatar URL <span className="text-xs normal-case">(optional)</span>
                    </Label>
                    <Input
                      id="contactAvatar"
                      value={contactAvatar}
                      onChange={(e) => setContactAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="messageCount" className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block">
                      Message Count
                    </Label>
                    <Input
                      id="messageCount"
                      type="number"
                      min="1"
                      value={messageCount}
                      onChange={handleMessageCountChange}
                      className="mt-1"
                    />
                    <p className="text-xs text-warm-gray mt-2 italic" style={{ fontFamily: 'var(--font-accent)' }}>
                      {Math.ceil(messageCount / MAX_MESSAGES_PER_SCREEN)} screenshot{Math.ceil(messageCount / MAX_MESSAGES_PER_SCREEN) !== 1 ? 's' : ''} will be generated
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevated-card art-deco-border corner-decoration rounded-lg overflow-hidden">
                <CardHeader className="border-b border-light-gray pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="text-2xl text-burgundy flex items-center gap-3"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <div className="w-1 h-6 bg-brass"></div>
                      Messages
                    </CardTitle>
                    <Button
                      onClick={addMessage}
                      size="sm"
                      variant="outline"
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-warm-cream transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 max-h-[600px] overflow-y-auto custom-scrollbar pt-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className="paper-texture border border-light-gray rounded-md p-5 space-y-4 transition-all duration-300 hover:shadow-medium"
                    >
                      <div className="flex items-center justify-between border-b border-light-gray pb-3">
                        <Label className="font-semibold text-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
                          Message #{index + 1}
                        </Label>
                        <Button
                          onClick={() => removeMessage(message.id)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Remove message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <Label
                          htmlFor={`sender-${message.id}`}
                          className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block"
                        >
                          Sender
                        </Label>
                        <Select
                          value={message.sender}
                          onValueChange={(value) =>
                            handleMessageChange(message.id, "sender", value)
                          }
                        >
                          <SelectTrigger
                            id={`sender-${message.id}`}
                            className="mt-1"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">You</SelectItem>
                            <SelectItem value="contact">Contact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`text-${message.id}`} className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block">
                          Message Text
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
                          placeholder="Enter message text..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`timestamp-${message.id}`}
                          className="text-sm font-semibold uppercase tracking-wide text-warm-gray mb-2 block"
                        >
                          Time <span className="text-xs normal-case">(optional)</span>
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
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button
                onClick={exportToImage}
                className="w-full bg-gradient-to-r from-burgundy to-burgundy-dark hover:from-burgundy-dark hover:to-burgundy text-warm-cream font-bold py-6 transition-all duration-300 shadow-medium hover:shadow-elevated text-lg"
                size="lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Download className="w-5 h-5 mr-3" />
                Save Images
              </Button>
            </div>

            {/* Preview Panel */}
            <div className="lg:sticky lg:top-6 lg:self-start animate-slide-right delay-200">
              <Card className="elevated-card art-deco-border corner-decoration rounded-lg overflow-hidden">
                <CardHeader className="border-b border-light-gray pb-4">
                  <CardTitle
                    className="text-2xl text-burgundy flex items-center gap-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <div className="w-1 h-6 bg-brass"></div>
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center p-8 bg-soft-ivory">
                  <div
                    ref={chatRef}
                    className="relative transition-all duration-300 hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(43, 40, 38, 0.15))'
                    }}
                  >
                    {renderChat()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
