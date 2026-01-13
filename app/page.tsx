import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ImageCarousel } from "@/components/image-carousel"
import { AnnouncementCarousel } from "@/components/announcement-carousel"
import { FeaturedCampaign } from "@/components/featured-campaign"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Heart, Users, GraduationCap, TrendingUp, Target, Award, BookOpen } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createServerClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5)

  const featuredCampaign = campaigns?.[0]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {campaigns && campaigns.length > 0 && <AnnouncementCarousel campaigns={campaigns} />}

      {featuredCampaign && <FeaturedCampaign campaign={featuredCampaign} />}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="container relative z-10 px-4">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
                  Transforming Lives Since 1959
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent">
                  Empowering Young Men Through Education
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Join us in supporting talented students from disadvantaged backgrounds to achieve their dreams. Your
                  contribution creates lasting impact in their lives and communities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    <Link href="/auth/sign-up">
                      Start Donating <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  >
                    <Link href="/students">Sponsor a Student</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-96 md:h-[500px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 h-full">
                  <ImageCarousel />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  1,200+
                </div>
                <div className="text-sm text-muted-foreground">Students Supported</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  850+
                </div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">Graduation Rate</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  KES 45M
                </div>
                <div className="text-sm text-muted-foreground">Raised This Year</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                How Your Support Makes a Difference
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Every contribution directly impacts a student's journey from enrollment to graduation
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-primary">Choose Your Impact</CardTitle>
                  <CardDescription>
                    Select from one-time donations, recurring support, or direct student sponsorship
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-accent/20 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 text-accent mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-accent">Connect & Track</CardTitle>
                  <CardDescription>
                    Get matched with students and receive regular progress updates on their academic journey
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-4">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    See Results
                  </CardTitle>
                  <CardDescription>
                    Watch your sponsored students graduate and become leaders in their communities
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Where Your Donations Go
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Transparent allocation of funds to maximize student success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Education</CardTitle>
                  <CardDescription>Tuition, books, and learning materials</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">45%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
                <CardHeader>
                  <Target className="h-8 w-8 text-accent mb-2" />
                  <CardTitle className="text-xl">Accommodation</CardTitle>
                  <CardDescription>Housing, meals, and daily necessities</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-accent">30%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-xl">Development</CardTitle>
                  <CardDescription>Sports, arts, and leadership programs</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-primary">15%</div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-accent mb-2" />
                  <CardTitle className="text-xl">Operations</CardTitle>
                  <CardDescription>Infrastructure and administration</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-accent">10%</div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <Card className="bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground border-0 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Change a Life?</h2>
                  <p className="text-lg text-primary-foreground/90 text-pretty">
                    Join hundreds of donors who are making education accessible to talented students. Start your journey
                    today and witness the transformation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" variant="secondary" asChild className="shadow-lg">
                      <Link href="/auth/sign-up">
                        Become a Donor <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
