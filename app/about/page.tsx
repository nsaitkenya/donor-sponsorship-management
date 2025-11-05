import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Award, Users, BookOpen, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="w-fit mx-auto">
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">About Starehe Boys Centre</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                For over six decades, we've been transforming lives through education, providing opportunities to
                talented young men from disadvantaged backgrounds.
              </p>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/historic-school-building-in-kenya.jpg"
                  alt="Starehe Boys Centre campus"
                  className="rounded-2xl shadow-xl"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-balance">Our Heritage</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 1959 by Geoffrey William Griffin, Starehe Boys Centre was established with a revolutionary
                  vision: to provide quality education to bright students regardless of their economic background.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What began as a small initiative has grown into one of Kenya's most prestigious educational
                  institutions, producing leaders in business, politics, academia, and various professional fields.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we continue this legacy by combining academic excellence with character development, ensuring
                  our students become not just successful professionals, but responsible citizens who give back to their
                  communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                  <CardDescription className="text-base leading-relaxed pt-4">
                    To provide holistic education to talented students from disadvantaged backgrounds, nurturing them
                    into responsible, self-reliant citizens who contribute positively to society through academic
                    excellence, character development, and community service.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Eye className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                  <CardDescription className="text-base leading-relaxed pt-4">
                    To be the leading institution in transforming lives through education, creating a generation of
                    ethical leaders who drive positive change in Kenya and beyond, breaking the cycle of poverty through
                    knowledge and opportunity.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Excellence</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We strive for the highest standards in academics, character, and service
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Compassion</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We care deeply for our students and their wellbeing, treating each as family
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Community</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We build strong bonds and encourage giving back to society
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Integrity</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We uphold honesty, transparency, and ethical conduct in all our dealings
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Discipline</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We instill self-control, responsibility, and commitment to goals
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Eye className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Innovation</CardTitle>
                  <CardDescription className="leading-relaxed">
                    We embrace new ideas and approaches to enhance learning and development
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Our Impact Over the Years</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Decades of transforming lives and building futures
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Alumni Worldwide</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">65+</div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">University Admission</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Scholarships Annually</div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Our Leadership</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Dedicated professionals committed to student success
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">Dr. David Kinyua</h3>
                      <p className="text-sm text-muted-foreground">Principal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">Mary Wanjiru</h3>
                      <p className="text-sm text-muted-foreground">Director of Finance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">James Omondi</h3>
                      <p className="text-sm text-muted-foreground">Head of Sponsorship</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
