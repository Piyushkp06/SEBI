import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/ui/stat-card';
import Layout from '@/components/layout/Layout';
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      title: 'Suspicious Investment Scanner',
      description: 'Advanced AI analysis of investment offers and advisor legitimacy checks against SEBI registrations.',
      icon: EyeIcon,
      href: '/suspicious-offers',
      stats: '2,547 offers analyzed this month'
    },
    {
      title: 'Social Media Monitor',
      description: 'Real-time monitoring of stock manipulation attempts and pump-and-dump schemes across social platforms.',
      icon: ChartBarIcon,
      href: '/social-monitor',
      stats: '156 alerts generated today'
    },
    {
      title: 'Corporate Announcements',
      description: 'Verification of company announcements against historical filings with credibility scoring.',
      icon: DocumentTextIcon,
      href: '/announcements',
      stats: '89% accuracy rate'
    }
  ];

  const recentAlerts = [
    {
      type: 'High Risk',
      message: 'Unregistered advisor promoting guaranteed returns scheme',
      time: '2 hours ago'
    },
    {
      type: 'Medium Risk',
      message: 'Suspicious social media activity for TECHSTOCK',
      time: '4 hours ago'
    },
    {
      type: 'Low Risk',
      message: 'Corporate announcement credibility verified',
      time: '6 hours ago'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              InvestorSafe AI
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Protecting investors through advanced AI-powered monitoring and analysis. 
              Supporting SEBI's Safe Space initiative with real-time threat detection and verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-3">
                <Link to="/suspicious-offers">Start Analysis</Link>
              </Button>
              <Button variant="outline" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-3">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Offers Analyzed"
              value="12,847"
              change="+23% from last month"
              trend="up"
              icon={EyeIcon}
            />
            <StatCard
              title="Threats Detected"
              value="2,156"
              change="+12% from last week"
              trend="up"
              icon={ExclamationTriangleIcon}
            />
            <StatCard
              title="Verified Advisors"
              value="8,934"
              change="Updated daily"
              trend="neutral"
              icon={CheckCircleIcon}
            />
            <StatCard
              title="Active Monitors"
              value="24/7"
              description="Continuous protection"
              icon={ShieldCheckIcon}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Advanced Protection Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive suite of AI-powered tools designed to protect investors and maintain market integrity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="text-sm text-success font-medium mb-4">
                      {feature.stats}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={feature.href}>Access Feature</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Alerts Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recent Security Alerts
              </h2>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                alert.type === 'High Risk' 
                                  ? 'bg-destructive/10 text-destructive'
                                  : alert.type === 'Medium Risk'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-success/10 text-success'
                              }`}
                            >
                              {alert.type}
                            </span>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                          <p className="text-sm text-foreground">{alert.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button asChild className="w-full mt-6">
                <Link to="/dashboard">View All Alerts</Link>
              </Button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                System Status
              </h2>
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Analysis Engine</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-success">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Social Media Monitor</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-success">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SEBI Database Sync</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-success">Synchronized</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Threat Detection</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-success">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;