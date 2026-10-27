import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  BarChart3, 
  FileText, 
  Users, 
  Clock,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react";
import { AttendanceCalendar } from "./AttendanceCalendar";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export const StudentDashboard = () => {
  // Dynamically retrieve stored roll number from localStorage
  const [studentRollNo, setStudentRollNo] = useState<string>("");

  useEffect(() => {
    let savedRollNo = localStorage.getItem("rollNo");
    if (!savedRollNo) {
      try {
        const userObj = JSON.parse(localStorage.getItem("user") || "{}");
        savedRollNo = userObj.rollNo || "IT2023123"; // Fallback to IT2023123 if not found
      } catch (e) {
        savedRollNo = "IT2023123";
      }
    }
    setStudentRollNo(savedRollNo);
  }, []);

  const [teacherCode, setTeacherCode] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [matcstudentcode, setmatchstudentcode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    subject: "",
    date: "",
    reason: "",
  });
  const { toast } = useToast();
  const expiryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attendanceData = {
    overall: 85,
    subjects: [
      { name: "Mathematics", attendance: 92, total: 25, present: 23 },
      { name: "Physics", attendance: 88, total: 22, present: 19 },
      { name: "Chemistry", attendance: 78, total: 20, present: 16 },
      { name: "Computer Science", attendance: 95, total: 18, present: 17 },
    ]
  };

  const facultyMembers = [
    {
      name: "Dr. Sarah Johnson",
      subject: "Mathematics",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@college.edu",
      image: "https://images.unsplash.com/photo-1494790108755-2616c25bb3c4?w=150"
    },
    {
      name: "Prof. Michael Chen",
      subject: "Physics", 
      phone: "+1 (555) 234-5678",
      email: "michael.chen@college.edu",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      name: "Dr. Emily Rodriguez",
      subject: "Chemistry",
      phone: "+1 (555) 345-6789", 
      email: "emily.rodriguez@college.edu",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    {
      name: "Prof. David Kumar",
      subject: "Computer Science",
      phone: "+1 (555) 456-7890",
      email: "david.kumar@college.edu", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  ];

  const handleTeacherCodeSubmit = async () => {
    setIsValidating(true);
    try {
      const response = await axios.post(
        "https://campustracks.onrender.com/api/v1verifyteachercode",
        { teacherCode },
        { withCredentials: true }
      );

      const studentcode = response.data?.data?.studentcode;
      setmatchstudentcode(studentcode);

      if (!response.data?.success || !studentcode) {
        toast({
          title: "Invalid Code",
          description: response.data?.message || "Please enter a valid 6-digit teacher code.",
          variant: "destructive",
        });
        return;
      }
     

      setGeneratedCode(studentcode);
      toast({
        title: "Code Validated!",
        description: `Your personal code: ${studentcode}. Enter it within 30 seconds.`,
      });

      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
      }
      expiryTimeoutRef.current = setTimeout(() => {
        setGeneratedCode("");
        toast({
          title: "Code Expired",
          description: "Please get a new code from your teacher.",
          variant: "destructive",
        });
      }, 30000);

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Please enter a valid 6-digit teacher code.";
      toast({
        title: "Invalid Code",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleStudentCodeSubmit = async () => {
    if (!studentCode) {
      toast({
        title: "Missing Code",
        description: "Please enter your personal code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const respons = await axios.post(
        "https://campustracks.onrender.com/api/v1/verifystudentcode",
        { studentcode: studentCode },
        { withCredentials: true }
      );

      if (!respons.data?.success) {
        toast({
          title: "Invalid Code",
          description: respons.data?.message || "Please enter the correct personal code.",
          variant: "destructive",
        });
        return;
      }

      setIsAttendanceMarked(true);
      toast({
        title: "Attendance Marked!",
        description: "Your attendance has been successfully recorded.",
      });

      // Notify the AttendanceCalendar component to update instantly
      window.dispatchEvent(
        new CustomEvent("attendance-marked", {
          detail: {
            status: "Present",
            date: respons.data?.data?.createdAt || new Date().toISOString(),
          },
        })
      );

      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
      }
      setTeacherCode("");
      setStudentCode("");
      setGeneratedCode("");
      setmatchstudentcode("");

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Could not verify code. Please try again.";
      toast({
        title: "Invalid Code",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Leave Application Submitted",
      description: "Your leave request has been sent for approval.",
    });
    setLeaveForm({ subject: "", date: "", reason: "" });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your attendance and academic activities {studentRollNo && `(Roll No: ${studentRollNo})`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6 text-primary" />
                Mark Your Attendance
              </CardTitle>
              <CardDescription>
                Enter teacher's code to get your personal attendance code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="teacher-code">Step 1: Enter Teacher's Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="teacher-code"
                    placeholder="6-digit teacher code"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="uppercase tracking-wider"
                  />
                  <Button
                    onClick={handleTeacherCodeSubmit}
                    disabled={teacherCode.length !== 6 || isValidating}
                  >
                    {isValidating ? "Validating..." : "Validate"}
                  </Button>
                </div>
              </div>

              {generatedCode && (
                <div className="space-y-3 p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">Your Personal Code: {generatedCode}</span>
                  </div>
                  <Label htmlFor="student-code">Step 2: Enter Your Personal Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="student-code"
                      placeholder="Enter your personal code"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="uppercase tracking-wider"
                    />
                    <Button onClick={handleStudentCodeSubmit} variant="success">
                      Mark Present
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {"Code expires in 30 seconds"}
                  </p>
                </div>
              )}

              {isAttendanceMarked && (
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">Attendance marked successfully!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-secondary" />
                Know Your Attendance
              </CardTitle>
              <CardDescription>
                View your attendance statistics and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">{attendanceData.overall}%</div>
                <div className="text-sm text-muted-foreground">Overall Attendance</div>
                <Progress value={attendanceData.overall} className="mt-3" />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Subject-wise Attendance</h4>
                {attendanceData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={subject.attendance >= 75 ? "default" : "destructive"}>
                          {subject.attendance}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {subject.present}/{subject.total}
                        </span>
                      </div>
                    </div>
                    <Progress value={subject.attendance} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-lg font-bold text-success">4</div>
                  <div className="text-xs text-muted-foreground">Good Standing</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-lg font-bold text-warning">0</div>
                  <div className="text-xs text-muted-foreground">Below 75%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Calendar */}
          <AttendanceCalendar />

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-warning" />
                Application for Leave
              </CardTitle>
              <CardDescription>
                Submit your leave requests for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Subject for which you need leave"
                    value={leaveForm.subject}
                    onChange={(e) => setLeaveForm({...leaveForm, subject: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={leaveForm.date}
                    onChange={(e) => setLeaveForm({...leaveForm, date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="warning">
                  Submit Leave Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Faculty Directory
            </CardTitle>
            <CardDescription>
              Contact information of faculty members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facultyMembers.map((faculty, index) => (
                <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={faculty.image} 
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{faculty.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{faculty.subject}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{faculty.phone}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{faculty.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};