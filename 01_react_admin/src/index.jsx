import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { ConfigProvider } from "./contexts/ConfigContext"
import config from "./config/constant"
import { initializeLocalStorage } from "./utils/mockData"

// Initialize localStorage with mock data
initializeLocalStorage()

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider value={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)

reportWebVitals()

