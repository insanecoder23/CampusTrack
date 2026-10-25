import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Edit3,
  QrCode,
  Clock,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TeacherDashboardProps {
  user?: {
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    type: 'student' | 'teacher';
  };
}

interface AttendanceRecord {
  _id: string;
  branch: string;
  createdAt: string;
  rollNo: string;
  status: string;
  student: string;
  studentFirstName: string;
  studentLastName: string;
  teacher: string;
  teacherFirstName: string;
  teacherLastName: string;
}

export const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
  const [headcount, setHeadcount] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeExpiry, setCodeExpiry] = useState<Date | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  
  const [detailes, setdetailes] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");

  const { toast } = useToast();

  const classes = ["IT-A 3rd Year", "IT-B 3rd Year", "IT-A 4th Year", "IT-B 4th Year"];

  const subjectsByYear: Record<string, string[]> = {
    "3rd": ["Software Engineering", "Object-Oriented Programming", "Operating Systems", "Computer Networks"],
    "4th": ["Machine Learning", "Cloud Computing", "Cybersecurity", "Data Analytics"]
  };

  const getSubjectsForClass = (className: string): string[] => {
    if (className.includes("3rd")) return subjectsByYear["3rd"];
    if (className.includes("4th")) return subjectsByYear["4th"];
    return [];
  };

  const studentDataByClass: Record<string, any[]> = {
    "IT-A 3rd Year": [
      {
        id: "IT2023077",
        name: "ZUBAIR NASIM",
        collegeRoll: "IT2023077",
        universityRoll: "11700223126",
        email: "it2023077@rcciit.org.in",
        phone: "+91 8240400772",
        overall: 92,
        subjectwise: 95,
        status: "excellent"
      }
    ],
    "IT-B 3rd Year": [
      {
        id: "IT2023123",
        name: "MD FAIZAN",
        collegeRoll: "IT2023123",
        universityRoll: "11700223045",
        email: "it2023123@rcciit.org.in",
        phone: "+91 8240400772",
        overall: 78,
        subjectwise: 82,
        status: "good"
      }
    ],
    "IT-A 4th Year": [
      {
        id: "CS004",
        name: "David Wilson",
        collegeRoll: "21CS004",
        universityRoll: "210004",
        email: "david.wilson@student.edu",
        phone: "+1 (555) 004-0004",
        overall: 88,
        subjectwise: 90,
        status: "good"
      }
    ],
    "IT-B 4th Year": [
      {
        id: "CS005",
        name: "Eva Brown",
        collegeRoll: "21CS005",
        universityRoll: "210005",
        email: "eva.brown@student.edu",
        phone: "+1 (555) 005-0005",
        overall: 72,
        subjectwise: 69,
        status: "warning"
      }
    ]
  };

  const generateTeacherCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/createteachercode",
        { headcount },
        { withCredentials: true }
      );
      const teachercode = response.data.data.teachercode;
      console.log(response);

      const expiresAt = new Date(Date.now() + 20 * 1000);

      setGeneratedCode(teachercode);
      setCodeExpiry(expiresAt);

      toast({
        title: "Code Generated!",
        description: `Teacher code: ${teachercode}`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const getdetailes = async function () {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/getattendance", {
        withCredentials: true,
      });
      setdetailes(response.data?.data || []);
      console.log(response);
    } catch (error) {
      console.log("failed to fetch the data", error);
    }
  };

  // --- DERIVED LIVE SEARCH RESULTS (No 3rd useState or handler function required) ---
  const query = search.trim().toLowerCase();

  const searchResults = query
    ? detailes.filter((record) => {
        const fullName = `${record.studentFirstName || ""} ${record.studentLastName || ""}`.toLowerCase();
        return (
          record.rollNo?.toLowerCase().includes(query) ||
          fullName.includes(query) ||
          record.studentFirstName?.toLowerCase().includes(query) ||
          record.studentLastName?.toLowerCase().includes(query)
        );
      })
    : null; // null when the search bar is empty

  useEffect(() => {
    getdetailes();

    if (!codeExpiry) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, codeExpiry.getTime() - now.getTime());
      setTimeRemaining(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        setGeneratedCode("");
        setCodeExpiry(null);
        clearInterval(timer);
        toast({
          title: "Code Expired",
          description: "Generate a new code for the next attendance session.",
          variant: "destructive",
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [codeExpiry, toast]);

  const handleEditAttendance = (studentId: string) => {
    setEditingAttendance(editingAttendance === studentId ? null : studentId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "absent": return "bg-red-100 text-red-800 border-red-200";
      case "excellent": return "bg-green-100 text-green-800 border-green-200";
      case "good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "absent": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "excellent": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good": return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const studentData = selectedClass ? studentDataByClass[selectedClass] || [] : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.firstname} {user?.lastname}!
          </h1>
          <p className="text-muted-foreground">
            {user?.email} · Manage attendance and monitor student progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6 text-primary" />
                Take Attendance
              </CardTitle>
              <CardDescription>Generate attendance codes for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headcount">Number of Students Present</Label>
                <Input
                  id="headcount"
                  type="number"
                  placeholder="Enter headcount"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                  min="1"
                />
              </div>

              <Button
                onClick={generateTeacherCode}
                className="w-full"
                disabled={!headcount || !!generatedCode}
              >
                {generatedCode ? "Code Active" : "Generate Code"}
              </Button>

              {generatedCode && (
                <div className="p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                  <div className="text-center space-y-3">
                    <div className="text-2xl font-bold text-primary tracking-wider">
                      {generatedCode}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expires in {timeRemaining} seconds</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled={!generatedCode}>
                  Refresh Code
                </Button>
                <Button variant="outline" className="flex-1" disabled={!generatedCode}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Attendance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- Student Search Card (Optimized with 2 States) --- */}
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6 text-primary" />
                Search Student Attendance
              </CardTitle>
              <CardDescription>Type a roll number or name to see attendance instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter Roll No or Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Show error ONLY when user typed something and search returned 0 matches */}
              {searchResults !== null && searchResults.length === 0 && (
                <p className="text-sm text-red-600">No attendance found for this student.</p>
              )}

              {/* Display matching results when present */}
              {searchResults && searchResults.length > 0 && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <p className="text-sm text-muted-foreground">
                    Showing {searchResults.length} record(s) for{" "}
                    <span className="font-semibold">
                      {searchResults[0].studentFirstName} {searchResults[0].studentLastName}
                    </span>{" "}
                    ({searchResults[0].rollNo})
                  </p>
                  {searchResults.map((record) => (
                    <div key={record._id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold">Date:</span> {formatDate(record.createdAt)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Branch: {record.branch} · Marked by: {record.teacherFirstName} {record.teacherLastName}
                        </p>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)} {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="space-y-2 flex-1">
            <Label>Select Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Select Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose subject" />
              </SelectTrigger>
              <SelectContent>
                {getSubjectsForClass(selectedClass).map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student Table */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Student Management
            </CardTitle>
            <CardDescription>View and manage student information and attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>College Roll</TableHead>
                  <TableHead>Overall %</TableHead>
                  <TableHead>Subject %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Select a class to view students
                    </TableCell>
                  </TableRow>
                ) : (
                  studentData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.collegeRoll}</TableCell>
                      <TableCell>{student.overall}%</TableCell>
                      <TableCell>{student.subjectwise}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusIcon(student.status)} {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAttendance(student.id)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          {editingAttendance === student.id ? 'Done' : 'Edit'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
 