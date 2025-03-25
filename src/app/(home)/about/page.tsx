"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="container p-4 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">About LLMTrust</h1>
          <p className="text-xl text-muted-foreground">
            Your AI Model Intelligence Platform - Reviews, Integration, and Discovery
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                LLMTrust is dedicated to bridging the gap between AI models and applications. We provide a comprehensive platform where developers and organizations can discover, evaluate, and integrate AI models through real user experiences and technical documentation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Verified reviews for AI models and applications</li>
                <li>• Technical integration documentation and API access</li>
                <li>• Performance metrics and pricing comparisons</li>
                <li>• Showcase of AI applications using various models</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Explore & Compare</h3>
                <p className="text-muted-foreground">
                  Browse our comprehensive directory of AI models and applications. Compare features, pricing, and real user experiences to make informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Test & Integrate</h3>
                <p className="text-muted-foreground">
                  Access detailed API documentation and testing environments. Try out models before implementation and seamlessly integrate them into your applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Review & Connect</h3>
                <p className="text-muted-foreground">
                  Share your experiences with models and applications. Help others make better decisions and stay updated with the latest AI developments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our AI Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with AI developers, review models you've used, discover new applications, and contribute to building a more transparent AI ecosystem. Your experience matters in helping others make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
