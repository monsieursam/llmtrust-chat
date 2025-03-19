import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import fetchApi from "@/lib/fetch";
import { StarIcon, ShieldCheckIcon, TrendingUpIcon, MessageSquareIcon, BrainCircuitIcon, SearchIcon, RefreshCw } from "lucide-react";
import Link from "next/link";
import { LatestModelShowcase } from "./_components/latest-model-showcase";
// import Link from "next/link";
// import { HeroSearch } from "@/components/client/hero-search";
// import QuickStart from "@/components/client/quick-start";
// import { fetchLatestModels } from "@/actions/yoooo";
// import { LatestModelShowcase } from "@/components/servers/latest-model-showcase";

export default async function Home() {
  const data = await fetchApi('/api/models/latest');
  const latestModels = await data.json();

  return (
    <div className="min-h-screen flex-1">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 animate-fade-in motion-safe:animate-fade-in shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-default">
              Discover, Compare, and Integrate AI Models with Confidence
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Experience seamless AI model integration with enhanced control, better pricing, and trusted reviews.
            </p>
            {/* <HeroSearch /> */}
          </div>

          {/* Latest Model Showcase */}
          <LatestModelShowcase latestModels={latestModels} />

          {/* Trust Stats */}
          {/* <TrustStats /> */}
        </div>
      </section>

      {/* Rating Summary */}

      {/* Quick Integration Guide */}

      {/* <QuickStart /> */}

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheckIcon className="w-10 h-10" />,
                title: "Verified Reviews",
                description: "All reviews are from verified users",
              },
              // {
              //   icon: <TrendingUpIcon className="w-10 h-10" />,
              //   title: "Performance Metrics",
              //   description: "Detailed benchmarks and comparisons",
              // },
              {
                icon: <MessageSquareIcon className="w-10 h-10" />,
                title: "Active Community",
                description: "Join discussions with other developers",
              },
              {
                icon: <BrainCircuitIcon className="w-10 h-10" />,
                title: "Expert Insights",
                description: "In-depth analysis from AI experts",
              },
            ].map((feature) => (
              <Card key={feature.title} className="p-6 border-primary/20">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted border-t">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">About LLMTrust</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            LLMTrust is your trusted companion in navigating the evolving landscape of AI language models.
            We empower developers and organizations with comprehensive, unbiased reviews and detailed
            benchmarks to make informed decisions about AI models.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide transparent, reliable insights into AI models through verified user reviews,
                expert analysis, and detailed performance metrics.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Why Choose Us</h3>
              <p className="text-muted-foreground">
                We combine community experience with technical expertise to help you
                find the perfect AI model for your specific needs.
              </p>
            </div>
          </div>
          <Button size="lg" variant="default" className="mt-12" asChild>
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
