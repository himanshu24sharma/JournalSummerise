import { useState } from "react";
import "./App.css";
import Home from "./Components/Home";
import { ConfigProvider, theme } from "antd";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm, // 👈 enables dark mode
        }}
      >
        <Home />
      </ConfigProvider>
    </>
  );
}

export default App;
