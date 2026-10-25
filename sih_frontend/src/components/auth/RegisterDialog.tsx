import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'student' | 'teacher';
  onRegister: (data: { email: string; password: string; type: 'student' | 'teacher' }) => void;
}

export const RegisterDialog = ({ isOpen, onClose, type, onRegister }: RegisterDialogProps) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    Branch: "",
    year: "",
    RollNo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||  
      !formData.Branch ||
      !formData.year ||
      (type === 'student' && !formData.RollNo) 
    ) {
      toast({ title: "Error", description: "Please fill in all fields ", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/signup",
        {
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          confirmPassword:formData.confirmPassword,
          accounttype: type,
          Branch: formData.Branch,
          Year: formData.year,
          RollNo: type === 'student' ? formData.RollNo : undefined,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message);
      }

      onRegister({ email: formData.email, password: formData.password, type });

      toast({ title: "Success", description: `Account created successfully as ${type}` });

      onClose();
      setFormData({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "", Branch: "", year: "", RollNo: "" });

    } catch (error: unknown) {
      console.log("FULL ERROR:", error);
      const description = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Registration failed. Please try again.";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'student' ? <GraduationCap className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-secondary" />}
            {type === 'student' ? 'Student Registration' : 'Teacher Registration'}
          </DialogTitle>
          <DialogDescription>Create an account to access your {type} dashboard</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${type === 'student' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              {type === 'student' ? <GraduationCap className="h-8 w-8 text-primary" /> : <User className="h-8 w-8 text-secondary" />}
            </div>
            <CardTitle className="text-lg">Create your {type} account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    value={formData.firstname}
                    onChange={(e) => handleChange('firstname', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastname}
                    onChange={(e) => handleChange('lastname', e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {type === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll No</Label>
                  <Input
                    id="rollNo"
                    type="text"
                    placeholder="e.g. 12021014"
                    value={formData.RollNo}
                    onChange={(e) => { handleChange('RollNo', e.target.value);
                    }}
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    type="text"
                    placeholder="IT,CS,ECE,EE,CE,MC,AIML"
                    value={formData.Branch}
                    onChange={(e) => handleChange('Branch', e.target.value)}
                    required
                  />
                </div>
            <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="text"
                    placeholder="e.g. 2nd Year"
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    required
                  />
                </div>
          
              </div>
            

              <div className="flex flex-col space-y-2 pt-4">
                <Button type="submit" className="w-full" variant={type === 'student' ? 'default' : 'secondary'} disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
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