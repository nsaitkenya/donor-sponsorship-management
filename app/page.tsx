import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Heart, Users, GraduationCap, TrendingUp, Target, Award, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  Transforming Lives Since 1959
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                  Empowering Young Men Through Education
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Join us in supporting talented students from disadvantaged backgrounds to achieve their dreams. Your
                  contribution creates lasting impact in their lives and communities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/auth/sign-up">
                      Start Donating <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/students">Sponsor a Student</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img src="/diverse-group-of-students-in-school-uniforms-study.jpg" alt="Starehe students" className="rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">1,200+</div>
                <div className="text-sm text-muted-foreground">Students Supported</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">850+</div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Graduation Rate</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">KES 45M</div>
                <div className="text-sm text-muted-foreground">Raised This Year</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">How Your Support Makes a Difference</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Every contribution directly impacts a student's journey from enrollment to graduation
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle>Choose Your Impact</CardTitle>
                  <CardDescription>
                    Select from one-time donations, recurring support, or direct student sponsorship
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Connect & Track</CardTitle>
                  <CardDescription>
                    Get matched with students and receive regular progress updates on their academic journey
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle>See Results</CardTitle>
                  <CardDescription>
                    Watch your sponsored students graduate and become leaders in their communities
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Where Your Donations Go</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Transparent allocation of funds to maximize student success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Education</CardTitle>
                  <CardDescription>Tuition, books, and learning materials</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">45%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Accommodation</CardTitle>
                  <CardDescription>Housing, meals, and daily necessities</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">30%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Development</CardTitle>
                  <CardDescription>Sports, arts, and leadership programs</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">15%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Operations</CardTitle>
                  <CardDescription>Infrastructure and administration</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">10%</div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-12">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Change a Life?</h2>
                  <p className="text-lg text-primary-foreground/90 text-pretty">
                    Join hundreds of donors who are making education accessible to talented students. Start your journey
                    today and witness the transformation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/auth/sign-up">
                        Become a Donor <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      asChild
                    >
                      <Link href="/about">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
