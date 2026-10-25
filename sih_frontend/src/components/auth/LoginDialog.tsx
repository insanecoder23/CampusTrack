import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'student' | 'teacher';
  onLogin: (credentials: { email: string; type: 'student' | 'teacher' }) => void;
}

export const LoginDialog = ({ isOpen, onClose, type, onLogin }: LoginDialogProps) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        {
          email: formData.email,
          password: formData.password,
          accounttype: type,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        console.error("No user in response:", data);
        throw new Error("User data missing from response. Check backend.");
      }

      onLogin({ email: formData.email, type });

      toast({ title: "Success", description: `Successfully logged in as ${type}` });

      onClose();
      setFormData({ email: "", password: "" });
    } catch (error: unknown) {
      console.log("FULL ERROR:", error);
      const description = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Invalid credentials. Please try again.";

      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // NEW: close the dialog and go to the Forgot Password page
  const handleForgotPassword = () => {
    onClose();
    navigate("/forgot-password");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'student' ? <GraduationCap className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-secondary" />}
            {type === 'student' ? 'Student Login' : 'Teacher Login'}
          </DialogTitle>
          <DialogDescription>Enter your {type} ID and password to access your dashboard</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${type === 'student' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              {type === 'student' ? <GraduationCap className="h-8 w-8 text-primary" /> : <User className="h-8 w-8 text-secondary" />}
            </div>
            <CardTitle className="text-lg">Welcome back, {type}!</CardTitle>
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{type === 'student' ? 'Student Email' : 'Teacher Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={type === 'student' ? 'Enter your student email' : 'Enter your teacher email'}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-md font-bold text-primary hover:underline "
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-4">
                <Button type="submit" className="w-full" variant={type === 'student' ? 'default' : 'secondary'} disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};