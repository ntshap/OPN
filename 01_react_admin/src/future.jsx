import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "./routes"

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true, // Mengaktifkan React.startTransition lebih awal
    v7_relativeSplatPath: true, // Menyesuaikan perubahan path relatif di v7
  },
})

function App() {
  return <RouterProvider router={router} />
}

export default App

