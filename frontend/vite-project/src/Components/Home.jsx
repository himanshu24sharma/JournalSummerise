import React from "react";
import MessagePair from "./MessageBubble";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";

const sendMessage = async (text) => {
  const res = await fetch("http://localhost:8000/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "12345",
      message: text,
      response: "",
    }),
  });
  if (!res.ok) throw new Error("Failed to send");
  return res.json();
};

export default function Home() {
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      onMessageSent?.(data); // show reply in chat
      setMessage("");
      queryClient.invalidateQueries(["chats"]);
    },
  });
  const handleSend = () => {
    if (!message.trim()) return;
    mutation.mutate(message);
  };
  const {
    data: chatMessages,
    isLoading: isLoadingChatMessages,
    isError: isErrorChatMessages,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/chats?user_id=12345`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
  });

  return (
    <>
      <div
        style={{
          backgroundColor: "#0a0a0aff",
          borderRadius: "8px",
        }}
      >
        {isLoadingChatMessages && <p>Loading chat messages...</p>}

        {!isLoadingChatMessages && isErrorChatMessages && (
          <p style={{ color: "red" }}>Error loading chat messages.</p>
        )}

        {!isLoadingChatMessages && !isErrorChatMessages && (
          <div
            style={{ padding: "20px", maxHeight: "80vh", overflowY: "auto" }}
          >
            {!chatMessages || chatMessages.length === 0 ? (
              <p>No chat messages found.</p>
            ) : (
              chatMessages.map((chat, index) => (
                <MessagePair
                  key={index}
                  userMessage={chat.message}
                  botMessage={chat.response}
                  timestamp={chat.created_at}
                />
              ))
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                background: "#000",
                borderTop: "1px solid #222",
              }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  backgroundColor: "#111",
                  color: "#fff",
                  border: "1px solid #333",
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                style={{ backgroundColor: "#1677ff" }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
