import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Play, Users, Shield, Clock, TrendingUp } from "lucide-react";
import heroImage from "@/assets/Rcciit.jpeg.jpg";
import videoThumbnail from "@/assets/attendance-video-thumbnail.jpg";
import img from "@/assets/hero-education.jpg"
import imge from "@/assets/Rcciit.jpeg.jpg"

export const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Real-time Attendance",
      description: "Mark attendance instantly with time-limited codes for enhanced security"
    },
    {
      icon: Shield,
      title: "Anti-Proxy System",
      description: "Advanced security measures prevent fake attendance and proxy marking"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Comprehensive attendance analytics with beautiful charts and insights"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Automated scheduling and leave management for better organization"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
    
      <section className="relative overflow-hidden bg-gradient-hero py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
           
            <div className="space-y-8 text-white">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Automated Student
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Attendance System
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Transform college's attendance management with intelligent, 
                  secure, and user-friendly system. Real-time tracking, advanced analytics, 
                  and anti-proxy technology for modern educational institutions.
                </p>
              </div>
            </div>

           
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-large ">
                <img 
                  src={imge} 
                  alt="Modern classroom with students using technology"
                  className="w-[200vw] h-[500px] object-fit"
                />
                
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-large">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - About */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  About AttendancePro
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    AttendancePro is a cutting-edge automated attendance monitoring system 
                    designed specifically for colleges and universities. Our platform combines 
                    advanced technology with intuitive design to create a seamless experience 
                    for both students and faculty.
                  </p>
                  <p>
                    With features like time-limited security codes, comprehensive analytics, 
                    and anti-proxy measures, we ensure accurate attendance tracking while 
                    maintaining the highest security standards.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden shadow-large">
                <div className="relative">
                  <img 
                    src={videoThumbnail}
                    alt="Educational video about attendance system"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button variant="secondary" size="lg" className="gap-2 shadow-glow">
                      <Play className="h-6 w-6" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">How AttendancePro Works</CardTitle>
                  <CardDescription>
                    Learn how our automated attendance system revolutionizes 
                    classroom management with this comprehensive overview.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Stats Badge */}
              <div className="absolute -top-4 -left-4 bg-gradient-secondary text-white rounded-xl p-4 shadow-large">
                <div className="text-center">
                  <div className="text-2xl font-bold">5 min</div>
                  <div className="text-xs opacity-90">Setup Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
