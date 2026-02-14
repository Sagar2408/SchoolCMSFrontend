import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  Edit2,
  Trash2,
  Plus,
  Grid,
  List,
  BookOpen
} from 'lucide-react';

const TimetableView = () => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const timeSlots = [
    { id: 1, startTime: '08:00', endTime: '08:45', label: 'Period 1' },
    { id: 2, startTime: '08:45', endTime: '09:30', label: 'Period 2' },
    { id: 3, startTime: '09:30', endTime: '10:15', label: 'Period 3' },
    { id: 4, startTime: '10:15', endTime: '10:30', label: 'Break', isBreak: true },
    { id: 5, startTime: '10:30', endTime: '11:15', label: 'Period 4' },
    { id: 6, startTime: '11:15', endTime: '12:00', label: 'Period 5' },
    { id: 7, startTime: '12:00', endTime: '13:00', label: 'Lunch', isBreak: true },
    { id: 8, startTime: '13:00', endTime: '13:45', label: 'Period 6' },
    { id: 9, startTime: '13:45', endTime: '14:30', label: 'Period 7' },
    { id: 10, startTime: '14:30', endTime: '15:15', label: 'Period 8' }
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchTimetables = async () => {
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            className: 'Grade 10',
            section: 'A',
            academicYear: '2024-2025',
            effectiveFrom: '2024-01-15',
            effectiveTo: '2024-06-30',
            schedule: {
              'Monday': {
                1: { subjectId: 1, subjectName: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
                2: { subjectId: 2, subjectName: 'Science', teacher: 'Ms. Smith', room: 'Lab 1' },
                3: { subjectId: 3, subjectName: 'English', teacher: 'Mrs. Davis', room: 'Room 102' },
                5: { subjectId: 4, subjectName: 'History', teacher: 'Mr. Brown', room: 'Room 103' },
                6: { subjectId: 5, subjectName: 'Geography', teacher: 'Ms. Wilson', room: 'Room 104' },
                8: { subjectId: 6, subjectName: 'Physics', teacher: 'Dr. Einstein', room: 'Lab 2' },
                9: { subjectId: 7, subjectName: 'Chemistry', teacher: 'Dr. Curie', room: 'Lab 3' },
                10: { subjectId: 9, subjectName: 'Computer Science', teacher: 'Mr. Turing', room: 'Computer Lab' }
              },
              'Tuesday': {
                1: { subjectId: 3, subjectName: 'English', teacher: 'Mrs. Davis', room: 'Room 102' },
                2: { subjectId: 1, subjectName: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
                3: { subjectId: 8, subjectName: 'Biology', teacher: 'Ms. Darwin', room: 'Lab 1' },
                5: { subjectId: 2, subjectName: 'Science', teacher: 'Ms. Smith', room: 'Lab 1' },
                6: { subjectId: 4, subjectName: 'History', teacher: 'Mr. Brown', room: 'Room 103' },
                8: { subjectId: 10, subjectName: 'Physical Education', teacher: 'Coach Johnson', room: 'Gym' },
                9: { subjectId: 11, subjectName: 'Art', teacher: 'Ms. Picasso', room: 'Art Room' },
                10: { subjectId: 12, subjectName: 'Music', teacher: 'Mr. Mozart', room: 'Music Room' }
              },
              'Wednesday': {
                1: { subjectId: 6, subjectName: 'Physics', teacher: 'Dr. Einstein', room: 'Lab 2' },
                2: { subjectId: 7, subjectName: 'Chemistry', teacher: 'Dr. Curie', room: 'Lab 3' },
                3: { subjectId: 1, subjectName: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
                5: { subjectId: 3, subjectName: 'English', teacher: 'Mrs. Davis', room: 'Room 102' },
                6: { subjectId: 5, subjectName: 'Geography', teacher: 'Ms. Wilson', room: 'Room 104' },
                8: { subjectId: 2, subjectName: 'Science', teacher: 'Ms. Smith', room: 'Lab 1' },
                9: { subjectId: 4, subjectName: 'History', teacher: 'Mr. Brown', room: 'Room 103' },
                10: { subjectId: 9, subjectName: 'Computer Science', teacher: 'Mr. Turing', room: 'Computer Lab' }
              },
              'Thursday': {
                1: { subjectId: 5, subjectName: 'Geography', teacher: 'Ms. Wilson', room: 'Room 104' },
                2: { subjectId: 3, subjectName: 'English', teacher: 'Mrs. Davis', room: 'Room 102' },
                3: { subjectId: 1, subjectName: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
                5: { subjectId: 8, subjectName: 'Biology', teacher: 'Ms. Darwin', room: 'Lab 1' },
                6: { subjectId: 6, subjectName: 'Physics', teacher: 'Dr. Einstein', room: 'Lab 2' },
                8: { subjectId: 7, subjectName: 'Chemistry', teacher: 'Dr. Curie', room: 'Lab 3' },
                9: { subjectId: 2, subjectName: 'Science', teacher: 'Ms. Smith', room: 'Lab 1' },
                10: { subjectId: 10, subjectName: 'Physical Education', teacher: 'Coach Johnson', room: 'Gym' }
              },
              'Friday': {
                1: { subjectId: 4, subjectName: 'History', teacher: 'Mr. Brown', room: 'Room 103' },
                2: { subjectId: 5, subjectName: 'Geography', teacher: 'Ms. Wilson', room: 'Room 104' },
                3: { subjectId: 3, subjectName: 'English', teacher: 'Mrs. Davis', room: 'Room 102' },
                5: { subjectId: 1, subjectName: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
                6: { subjectId: 9, subjectName: 'Computer Science', teacher: 'Mr. Turing', room: 'Computer Lab' },
                8: { subjectId: 11, subjectName: 'Art', teacher: 'Ms. Picasso', room: 'Art Room' },
                9: { subjectId: 12, subjectName: 'Music', teacher: 'Mr. Mozart', room: 'Music Room' },
                10: { subjectId: 8, subjectName: 'Biology', teacher: 'Ms. Darwin', room: 'Lab 1' }
              },
              'Saturday': {
                1: { subjectId: 2, subjectName: 'Science', teacher: 'Ms. Smith', room: 'Lab 1' },
                2: { subjectId: 6, subjectName: 'Physics', teacher: 'Dr. Einstein', room: 'Lab 2' },
                3: { subjectId: 10, subjectName: 'Physical Education', teacher: 'Coach Johnson', room: 'Gym' },
                5: { subjectId: 7, subjectName: 'Chemistry', teacher: 'Dr. Curie', room: 'Lab 3' }
              }
            }
          },
          {
            id: 2,
            className: 'Grade 9',
            section: 'B',
            academicYear: '2024-2025',
            effectiveFrom: '2024-01-15',
            effectiveTo: '2024-06-30',
            schedule: { /* Similar structure */ }
          },
          {
            id: 3,
            className: 'Grade 11',
            section: 'A',
            academicYear: '2024-2025',
            effectiveFrom: '2024-01-15',
            effectiveTo: '2024-06-30',
            schedule: { /* Similar structure */ }
          }
        ];
        setTimetables(mockData);
        setSelectedTimetable(mockData[0]);
        setLoading(false);
      }, 1000);
    };

    fetchTimetables();
  }, []);

  const filteredTimetables = timetables.filter(t => {
    const matchesSearch = t.className.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || t.className === filterClass;
    return matchesSearch && matchesClass;
  });

  const getSubjectColor = (subjectName) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Science': 'bg-green-100 text-green-800 border-green-200',
      'English': 'bg-purple-100 text-purple-800 border-purple-200',
      'History': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Geography': 'bg-orange-100 text-orange-800 border-orange-200',
      'Physics': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Chemistry': 'bg-pink-100 text-pink-800 border-pink-200',
      'Biology': 'bg-teal-100 text-teal-800 border-teal-200',
      'Computer Science': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Physical Education': 'bg-red-100 text-red-800 border-red-200',
      'Art': 'bg-rose-100 text-rose-800 border-rose-200',
      'Music': 'bg-violet-100 text-violet-800 border-violet-200'
    };
    return colors[subjectName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export to PDF/Excel logic
    alert('Export functionality would generate PDF/Excel file here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading timetables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Class Timetables</h1>
            <p className="mt-2 text-gray-600">View and manage class schedules</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={() => window.location.href = '/timetables/new'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Timetable List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Available Timetables</h3>
                <p className="text-sm text-gray-500 mt-1">{filteredTimetables.length} found</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredTimetables.map(timetable => (
                  <button
                    key={timetable.id}
                    onClick={() => setSelectedTimetable(timetable)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedTimetable?.id === timetable.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{timetable.className} - Section {timetable.section}</p>
                        <p className="text-sm text-gray-500">{timetable.academicYear}</p>
                      </div>
                      {selectedTimetable?.id === timetable.id && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Timetable Display */}
          <div className="lg:col-span-3">
            {selectedTimetable ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Timetable Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedTimetable.className} - Section {selectedTimetable.section}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedTimetable.academicYear}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(selectedTimetable.effectiveFrom).toLocaleDateString()} - {new Date(selectedTimetable.effectiveTo).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.location.href = `/timetables/${selectedTimetable.id}/edit`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this timetable?')) {
                            setTimetables(prev => prev.filter(t => t.id !== selectedTimetable.id));
                            setSelectedTimetable(null);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timetable Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                          Time / Day
                        </th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map(slot => (
                        <tr key={slot.id} className={slot.isBreak ? 'bg-yellow-50' : ''}>
                          <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                            <div>{slot.startTime}</div>
                            <div className="text-xs text-gray-500">{slot.endTime}</div>
                            <div className="text-xs font-semibold text-gray-600 mt-1">{slot.label}</div>
                          </td>
                          {daysOfWeek.map(day => (
                            <td key={day} className="border border-gray-200 p-2 min-w-[140px]">
                              {slot.isBreak ? (
                                <div className="text-center text-xs font-semibold text-yellow-700 py-4">
                                  {slot.label}
                                </div>
                              ) : (
                                (() => {
                                  const slotData = selectedTimetable.schedule[day]?.[slot.id];
                                  return slotData ? (
                                    <div className={`p-2 rounded-lg border ${getSubjectColor(slotData.subjectName)} h-full`}>
                                      <div className="font-semibold text-sm">{slotData.subjectName}</div>
                                      <div className="text-xs mt-1 opacity-90 flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {slotData.teacher}
                                      </div>
                                      <div className="text-xs mt-1 opacity-90 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {slotData.room}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-16 flex items-center justify-center text-gray-300 text-xs">
                                      -
                                    </div>
                                  );
                                })()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Subject Legend</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries({
                      'Mathematics': 'bg-blue-100 text-blue-800',
                      'Science': 'bg-green-100 text-green-800',
                      'English': 'bg-purple-100 text-purple-800',
                      'History': 'bg-yellow-100 text-yellow-800',
                      'Geography': 'bg-orange-100 text-orange-800',
                      'Physics': 'bg-indigo-100 text-indigo-800',
                      'Chemistry': 'bg-pink-100 text-pink-800',
                      'Biology': 'bg-teal-100 text-teal-800',
                      'Computer Science': 'bg-cyan-100 text-cyan-800',
                      'Physical Education': 'bg-red-100 text-red-800'
                    }).map(([subject, colorClass]) => (
                      <span key={subject} className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Timetable Selected</h3>
                <p className="mt-2 text-gray-500">Select a timetable from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {selectedTimetable && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Subjects</p>
                  <p className="text-xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Periods per Day</p>
                  <p className="text-xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teachers</p>
                  <p className="text-xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rooms Used</p>
                  <p className="text-xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableView;