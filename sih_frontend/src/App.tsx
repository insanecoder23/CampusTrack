import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { Home } from "@/pages/Home";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { TeacherDashboard } from "@/pages/TeacherDashboard";
import { Contact } from "@/pages/Contact";
import { ForgotPassword } from "@/pages/ForgotPassword"; // NEW
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type Role = 'student' | 'teacher';

const App = () => {
  // restore the user after a page refresh
  const [user, setUser] = useState<{ name: string; type: Role } | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authDialog, setAuthDialog] = useState<{
    isOpen: boolean;
    type: Role | null;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    type: null,
    mode: 'login',
  });

  const handleLoginClick = (type: Role) => {
    setAuthDialog({ isOpen: true, type, mode: 'login' });
  };

  const handleRegisterClick = (type: Role) => {
    setAuthDialog({ isOpen: true, type, mode: 'register' });
  };

  // password removed: LoginDialog no longer sends it
  const handleLogin = (credentials: { email: string; type: Role }) => {
    setUser({ name: credentials.email, type: credentials.type });
    setAuthDialog({ isOpen: false, type: null, mode: 'login' });
  };

  const handleRegister = (data: { email: string; password: string; type: Role }) => {
    setUser({ name: data.email, type: data.type });
    setAuthDialog({ isOpen: false, type: null, mode: 'login' });
  };

  const handleClose = () => {
    setAuthDialog({ isOpen: false, type: null, mode: 'login' });
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // NEW: clear saved user
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
              user={user}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student" element={user?.type === 'student' ? <StudentDashboard /> : <Home />} />
              <Route path="/teacher" element={user?.type === 'teacher' ? <TeacherDashboard /> : <Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            {authDialog.type && authDialog.mode === 'login' && (
              <LoginDialog
                isOpen={authDialog.isOpen}
                onClose={handleClose}
                type={authDialog.type}
                onLogin={handleLogin}
              />
            )}

            {authDialog.type && authDialog.mode === 'register' && (
              <RegisterDialog
                isOpen={authDialog.isOpen}
                onClose={handleClose}
                type={authDialog.type}
                onRegister={handleRegister}
              />
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;