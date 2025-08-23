import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCard from '@/components/ui/stat-card';
import Layout from '@/components/layout/Layout';
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Announcements = () => {
  const [searchCompany, setSearchCompany] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock data for corporate announcements
  const announcements = [
    {
      id: 1,
      company: 'RELIANCE INDUSTRIES',
      title: 'Q3 FY2024 Financial Results Declaration',
      type: 'Financial Results',
      date: '2024-01-15',
      exchange: 'NSE',
      credibility: 'high',
      credibilityScore: 95,
      verificationStatus: 'verified',
      description: 'Quarterly financial results showing 12% growth in revenue and 8% increase in net profit.',
      historicalConsistency: 'consistent',
      filingCompliance: 'compliant',
      riskFactors: []
    },
    {
      id: 2,
      company: 'TECHNO SOLUTIONS',
      title: 'Major Acquisition Announcement',
      type: 'Corporate Action',
      date: '2024-01-14',
      exchange: 'BSE',
      credibility: 'medium',
      credibilityScore: 68,
      verificationStatus: 'under_review',
      description: 'Announced acquisition of US-based AI company for $50M without proper documentation.',
      historicalConsistency: 'inconsistent',
      filingCompliance: 'pending',
      riskFactors: ['Incomplete documentation', 'No regulatory approval mentioned', 'Unusual timing']
    },
    {
      id: 3,
      company: 'INFOSYS LIMITED',
      title: 'New Client Contract Worth $2.5B',
      type: 'Business Update',
      date: '2024-01-13',
      exchange: 'NSE',
      credibility: 'high',
      credibilityScore: 92,
      verificationStatus: 'verified',
      description: 'Secured multi-year technology transformation contract with Fortune 500 client.',
      historicalConsistency: 'consistent',
      filingCompliance: 'compliant',
      riskFactors: []
    },
    {
      id: 4,
      company: 'MIRACLE BIOTECH',
      title: 'Revolutionary Drug Discovery Breakthrough',
      type: 'Product Launch',
      date: '2024-01-12',
      exchange: 'BSE',
      credibility: 'low',
      credibilityScore: 34,
      verificationStatus: 'flagged',
      description: 'Claims breakthrough drug discovery with 100% success rate in trials.',
      historicalConsistency: 'highly_inconsistent',
      filingCompliance: 'non_compliant',
      riskFactors: [
        'Exaggerated claims',
        'No supporting trial data',
        'Previous similar false announcements',
        'Missing regulatory approvals'
      ]
    },
    {
      id: 5,
      company: 'TATA CONSULTANCY SERVICES',
      title: 'Dividend Declaration - ₹22 per share',
      type: 'Dividend',
      date: '2024-01-11',
      exchange: 'NSE',
      credibility: 'high',
      credibilityScore: 98,
      verificationStatus: 'verified',
      description: 'Board approved interim dividend of ₹22 per equity share for FY2024.',
      historicalConsistency: 'consistent',
      filingCompliance: 'compliant',
      riskFactors: []
    }
  ];

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'destructive';
      default: return 'secondary';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircleIcon className="h-4 w-4 text-success" />;
      case 'under_review': return <ExclamationTriangleIcon className="h-4 w-4 text-warning" />;
      case 'flagged': return <XCircleIcon className="h-4 w-4 text-destructive" />;
      default: return <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.company.toLowerCase().includes(searchCompany.toLowerCase()) ||
                         announcement.title.toLowerCase().includes(searchCompany.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || announcement.credibility === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const verificationStats = {
    total: announcements.length,
    verified: announcements.filter(a => a.verificationStatus === 'verified').length,
    underReview: announcements.filter(a => a.verificationStatus === 'under_review').length,
    flagged: announcements.filter(a => a.verificationStatus === 'flagged').length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Corporate Announcement Verifier
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered verification of corporate announcements against historical filings and regulatory compliance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Announcements"
            value={verificationStats.total.toString()}
            description="Analyzed today"
            icon={DocumentTextIcon}
          />
          <StatCard
            title="Verified"
            value={verificationStats.verified.toString()}
            change={`${Math.round((verificationStats.verified / verificationStats.total) * 100)}% of total`}
            trend="neutral"
            icon={CheckCircleIcon}
          />
          <StatCard
            title="Under Review"
            value={verificationStats.underReview.toString()}
            description="Pending verification"
            icon={ExclamationTriangleIcon}
          />
          <StatCard
            title="Flagged"
            value={verificationStats.flagged.toString()}
            description="High risk detected"
            icon={XCircleIcon}
          />
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Search & Filter Announcements</CardTitle>
            <CardDescription>Find specific company announcements or filter by credibility level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name or announcement title..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Credibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Today</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Corporate Announcements</CardTitle>
            <CardDescription>Latest company announcements with AI credibility analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <BuildingOfficeIcon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{announcement.company}</h3>
                        <Badge variant="outline">{announcement.exchange}</Badge>
                        {getVerificationIcon(announcement.verificationStatus)}
                      </div>
                      <h4 className="text-xl font-medium text-foreground mb-1">
                        {announcement.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{announcement.date}</span>
                        </div>
                        <Badge variant="outline">{announcement.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-2">
                        <Badge variant={getCredibilityColor(announcement.credibility) as any} className="text-sm">
                          {announcement.credibility.toUpperCase()} CREDIBILITY
                        </Badge>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(announcement.credibilityScore)}`}>
                        {announcement.credibilityScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Credibility Score</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {announcement.description}
                  </p>

                  {/* Analysis Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">HISTORICAL CONSISTENCY</div>
                      <div className={`text-sm font-semibold ${
                        announcement.historicalConsistency === 'consistent' ? 'text-success' :
                        announcement.historicalConsistency === 'inconsistent' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {announcement.historicalConsistency.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">FILING COMPLIANCE</div>
                      <div className={`text-sm font-semibold ${
                        announcement.filingCompliance === 'compliant' ? 'text-success' :
                        announcement.filingCompliance === 'pending' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {announcement.filingCompliance.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">VERIFICATION STATUS</div>
                      <div className={`text-sm font-semibold ${
                        announcement.verificationStatus === 'verified' ? 'text-success' :
                        announcement.verificationStatus === 'under_review' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {announcement.verificationStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {announcement.riskFactors.length > 0 && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Identified Risk Factors</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {announcement.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-destructive/80">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Full Filing
                      </Button>
                      <Button variant="outline" size="sm">
                        Historical Data
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {announcement.verificationStatus === 'flagged' && (
                        <Button variant="destructive" size="sm">
                          Report Issue
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find relevant announcements.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Credibility Trends</CardTitle>
              <CardDescription>Weekly analysis of announcement credibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Credibility</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-success"></div>
                    </div>
                    <span className="text-sm font-semibold">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medium Credibility</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-1/5 h-full bg-warning"></div>
                    </div>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low Credibility</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-1/20 h-full bg-destructive"></div>
                    </div>
                    <span className="text-sm font-semibold">5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Verification Performance</CardTitle>
              <CardDescription>System accuracy and processing statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-success mb-2">98.7%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">1.2s</div>
                  <div className="text-sm text-muted-foreground">Avg Processing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoring</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning mb-2">156</div>
                  <div className="text-sm text-muted-foreground">Companies Tracked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;