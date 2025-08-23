import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-muted border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">InvestorSafe AI</h3>
              <p className="text-muted-foreground text-sm">
                Supporting SEBI's Safe Space initiative through advanced AI-powered monitoring and analysis.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">SEBI Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Investor Education</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Report Fraud</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@investorsafe.ai</li>
                <li>Phone: +91-11-2345-6789</li>
                <li>Emergency: 1800-SEBI-HELP</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 InvestorSafe AI. Licensed under SEBI Guidelines. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;