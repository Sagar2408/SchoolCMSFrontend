import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  School,
  BookOpen,
  DollarSign
} from 'lucide-react';

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const [data, setData] = useState({
    studentStats: {
      total: 1250,
      newAdmissions: 45,
      dropouts: 3,
      growth: 12.5
    },
    attendance: {
      present: 1180,
      absent: 45,
      late: 25,
      percentage: 94.4
    },
    financials: {
      revenue: 125000,
      expenses: 98000,
      pendingFees: 45000,
      growth: 8.2
    },
    gradeDistribution: [
      { grade: 'A', count: 320, color: '#10B981' },
      { grade: 'B', count: 450, color: '#3B82F6' },
      { grade: 'C', count: 280, color: '#F59E0B' },
      { grade: 'D', count: 150, color: '#EF4444' },
      { grade: 'F', count: 50, color: '#6B7280' }
    ],
    monthlyAttendance: [
      { month: 'Jan', present: 1150, absent: 60 },
      { month: 'Feb', present: 1180, absent: 45 },
      { month: 'Mar', present: 1200, absent: 30 },
      { month: 'Apr', present: 1190, absent: 40 },
      { month: 'May', present: 1180, absent: 45 },
      { month: 'Jun', present: 1220, absent: 20 }
    ],
    subjectPerformance: [
      { subject: 'Mathematics', avgScore: 78, passRate: 85 },
      { subject: 'Science', avgScore: 82, passRate: 90 },
      { subject: 'English', avgScore: 75, passRate: 88 },
      { subject: 'History', avgScore: 80, passRate: 92 },
      { subject: 'Geography', avgScore: 77, passRate: 86 }
    ]
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const StatCard = ({ title, value, subtitle, trend, trendUp, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-2 text-gray-600">Comprehensive insights into school performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex flex-wrap gap-2">
          <TabButton id="overview" label="Overview" icon={TrendingUp} />
          <TabButton id="students" label="Students" icon={Users} />
          <TabButton id="academics" label="Academics" icon={GraduationCap} />
          <TabButton id="attendance" label="Attendance" icon={Calendar} />
          <TabButton id="financial" label="Financial" icon={DollarSign} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students"
                value={data.studentStats.total}
                subtitle={`${data.studentStats.newAdmissions} new this month`}
                trend={`${data.studentStats.growth}%`}
                trendUp={true}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Attendance Rate"
                value={`${data.attendance.percentage}%`}
                subtitle={`${data.attendance.present} present today`}
                trend="2.1%"
                trendUp={true}
                icon={Calendar}
                color="bg-green-500"
              />
              <StatCard
                title="Revenue"
                value={`$${data.financials.revenue.toLocaleString()}`}
                subtitle={`$${data.financials.pendingFees.toLocaleString()} pending`}
                trend={`${data.financials.growth}%`}
                trendUp={true}
                icon={DollarSign}
                color="bg-purple-500"
              />
              <StatCard
                title="Pass Rate"
                value="87%"
                subtitle="Average across all subjects"
                trend="1.5%"
                trendUp={true}
                icon={GraduationCap}
                color="bg-orange-500"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <School className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Classrooms Active</p>
                    <p className="text-xl font-bold text-gray-900">45/50</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Courses Running</p>
                    <p className="text-xl font-bold text-gray-900">68</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Teacher/Student Ratio</p>
                    <p className="text-xl font-bold text-gray-900">1:25</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Enrollment by Grade</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { grade: '1-3', count: 280 },
                    { grade: '4-6', count: 320 },
                    { grade: '7-9', count: 350 },
                    { grade: '10-12', count: 300 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="grade" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Key Metrics</h4>
                <div className="space-y-3">
                  {[
                    { label: 'New Admissions (This Month)', value: '45', change: '+12%' },
                    { label: 'Transfer Students', value: '8', change: '-2%' },
                    { label: 'Dropout Rate', value: '0.24%', change: '-0.1%' },
                    { label: 'Retention Rate', value: '98.5%', change: '+0.5%' }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{metric.label}</span>
                      <div className="text-right">
                        <span className="block font-semibold text-gray-900">{metric.value}</span>
                        <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.subjectPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6B7280" />
                  <YAxis dataKey="subject" type="category" width={100} stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#3B82F6" name="Average Score" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="passRate" fill="#10B981" name="Pass Rate %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Attendance Report</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { class: 'Grade 1-A', present: 28, absent: 2, rate: '93%' },
                    { class: 'Grade 2-B', present: 30, absent: 0, rate: '100%' },
                    { class: 'Grade 5-A', present: 25, absent: 5, rate: '83%' },
                    { class: 'Grade 8-C', present: 32, absent: 3, rate: '91%' },
                    { class: 'Grade 10-A', present: 28, absent: 2, rate: '93%' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.present}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{row.absent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{row.rate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">↑ 2%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h4>
                <p className="text-2xl font-bold text-gray-900">${data.financials.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↑ 8.2% from last month</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h4>
                <p className="text-2xl font-bold text-gray-900">${data.financials.expenses.toLocaleString()}</p>
                <p className="text-sm text-red-600 mt-1">↑ 3.1% from last month</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Net Profit</h4>
                <p className="text-2xl font-bold text-gray-900">${(data.financials.revenue - data.financials.expenses).toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↑ 15.3% from last month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;