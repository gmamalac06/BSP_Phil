import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Eye, Users, Award, TrendingUp } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-chart-3/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">ScoutSmart</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empowering the Boy Scouts of the Philippines with modern management solutions
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => setLocation("/login")}>
              Sign In
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setLocation("/register")}>
              Register
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              ScoutSmart is a comprehensive management system designed specifically for the Boy Scouts of the Philippines.
              We provide modern tools to streamline scout registration, activity tracking, and organizational management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Scout Management</CardTitle>
                <CardDescription>
                  Efficiently manage scout registrations, profiles, and membership tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Activity Tracking</CardTitle>
                <CardDescription>
                  Organize events, track attendance, and monitor scout participation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive reports and insights for better decision making
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-10 w-10 text-primary" />
                  <CardTitle className="text-3xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To provide the Boy Scouts of the Philippines with an innovative, user-friendly platform
                  that simplifies administrative tasks, enhances communication, and enables leaders to focus
                  on what matters most—developing the character and skills of young scouts.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Streamline scout registration and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Improve communication between scouts, leaders, and parents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Enable data-driven decision making through analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-10 w-10 text-primary" />
                  <CardTitle className="text-3xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the leading management platform for scouting organizations across the Philippines,
                  fostering a digitally-empowered scouting movement that efficiently serves its members while
                  preserving the timeless values and traditions of scouting.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Nationwide adoption across all BSP councils</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Continuous innovation in scout management technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">Support the growth and development of Filipino youth</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join us in modernizing scout management for the digital age
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => setLocation("/login")}>
              Sign In to ScoutSmart
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/register")}>
              Create an Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-background border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ScoutSmart. Boy Scouts of the Philippines Management System.</p>
        </div>
      </footer>
    </div>
  );
}


