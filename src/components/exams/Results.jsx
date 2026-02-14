import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  FileSpreadsheet,
  TrendingUp,
  Award,
  Calendar,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'analytics'
  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchResults = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            studentName: 'John Doe',
            rollNumber: 'STD001',
            class: 'Grade 10-A',
            examName: 'Mid-Term Examination 2024',
            examDate: '2024-03-15',
            subjects: [
              { name: 'Mathematics', marks: 85, total: 100, grade: 'A' },
              { name: 'Science', marks: 78, total: 100, grade: 'B+' },
              { name: 'English', marks: 92, total: 100, grade: 'A+' },
              { name: 'History', marks: 88, total: 100, grade: 'A' },
              { name: 'Geography', marks: 76, total: 100, grade: 'B' }
            ],
            totalMarks: 419,
            maxMarks: 500,
            percentage: 83.8,
            overallGrade: 'A',
            rank: 3,
            status: 'passed',
            remarks: 'Excellent performance in English'
          },
          {
            id: 2,
            studentName: 'Sarah Smith',
            rollNumber: 'STD002',
            class: 'Grade 10-A',
            examName: 'Mid-Term Examination 2024',
            examDate: '2024-03-15',
            subjects: [
              { name: 'Mathematics', marks: 92, total: 100, grade: 'A+' },
              { name: 'Science', marks: 88, total: 100, grade: 'A' },
              { name: 'English', marks: 85, total: 100, grade: 'A' },
              { name: 'History', marks: 90, total: 100, grade: 'A+' },
              { name: 'Geography', marks: 82, total: 100, grade: 'A' }
            ],
            totalMarks: 437,
            maxMarks: 500,
            percentage: 87.4,
            overallGrade: 'A+',
            rank: 1,
            status: 'passed',
            remarks: 'Outstanding performance across all subjects'
          },
          {
            id: 3,
            studentName: 'Michael Brown',
            rollNumber: 'STD003',
            class: 'Grade 9-B',
            examName: 'Mid-Term Examination 2024',
            examDate: '2024-03-15',
            subjects: [
              { name: 'Mathematics', marks: 65, total: 100, grade: 'C+' },
              { name: 'Science', marks: 72, total: 100, grade: 'B' },
              { name: 'English', marks: 68, total: 100, grade: 'C+' },
              { name: 'History', marks: 75, total: 100, grade: 'B' },
              { name: 'Geography', marks: 70, total: 100, grade: 'B-' }
            ],
            totalMarks: 350,
            maxMarks: 500,
            percentage: 70.0,
            overallGrade: 'B',
            rank: 12,
            status: 'passed',
            remarks: 'Needs improvement in Mathematics'
          },
          {
            id: 4,
            studentName: 'Emily Johnson',
            rollNumber: 'STD004',
            class: 'Grade 11-A',
            examName: 'Final Examination 2023',
            examDate: '2023-12-20',
            subjects: [
              { name: 'Physics', marks: 45, total: 100, grade: 'F' },
              { name: 'Chemistry', marks: 52, total: 100, grade: 'D' },
              { name: 'Biology', marks: 48, total: 100, grade: 'F' },
              { name: 'English', marks: 65, total: 100, grade: 'C+' },
              { name: 'Mathematics', marks: 38, total: 100, grade: 'F' }
            ],
            totalMarks: 248,
            maxMarks: 500,
            percentage: 49.6,
            overallGrade: 'F',
            rank: 28,
            status: 'failed',
            remarks: 'Failed in 3 subjects. Remedial classes recommended.'
          },
          {
            id: 5,
            studentName: 'David Wilson',
            rollNumber: 'STD005',
            class: 'Grade 8-A',
            examName: 'Quarterly Test 2024',
            examDate: '2024-02-10',
            subjects: [
              { name: 'Mathematics', marks: 78, total: 100, grade: 'B+' },
              { name: 'Science', marks: 82, total: 100, grade: 'A' },
              { name: 'English', marks: 80, total: 100, grade: 'A' },
              { name: 'Social Studies', marks: 76, total: 100, grade: 'B' },
              { name: 'Computer Science', marks: 88, total: 100, grade: 'A' }
            ],
            totalMarks: 404,
            maxMarks: 500,
            percentage: 80.8,
            overallGrade: 'A',
            rank: 5,
            status: 'passed',
            remarks: 'Good performance. Keep it up!'
          }
        ];
        setResults(mockData);
        setFilteredResults(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchResults();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...results];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(result => 
        result.studentName.toLowerCase().includes(lowerSearch) ||
        result.rollNumber.toLowerCase().includes(lowerSearch) ||
        result.examName.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedExam !== 'all') {
      filtered = filtered.filter(result => result.examName === selectedExam);
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(result => result.class === selectedClass);
    }

    setFilteredResults(filtered);
  }, [results, searchTerm, selectedExam, selectedClass]);

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800 border-green-200',
      'A': 'bg-green-100 text-green-700 border-green-200',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B': 'bg-blue-100 text-blue-700 border-blue-200',
      'B-': 'bg-blue-100 text-blue-600 border-blue-200',
      'C+': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'D': 'bg-orange-100 text-orange-800 border-orange-200',
      'F': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    return status === 'passed' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      setResults(prev => prev.filter(result => result.id !== id));
    }
  };

  const calculateStats = () => {
    if (filteredResults.length === 0) return null;
    
    const totalStudents = filteredResults.length;
    const passed = filteredResults.filter(r => r.status === 'passed').length;
    const failed = totalStudents - passed;
    const avgPercentage = filteredResults.reduce((acc, r) => acc + r.percentage, 0) / totalStudents;
    const highestMarks = Math.max(...filteredResults.map(r => r.percentage));
    const lowestMarks = Math.min(...filteredResults.map(r => r.percentage));

    return { totalStudents, passed, failed, avgPercentage, highestMarks, lowestMarks };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
            <p className="mt-2 text-gray-600">Manage and view student examination results</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'analytics' : 'table')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'table' ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Table View
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </button>
          </div>
        </div>

        {/* Analytics View */}
        {viewMode === 'analytics' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((stats.passed / stats.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{stats.passed} passed, {stats.failed} failed</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgPercentage.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Highest Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.highestMarks.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Lowest: {stats.lowestMarks.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student name, roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
              >
                <option value="all">All Exams</option>
                <option value="Mid-Term Examination 2024">Mid-Term 2024</option>
                <option value="Final Examination 2023">Final 2023</option>
                <option value="Quarterly Test 2024">Quarterly 2024</option>
              </select>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
              >
                <option value="all">All Classes</option>
                <option value="Grade 8-A">Grade 8-A</option>
                <option value="Grade 9-B">Grade 9-B</option>
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 11-A">Grade 11-A</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <React.Fragment key={result.id}>
                    <tr 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleRow(result.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {result.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                            <div className="text-sm text-gray-500">{result.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.examName}</div>
                        <div className="text-sm text-gray-500">{new Date(result.examDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.percentage}%</div>
                        <div className="text-sm text-gray-500">{result.totalMarks}/{result.maxMarks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGradeColor(result.overallGrade)}`}>
                          {result.overallGrade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{result.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                          {result.status === 'passed' ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResult(result);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit logic
                            }}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(result.id);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Row Details */}
                    {expandedRow === result.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Subject-wise Marks</h4>
                              <div className="space-y-2">
                                {result.subjects.map((subject, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                                    <span className="text-sm text-gray-700">{subject.name}</span>
                                    <div className="flex items-center gap-3">
                                      <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full"
                                          style={{ width: `${(subject.marks / subject.total) * 100}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900 w-16 text-right">
                                        {subject.marks}/{subject.total}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded border ${getGradeColor(subject.grade)}`}>
                                        {subject.grade}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Summary</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Total Marks</span>
                                  <span className="text-sm font-medium text-gray-900">{result.totalMarks}/{result.maxMarks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Percentage</span>
                                  <span className="text-sm font-medium text-gray-900">{result.percentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Overall Grade</span>
                                  <span className={`text-sm font-medium px-2 py-1 rounded border ${getGradeColor(result.overallGrade)}`}>
                                    {result.overallGrade}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Class Rank</span>
                                  <span className="text-sm font-medium text-gray-900">#{result.rank}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                  <span className="text-sm text-gray-600">Remarks:</span>
                                  <p className="text-sm text-gray-900 mt-1">{result.remarks}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredResults.length}</span> of <span className="font-medium">{filteredResults.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Result Modal - Simple placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Result</h3>
            <p className="text-gray-600 mb-4">This would open a form to add new exam results.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;