import React, { useState } from 'react';
import apiClient from '@/lib/api-client';
import { SCAN_INVESTMENT_OFFERS_ROUTE } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

const SuspiciousOffers = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [offerText, setOfferText] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setFileError(null);
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit.');
      setIsAnalyzing(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('offerText', offerText);
      formData.append('advisorName', advisorName);
      formData.append('contactInfo', contactInfo);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      const { data } = await apiClient.post(`/${SCAN_INVESTMENT_OFFERS_ROUTE}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(data);
    } catch (err) {
      let msg = 'Failed to analyze offer. Please try again.';
      if (err.response && err.response.data && err.response.data.error) {
        msg = err.response.data.error;
      }
      setAnalysisResult({ error: msg });
    }
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const recentAnalyses = [
    {
      id: 1,
      title: 'Cryptocurrency Trading Bot Scheme',
      risk: 'high',
      date: '2024-01-15',
      advisor: 'Unregistered'
    },
    {
      id: 2,
      title: 'Fixed Deposit Alternative Investment',
      risk: 'medium',
      date: '2024-01-14',
      advisor: 'Registered'
    },
    {
      id: 3,
      title: 'Mutual Fund SIP Recommendation',
      risk: 'low',
      date: '2024-01-13',
      advisor: 'Registered'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Suspicious Investment Offer Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyze investment offers for legitimacy and risk factors using advanced AI detection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>Investment Offer Analysis</span>
                </CardTitle>
                <CardDescription>
                  Submit investment offer details or upload documents for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input */}
                <div className="space-y-2">
                  <Label htmlFor="offer-text">Investment Offer Details</Label>
                  <Textarea
                    id="offer-text"
                    placeholder="Paste the investment offer text, email content, or advertisement details here..."
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Documents</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <CloudArrowUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOCX, TXT files up to 10MB
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      id="offer-file-upload"
                      onChange={e => {
                        setFileError(null);
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 10 * 1024 * 1024) {
                            setFileError('File size exceeds 10MB limit.');
                            setSelectedFile(null);
                          } else {
                            setSelectedFile(file);
                          }
                        }
                      }}
                    />
                    <label htmlFor="offer-file-upload">
                      <Button asChild variant="outline" className="mt-4 cursor-pointer">
                        <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
                      </Button>
                    </label>
                    {fileError && (
                      <div className="text-destructive text-xs mt-2">{fileError}</div>
                    )}
                  </div>
                </div>

                {/* Advisor Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advisor-name">Advisor/Company Name</Label>
                    <Input
                      id="advisor-name"
                      placeholder="Enter advisor or company name"
                      value={advisorName}
                      onChange={e => setAdvisorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-info">Contact Information</Label>
                    <Input
                      id="contact-info"
                      placeholder="Phone, email, or website"
                      value={contactInfo}
                      onChange={e => setContactInfo(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !offerText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Investment Offer'}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="shadow-card mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span>Analysis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResult.error && (
                    <div className="text-destructive font-semibold mb-4">{analysisResult.error}</div>
                  )}
                  {/* Risk Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold mb-2">
                          <Badge variant={getRiskColor(analysisResult.overallRisk) as any} className="text-lg px-3 py-1">
                            {(analysisResult.overallRisk ? analysisResult.overallRisk.toUpperCase() : "UNKNOWN")} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Risk Level</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold mb-2">
                          {analysisResult.advisorStatus === 'registered' ? (
                            <CheckCircleIcon className="h-8 w-8 text-success mx-auto" />
                          ) : (
                            <XCircleIcon className="h-8 w-8 text-destructive mx-auto" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {analysisResult.advisorStatus === 'registered' ? 'SEBI Registered' : 'Unregistered Advisor'}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold mb-2 text-foreground">
                          {analysisResult.riskScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SEBI Registration */}
                  {analysisResult.sebiRegistration && (
                    <div>
                      <h4 className="font-semibold mb-2">SEBI Registration Details</h4>
                      <p className="text-sm text-muted-foreground bg-success/10 p-3 rounded-lg">
                        Registration Number: <span className="font-mono">{analysisResult.sebiRegistration}</span>
                      </p>
                    </div>
                  )}

                  {/* Risk Keywords */}
                  <div>
                    <h4 className="font-semibold mb-2">Detected Risk Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(analysisResult.riskKeywords) && analysisResult.riskKeywords.length > 0 ? (
                        analysisResult.riskKeywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="destructive">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">None detected</span>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 ? (
                        analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ExclamationTriangleIcon className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{rec}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-muted-foreground">No recommendations available</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Analyses</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">High Risk Detected</span>
                  <span className="font-semibold text-destructive">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Unregistered Advisors</span>
                  <span className="font-semibold text-warning">41</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verified Safe</span>
                  <span className="font-semibold text-success">92</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Analyses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">{analysis.title}</h4>
                      <Badge variant={getRiskColor(analysis.risk) as any} className="text-xs">
                        {analysis.risk}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{analysis.advisor}</span>
                      <span>{analysis.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI analyzes investment offers for common fraud indicators and verifies advisor credentials.
                </p>
                <Button variant="outline" className="w-full">
                  View Analysis Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuspiciousOffers;