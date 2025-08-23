import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/ui/stat-card';
import Layout from '@/components/layout/Layout';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';

const SocialMonitor = () => {
  const [searchTicker, setSearchTicker] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock data for social media monitoring
  const flaggedTickers = [
    {
      symbol: 'TECHCORP',
      mentions: 1245,
      sentiment: 'manipulative',
      risk: 'high',
      volume: '+340%',
      alerts: 23,
      platforms: ['Twitter', 'Reddit', 'Telegram']
    },
    {
      symbol: 'CRYPTOMAX',
      mentions: 890,
      sentiment: 'pump',
      risk: 'high',
      volume: '+280%',
      alerts: 18,
      platforms: ['Discord', 'Twitter']
    },
    {
      symbol: 'GREENTECH',
      mentions: 456,
      sentiment: 'suspicious',
      risk: 'medium',
      volume: '+120%',
      alerts: 8,
      platforms: ['Reddit', 'Facebook']
    },
    {
      symbol: 'BIOMAX',
      mentions: 234,
      sentiment: 'coordinated',
      risk: 'medium',
      volume: '+90%',
      alerts: 5,
      platforms: ['Twitter', 'WhatsApp']
    }
  ];

  const socialActivityData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Total Mentions',
        data: [120, 145, 280, 340, 320, 280, 250],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Flagged Content',
        data: [5, 8, 25, 35, 30, 22, 18],
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsl(var(--destructive) / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const platformActivityData = {
    labels: ['Twitter', 'Reddit', 'Telegram', 'Discord', 'Facebook', 'WhatsApp'],
    datasets: [
      {
        label: 'Flagged Posts',
        data: [45, 32, 28, 18, 12, 8],
        backgroundColor: [
          'hsl(var(--destructive) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--success) / 0.8)',
          'hsl(var(--muted) / 0.8)',
          'hsl(var(--accent) / 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const recentPosts = [
    {
      id: 1,
      platform: 'Twitter',
      content: '🚀 TECHCORP going to the moon! 1000% guaranteed returns! Join our pump group...',
      username: '@cryptoking2024',
      risk: 'high',
      timestamp: '5 min ago',
      engagement: '1.2K likes, 340 retweets'
    },
    {
      id: 2,
      platform: 'Reddit',
      content: 'INSIDER INFO: CRYPTOMAX about to announce major partnership. Buy now before it explodes!',
      username: 'u/StockGuru99',
      risk: 'high',
      timestamp: '12 min ago',
      engagement: '89 upvotes, 45 comments'
    },
    {
      id: 3,
      platform: 'Telegram',
      content: 'VIP signal: GREENTECH is the next big thing. Our group made 500% last week...',
      username: 'TradeMaster',
      risk: 'medium',
      timestamp: '25 min ago',
      engagement: '156 views, 23 forwards'
    },
    {
      id: 4,
      platform: 'Discord',
      content: 'Secret tip: BIOMAX announcement coming Monday. This is not financial advice 😉',
      username: 'InvestorPro',
      risk: 'medium',
      timestamp: '1 hour ago',
      engagement: '45 reactions, 12 replies'
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

  const getPlatformIcon = (platform: string) => {
    // In a real app, you'd use actual social media icons
    return platform.charAt(0);
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
            Social Media Stock Tip Monitor
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time monitoring of social media for stock manipulation and pump-and-dump schemes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Alerts"
            value="54"
            change="+18% from yesterday"
            trend="up"
            icon={ExclamationTriangleIcon}
          />
          <StatCard
            title="Monitored Platforms"
            value="6"
            description="Real-time scanning"
            icon={EyeIcon}
          />
          <StatCard
            title="Flagged Posts"
            value="143"
            change="+25% today"
            trend="up"
            icon={ChartBarIcon}
          />
          <StatCard
            title="Detection Rate"
            value="94.2%"
            change="+2.1% this week"
            trend="up"
            icon={ArrowTrendingUpIcon}
          />
        </div>

        {/* Search and Controls */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Monitor Controls</CardTitle>
            <CardDescription>Search specific tickers or adjust monitoring parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ticker symbol (e.g., RELIANCE, TCS)"
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant={selectedTimeframe === '1h' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('1h')}>
                  1H
                </Button>
                <Button variant={selectedTimeframe === '24h' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('24h')}>
                  24H
                </Button>
                <Button variant={selectedTimeframe === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('7d')}>
                  7D
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="flagged" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flagged">Flagged Tickers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          </TabsList>

          {/* Flagged Tickers Tab */}
          <TabsContent value="flagged" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>High-Risk Ticker Activity</CardTitle>
                <CardDescription>Stocks showing suspicious social media patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedTickers.map((ticker, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{ticker.symbol}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getRiskColor(ticker.risk) as any}>
                              {ticker.risk.toUpperCase()} RISK
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {ticker.sentiment}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">{ticker.mentions}</div>
                          <div className="text-xs text-muted-foreground">Mentions</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-destructive">{ticker.volume}</div>
                          <div className="text-xs text-muted-foreground">Volume ↑</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{ticker.alerts}</div>
                          <div className="text-xs text-muted-foreground">Alerts</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="flex flex-wrap gap-1">
                            {ticker.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Platforms</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Social Activity Timeline</CardTitle>
                  <CardDescription>24-hour social media mention trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '300px' }}>
                    <Line data={socialActivityData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>Flagged content by social media platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '300px' }}>
                    <Bar data={platformActivityData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Risk Correlation Analysis</CardTitle>
                <CardDescription>Relationship between social mentions and stock volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">87%</div>
                    <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                    <div className="text-xs text-success mt-1">+5% this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">156</div>
                    <div className="text-sm text-muted-foreground">Active Monitors</div>
                    <div className="text-xs text-muted-foreground mt-1">Across 6 platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2.3s</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    <div className="text-xs text-success mt-1">-0.8s faster</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Flagged Social Media Posts</CardTitle>
                <CardDescription>Recent suspicious posts detected across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{getPlatformIcon(post.platform)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{post.platform}</span>
                              <Badge variant={getRiskColor(post.risk) as any} className="text-xs">
                                {post.risk.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {post.username} • {post.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-sm">{post.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {post.engagement}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            False Positive
                          </Button>
                          <Button variant="destructive" size="sm">
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SocialMonitor;