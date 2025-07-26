import { Twitter, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold">ResourceWise</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The intelligent platform for resource allocation and management.
            </p>
            <div className="mt-8 flex space-x-6">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Product</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Company</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Resources</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Legal</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} ResourceWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
