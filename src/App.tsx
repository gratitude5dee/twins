
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateTwin from "./pages/CreateTwin";
import TwinChat from "./pages/TwinChat";
import TwinDetailsPage from "./pages/TwinDetailsPage";
import NotFound from "./pages/NotFound";

/**
 * App Component
 * 
 * IMPORTANT:
 * 1. For chat functionality to work, the Python backend server from the pipecat-ai
 *    repository (/server directory) must be running.
 * 2. Ensure your .env file has VITE_SERVER_URL=http://127.0.0.1:7860/api
 *    (or the appropriate URL for your server).
 * 3. Run the backend server with: `cd server && python sesame.py run`
 */

// We use a single QueryClient instance for the entire app
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-twin" 
                  element={
                    <ProtectedRoute>
                      <CreateTwin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/twin/:twinId" 
                  element={
                    <ProtectedRoute>
                      <TwinDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat/:twinId" 
                  element={
                    <ProtectedRoute>
                      <TwinChat />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
