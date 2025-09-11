import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Download, Calendar, TrendingUp, FileText, PieChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Generate and view hospital reports and analytics',
};

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Patient Statistics',
      description: 'Patient demographics and admission trends',
      icon: BarChart3,
      period: 'Monthly'
    },
    {
      title: 'Financial Reports',
      description: 'Revenue, expenses, and financial analytics',
      icon: TrendingUp,
      period: 'Quarterly'
    },
    {
      title: 'Staff Performance',
      description: 'Staff productivity and performance metrics',
      icon: PieChart,
      period: 'Weekly'
    },
    {
      title: 'Operational Reports',
      description: 'Bed occupancy, equipment usage, and efficiency',
      icon: FileText,
      period: 'Daily'
    }
  ];

  const recentReports = [
    { name: 'Monthly Patient Report - November 2024', generated: '2 days ago', size: '2.4 MB' },
    { name: 'Weekly Staff Performance Report', generated: '5 days ago', size: '1.8 MB' },
    { name: 'Quarterly Financial Summary Q3', generated: '1 week ago', size: '3.2 MB' },
    { name: 'Daily Operations Report', generated: '2 weeks ago', size: '890 KB' },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate various reports and analytics for your hospital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.title}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{report.title}</h3>
                      <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                        {report.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.description}
                    </p>
                    <Button size="sm" className="mt-3">
                      Generate
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Generated {report.generated}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2GB</div>
            <p className="text-xs text-muted-foreground">
              Across all reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Active schedules
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
