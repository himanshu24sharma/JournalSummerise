import React from "react";
import MessagePair from "./MessageBubble";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
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

  console.log(chatMessages);

  return (
    <>
      {isLoadingChatMessages && <p>Loading chat messages...</p>}

      {!isLoadingChatMessages && isErrorChatMessages && (
        <p style={{ color: "red" }}>Error loading chat messages.</p>
      )}

      {!isLoadingChatMessages && !isErrorChatMessages && (
        <div>
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
        </div>
      )}
    </>
  );
}
