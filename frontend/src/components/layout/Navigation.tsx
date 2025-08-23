import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  EyeIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: ShieldCheckIcon },
    { name: 'Suspicious Offers', href: '/suspicious-offers', icon: EyeIcon },
    { name: 'Social Media Monitor', href: '/social-monitor', icon: ChartBarIcon },
    { name: 'Corporate Announcements', href: '/announcements', icon: DocumentTextIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary shadow-header relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-header">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-8 w-8 text-primary-foreground" />
              <div className="text-primary-foreground">
                <span className="text-xl font-bold">InvestorSafe</span>
                <span className="text-lg font-light ml-1">AI</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-hover text-primary-foreground'
                      : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Login/Register buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Login
            </Button>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Register
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-foreground hover:text-primary-foreground/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-foreground"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary shadow-lg border-t border-primary-hover">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-primary-hover text-primary-foreground'
                      : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="px-3 py-2 space-y-2">
              <Button variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Login
              </Button>
              <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Register
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;