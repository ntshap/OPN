import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes"

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME || "/"}>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App

