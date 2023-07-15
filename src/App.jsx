import {io}  from 'socket.io-client';
import Messagepage  from './pages/messagingpage';
import LoginandSignup from './pages/loginandsignup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const socket = io.connect("http://localhost:3001")
console.log(socket.id)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginandSignup socket={socket}/>}/>
            <Route path='/messaging' element={<Messagepage socket={socket}/>}/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
