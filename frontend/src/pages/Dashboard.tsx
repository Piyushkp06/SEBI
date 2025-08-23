import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/ui/stat-card';
import Layout from '@/components/layout/Layout';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Mock data for charts
  const threatTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'High Risk Offers',
        data: [12, 19, 15, 25, 22, 18],
        backgroundColor: 'hsl(var(--destructive) / 0.8)',
        borderColor: 'hsl(var(--destructive))',
        borderWidth: 2,
      },
      {
        label: 'Social Media Alerts',
        data: [8, 14, 11, 18, 16, 13],
        backgroundColor: 'hsl(var(--warning) / 0.8)',
        borderColor: 'hsl(var(--warning))',
        borderWidth: 2,
      },
    ],
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'hsl(var(--success) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
        ],
        borderColor: [
          'hsl(var(--success))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
        ],
        borderWidth: 2,
      },
    ],
  };

  const socialActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Social Mentions',
        data: [120, 145, 165, 180, 175, 155, 140],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Flagged Content',
        data: [5, 8, 12, 15, 18, 14, 10],
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsl(var(--destructive) / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const recentAlerts = [
    {
      id: 1,
      type: 'high',
      title: 'Unregistered Investment Advisor Detected',
      description: 'Advisor promoting guaranteed 50% returns without SEBI registration',
      time: '15 minutes ago',
      source: 'Suspicious Offers Scanner'
    },
    {
      id: 2,
      type: 'medium',
      title: 'Social Media Pump Activity',
      description: 'Unusual spike in TECHCORP mentions across Twitter and Reddit',
      time: '1 hour ago',
      source: 'Social Media Monitor'
    },
    {
      id: 3,
      type: 'low',
      title: 'Corporate Announcement Verified',
      description: 'INFOSYS quarterly results announcement credibility confirmed',
      time: '2 hours ago',
      source: 'Corporate Verifier'
    },
    {
      id: 4,
      type: 'high',
      title: 'Ponzi Scheme Indicators',
      description: 'Investment scheme showing classic pyramid structure patterns',
      time: '3 hours ago',
      source: 'AI Analysis Engine'
    },
    {
      id: 5,
      type: 'medium',
      title: 'Suspicious Trading Pattern',
      description: 'Coordinated buying activity detected in small-cap stock',
      time: '4 hours ago',
      source: 'Market Monitor'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Security Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time monitoring and analysis of investment security threats
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Threats"
            value="23"
            change="+15% from yesterday"
            trend="up"
            icon={ExclamationTriangleIcon}
          />
          <StatCard
            title="Offers Analyzed Today"
            value="156"
            change="+8% from yesterday"
            trend="up"
            icon={EyeIcon}
          />
          <StatCard
            title="Social Alerts"
            value="41"
            change="-12% from yesterday"
            trend="down"
            icon={ChartBarIcon}
          />
          <StatCard
            title="Verified Safe"
            value="892"
            change="Updated hourly"
            trend="neutral"
            icon={CheckCircleIcon}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Threat Trends */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Threat Detection Trends</CardTitle>
              <CardDescription>Monthly overview of detected threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar data={threatTrendsData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>Current month risk assessment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Doughnut data={riskDistributionData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Activity Chart */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Social Media Activity Monitor</CardTitle>
            <CardDescription>Weekly social media mentions and flagged content</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Line data={socialActivityData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Security Alerts</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>Latest threats and security incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                      <div className="flex-shrink-0">
                        {alert.type === 'high' && <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />}
                        {alert.type === 'medium' && <ExclamationTriangleIcon className="h-5 w-5 text-warning" />}
                        {alert.type === 'low' && <CheckCircleIcon className="h-5 w-5 text-success" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {alert.title}
                          </p>
                          <Badge variant={getRiskColor(alert.type) as any} className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{alert.source}</span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Analyze New Offer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Social Media Scan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Verify Announcement
                </Button>
                <Button className="w-full justify-start">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  Emergency Alert
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Analysis Engine</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Social Monitor</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Scanning</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SEBI Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Synced</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alert System</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm text-warning">Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Detection Accuracy</span>
                  <div className="flex items-center space-x-1">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-success" />
                    <span className="text-sm font-semibold">94.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <div className="flex items-center space-x-1">
                    <ArrowTrendingDownIcon className="h-3 w-3 text-success" />
                    <span className="text-sm font-semibold">1.3s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm font-semibold text-success">99.97%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;