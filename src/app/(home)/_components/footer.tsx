"use client";

import Link from "next/link";
import { StarIcon } from "lucide-react";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="transition-colors hover:text-foreground/80 text-muted-foreground">
    {children}
  </Link>
);

export function Footer() {
  const mainLinks = [
    { href: "/models", label: "Models" },
    { href: "/aiapps", label: "AI Apps" },
    { href: "/docs", label: "Docs" },
    { href: "/chat", label: "Chat" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto px-4 py-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href='/'>
            <div className="flex items-center gap-2">

              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <StarIcon className="size-4" />
              </div>
              <span className="text-sm font-semibold">LLMTrust</span>
            </div>
          </Link>

          <nav className="flex flex-wrap gap-6 text-sm">
            {mainLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LLMTrust. All rights reserved.
            </div>
            <a 
              href="https://www.producthunt.com/posts/llmtrust?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-llmtrust" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=llmtrust&theme=light" 
                alt="LLMTrust - Product Hunt" 
                width="150" 
                height="30" 
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
