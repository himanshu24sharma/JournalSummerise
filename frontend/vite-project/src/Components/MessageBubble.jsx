import React from "react";
import { Card, Avatar } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function MessagePair({ userMessage, botMessage, timestamp }) {
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : "";

  return (
    <div className="flex flex-col gap-3 my-4">
      <Card size="small">
        <Meta
          avatar={
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
          }
          title={<span style={{ color: "blue" }}>You</span>}
          description={<p className="text-gray-800 mt-1">{userMessage}</p>}
        />
        {formattedTime && (
          <p className="text-xs text-gray-400 text-right mt-1">
            {formattedTime}
          </p>
        )}
      </Card>

      <Card
        className="self-start bg-gray-50 border border-gray-200 shadow-sm max-w-[75%]"
        size="small"
      >
        <Meta
          avatar={
            <Avatar
              icon={<RobotOutlined />}
              style={{ backgroundColor: "#52c41a" }}
            />
          }
          title={<span style={{ color: "green" }}>Bot </span>}
          description={<p className="text-gray-800 mt-1">{botMessage}</p>}
        />
        {formattedTime && (
          <p className="text-xs text-gray-400 text-right mt-1">
            {formattedTime}
          </p>
        )}
      </Card>
    </div>
  );
}
