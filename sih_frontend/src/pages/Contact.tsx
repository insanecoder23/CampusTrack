import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export const Contact = () => {
  const [submitQuery, setSubmitQuery] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSubmitQuery((prev) => ({
      ...prev,
      [id]: value
    }));
  };

 const addQuery = async () => {
   const { firstName, lastName, email, subject, message } = submitQuery;
   if (!firstName || !lastName || !email || !subject || !message) {
      setStatusMsg("Please fill in all fields.");
      return;
   }

   try {
      setLoading(true);
      setStatusMsg("");

const res = await axios.post("https://campustracks.onrender.com/api/v1/submitquery", submitQuery);
      setStatusMsg("Message sent successfully!");
      setSubmitQuery({
         firstName: "",
         lastName: "",
         email: "",
         subject: "",
         message: ""
      });
   } catch (err) {
      console.error(err);

      if (err.response) {
    
         setStatusMsg(err.response.data?.message || `Request failed with status ${err.response.status}`);
      } else if (err.request) {
         setStatusMsg("No response from server. Please check your connection.");
      } else {
         setStatusMsg("Something went wrong. Please try again.");
      }
   } finally {
      setLoading(false);
   }
};
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Your College</h1>
          <p className="text-xl text-muted-foreground">Get in touch with our support team</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={submitQuery.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={submitQuery.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@college.org"
                  value={submitQuery.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  value={submitQuery.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  rows={5}
                  value={submitQuery.message}
                  onChange={handleChange}
                />
              </div>

              {statusMsg && (
                <p className="text-sm text-muted-foreground">{statusMsg}</p>
              )}

              <Button
                onClick={addQuery}
                className="w-full"
                variant="hero"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">+91 62908 21297</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">support@rcciit.org.in</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-muted-foreground">Canal S Rd, Beleghata, Kolkata, West Bengal 700015</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Office Hours</div>
                    <div className="text-muted-foreground">Mon-Fri: 9:00 AM - 5:00 PM</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};