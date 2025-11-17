"use client";

import { useState, useRef } from "react";
import { MessengerType, Message, OSType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramChat } from "@/components/messenger-themes/TelegramChat";
import { WhatsAppChat } from "@/components/messenger-themes/WhatsAppChat";
import { ViberChat } from "@/components/messenger-themes/ViberChat";
import { VKChat } from "@/components/messenger-themes/VKChat";
import html2canvas from "html2canvas";
import { Download, Plus, Trash2 } from "lucide-react";

const MAX_MESSAGES_PER_SCREEN = 10;

export function ChatEditor() {
  const [messenger, setMessenger] = useState<MessengerType>("telegram");
  const [os, setOs] = useState<OSType>("ios");
  const [contactName, setContactName] = useState("John Doe");
  const [contactAvatar, setContactAvatar] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Привет! Как дела?", sender: "contact", timestamp: "12:30" },
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

  const handleMessageChange = (id: string, field: keyof Message, value: string) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const addMessage = () => {
    const newId = `${messages.length + 1}`;
    setMessages([...messages, {
      id: newId,
      text: "",
      sender: messages.length % 2 === 0 ? "contact" : "user",
      timestamp: "12:00",
    }]);
    setMessageCount(messages.length + 1);
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
    setMessageCount(messages.length - 1);
  };

  const exportToImage = async () => {
    if (!chatRef.current) return;

    const screensCount = Math.ceil(messages.length / MAX_MESSAGES_PER_SCREEN);

    for (let i = 0; i < screensCount; i++) {
      const start = i * MAX_MESSAGES_PER_SCREEN;
      const end = Math.min(start + MAX_MESSAGES_PER_SCREEN, messages.length);
      const screenMessages = messages.slice(start, end);

      // Temporarily set messages for this screen
      const originalMessages = [...messages];
      setMessages(screenMessages);

      // Wait for React to update
      await new Promise(resolve => setTimeout(resolve, 100));

      if (chatRef.current) {
        const canvas = await html2canvas(chatRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: false,
        });

        const link = document.createElement("a");
        link.download = `${messenger}-chat-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }

      // Restore original messages
      setMessages(originalMessages);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const renderChat = () => {
    const props = { contactName, contactAvatar, messages, os };

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
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Fake Chat Screenshot Generator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Создайте реалистичные скриншоты переписок мессенджеров
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки чата</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="os">Операционная система</Label>
                  <Select value={os} onValueChange={(value) => setOs(value as OSType)}>
                    <SelectTrigger id="os" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ios">iOS (iPhone)</SelectItem>
                      <SelectItem value="android">Android (Huawei)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="messenger">Мессенджер</Label>
                  <Select value={messenger} onValueChange={(value) => setMessenger(value as MessengerType)}>
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
                  <Label htmlFor="contactName">Имя собеседника</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactAvatar">URL аватарки (опционально)</Label>
                  <Input
                    id="contactAvatar"
                    value={contactAvatar}
                    onChange={(e) => setContactAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="messageCount">Количество сообщений</Label>
                  <Input
                    id="messageCount"
                    type="number"
                    min="1"
                    value={messageCount}
                    onChange={handleMessageCountChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.ceil(messageCount / MAX_MESSAGES_PER_SCREEN)} скриншот(ов) будет создано
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Сообщения</CardTitle>
                  <Button onClick={addMessage} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={message.id} className="border rounded-lg p-4 space-y-3 bg-card text-card-foreground">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Сообщение #{index + 1}</Label>
                      <Button
                        onClick={() => removeMessage(message.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor={`sender-${message.id}`} className="text-sm">Отправитель</Label>
                      <Select
                        value={message.sender}
                        onValueChange={(value) =>
                          handleMessageChange(message.id, "sender", value)
                        }
                      >
                        <SelectTrigger id={`sender-${message.id}`} className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Вы</SelectItem>
                          <SelectItem value="contact">Собеседник</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`text-${message.id}`} className="text-sm">Текст сообщения</Label>
                      <Textarea
                        id={`text-${message.id}`}
                        value={message.text}
                        onChange={(e) =>
                          handleMessageChange(message.id, "text", e.target.value)
                        }
                        placeholder="Введите текст сообщения..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`timestamp-${message.id}`} className="text-sm">Время (опционально)</Label>
                      <Input
                        id={`timestamp-${message.id}`}
                        value={message.timestamp || ""}
                        onChange={(e) =>
                          handleMessageChange(message.id, "timestamp", e.target.value)
                        }
                        placeholder="12:00"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={exportToImage} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Сохранить изображения
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Предпросмотр</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div ref={chatRef}>
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
