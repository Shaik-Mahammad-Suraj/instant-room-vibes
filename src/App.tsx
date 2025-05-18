
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarWrapper } from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyRooms from "./pages/MyRooms";
import Explore from "./pages/Explore";
import Friends from "./pages/Friends";
import CreateRoom from "./pages/CreateRoom";
import RoomDetail from "./pages/RoomDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <SidebarWrapper>
              <Dashboard />
            </SidebarWrapper>
          } />
          <Route path="/my-rooms" element={
            <SidebarWrapper>
              <MyRooms />
            </SidebarWrapper>
          } />
          <Route path="/explore" element={
            <SidebarWrapper>
              <Explore />
            </SidebarWrapper>
          } />
          <Route path="/friends" element={
            <SidebarWrapper>
              <Friends />
            </SidebarWrapper>
          } />
          <Route path="/create-room" element={
            <SidebarWrapper>
              <CreateRoom />
            </SidebarWrapper>
          } />
          <Route path="/room/:id" element={
            <SidebarWrapper>
              <RoomDetail />
            </SidebarWrapper>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
