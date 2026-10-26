import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API = "https://campustracks.onrender.com/api/v1";

export const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const showError = (err: unknown) => {
    const message =
      axios.isAxiosError(err) && err.response?.data?.error
        ? err.response.data.error
        : "Something went wrong. Try again.";
    toast({ title: "Error", description: message, variant: "destructive" });
  };


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, { email });
      toast({
        title: "Check your email",
        description: "If this email is registered, an OTP has been sent.",
      });
      setStep(2);
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API}/verify-otp`, { email, otp });
      setResetToken(data.resetToken);
      toast({ title: "OTP verified", description: "Now set your new password." });
      setStep(3);
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API}/reset-password`, { email, resetToken, newPassword });
      toast({
        title: "Success",
        description: "Password changed successfully. Please log in.",
      });
      navigate("/"); 
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-2xl font-bold mb-2">Forgot password</h1>

      {step === 1 && (
        <>
          <p className="text-muted-foreground mb-4">
            Enter your registered email and we will send you an OTP.
          </p>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-muted-foreground mb-4">
            Enter the 6-digit OTP sent to <b>{email}</b>.
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOtp("");
                setStep(1);
              }}
            >
              Change email / Resend OTP
            </Button>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-muted-foreground mb-4">Set your new password.</p>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              type="password"
              placeholder="New password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Change password"}
            </Button>
          </form>
        </>
      )}

      <Link
        to="/"
        className="block text-center text-sm text-primary hover:underline mt-4"
      >
        Back to home
      </Link>
    </div>
  );
};