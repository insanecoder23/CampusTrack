import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface AttendanceRecord {
  date: string; // ISO string or YYYY-MM-DD
  status: "Present" | "Absent";
}

export const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch logged-in student's attendance history from backend
  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://campustracks.onrender.com/api/v1/getattendance", {
        withCredentials: true,
      });

      if (response.data?.success && response.data?.data) {
        // Map backend response into standard date-status structure
        const records = response.data.data.map((item: any) => ({
          date: item.createdAt || item.date,
          status: item.status || "Present",
        }));
        setAttendanceRecords(records);
        console.log(records)
      }
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    // Listen for instant updates when attendance is marked in StudentDashboard
    const handleAttendanceMarked = (event: any) => {
      if (event.detail?.date) {
        setAttendanceRecords((prev) => [
          ...prev,
          { date: event.detail.date, status: "Present" },
        ]);
      } else {
        fetchAttendance(); // Re-fetch from server if no payload detail
      }
    };

    window.addEventListener("attendance-marked", handleAttendanceMarked);
    return () => window.removeEventListener("attendance-marked", handleAttendanceMarked);
  }, []);

  // Calendar Helper Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Utility to check if a specific calendar date is marked present in API data
  const isPresentDate = (day: number): boolean => {
    const cellDateStr = new Date(year, month, day).toDateString();
    return attendanceRecords.some((record) => {
      const recDate = new Date(record.date);
      return recDate.toDateString() === cellDateStr && record.status === "Present";
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Attendance Calendar
        </CardTitle>
        <CardDescription>
          Green cells indicate days you were Present; Red indicates Absent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs mb-2 text-muted-foreground">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty padded cells for days before start of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10 rounded-md bg-muted/20" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const cellDate = new Date(year, month, dayNum);
            cellDate.setHours(0, 0, 0, 0);

            const isPastOrToday = cellDate <= today;
            const isPresent = isPresentDate(dayNum);

            // Coloring logic:
            // - If Future Date -> Gray / Disabled
            // - If Present in API -> Green
            // - If Past/Today & Not Present -> Red
            let bgClass = "bg-muted/30 text-muted-foreground"; // Default future
            if (isPastOrToday) {
              if (isPresent) {
                bgClass = "bg-emerald-500 text-white font-bold shadow-sm"; // Present
              } else {
                bgClass = "bg-rose-400 text-white font-medium"; 
              }
            }

            return (
              <div
                key={dayNum}
                className={`h-10 flex items-center justify-center rounded-md text-sm transition-colors ${bgClass}`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted/40" />
            <span>Future / No Class</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};