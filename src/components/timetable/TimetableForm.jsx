import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  Calendar, 
  BookOpen, 
  User, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const TimetableForm = ({ initialData = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    academicYear: '',
    semester: '',
    effectiveFrom: '',
    effectiveTo: '',
    schedule: {}
  });

  const [availableSubjects, setAvailableSubjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH', teacher: 'Mr. Johnson' },
    { id: 2, name: 'Science', code: 'SCI', teacher: 'Ms. Smith' },
    { id: 3, name: 'English', code: 'ENG', teacher: 'Mrs. Davis' },
    { id: 4, name: 'History', code: 'HIST', teacher: 'Mr. Brown' },
    { id: 5, name: 'Geography', code: 'GEO', teacher: 'Ms. Wilson' },
    { id: 6, name: 'Physics', code: 'PHY', teacher: 'Dr. Einstein' },
    { id: 7, name: 'Chemistry', code: 'CHEM', teacher: 'Dr. Curie' },
    { id: 8, name: 'Biology', code: 'BIO', teacher: 'Ms. Darwin' },
    { id: 9, name: 'Computer Science', code: 'CS', teacher: 'Mr. Turing' },
    { id: 10, name: 'Physical Education', code: 'PE', teacher: 'Coach Johnson' },
    { id: 11, name: 'Art', code: 'ART', teacher: 'Ms. Picasso' },
    { id: 12, name: 'Music', code: 'MUS', teacher: 'Mr. Mozart' }
  ]);

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, startTime: '08:00', endTime: '08:45', label: 'Period 1' },
    { id: 2, startTime: '08:45', endTime: '09:30', label: 'Period 2' },
    { id: 3, startTime: '09:30', endTime: '10:15', label: 'Period 3' },
    { id: 4, startTime: '10:15', endTime: '10:30', label: 'Break', isBreak: true },
    { id: 5, startTime: '10:30', endTime: '11:15', label: 'Period 4' },
    { id: 6, startTime: '11:15', endTime: '12:00', label: 'Period 5' },
    { id: 7, startTime: '12:00', endTime: '13:00', label: 'Lunch Break', isBreak: true },
    { id: 8, startTime: '13:00', endTime: '13:45', label: 'Period 6' },
    { id: 9, startTime: '13:45', endTime: '14:30', label: 'Period 7' },
    { id: 10, startTime: '14:30', endTime: '15:15', label: 'Period 8' }
  ]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [activeDay, setActiveDay] = useState('Monday');

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className || '',
        section: initialData.section || '',
        academicYear: initialData.academicYear || '',
        semester: initialData.semester || '',
        effectiveFrom: initialData.effectiveFrom || '',
        effectiveTo: initialData.effectiveTo || '',
        schedule: initialData.schedule || {}
      });
    } else {
      // Initialize empty schedule structure
      const emptySchedule = {};
      daysOfWeek.forEach(day => {
        emptySchedule[day] = {};
        timeSlots.forEach(slot => {
          if (!slot.isBreak) {
            emptySchedule[day][slot.id] = {
              subjectId: null,
              room: '',
              notes: ''
            };
          }
        });
      });
      setFormData(prev => ({ ...prev, schedule: emptySchedule }));
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }
    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }
    if (!formData.effectiveFrom) {
      newErrors.effectiveFrom = 'Effective from date is required';
    }
    if (!formData.effectiveTo) {
      newErrors.effectiveTo = 'Effective to date is required';
    }

    // Check for teacher conflicts
    const teacherConflicts = [];
    const teacherSchedule = {};

    daysOfWeek.forEach(day => {
      timeSlots.forEach(slot => {
        if (slot.isBreak) return;
        
        const slotData = formData.schedule[day]?.[slot.id];
        if (slotData?.subjectId) {
          const subject = availableSubjects.find(s => s.id === parseInt(slotData.subjectId));
          if (subject) {
            const key = `${subject.teacher}-${day}-${slot.startTime}`;
            if (teacherSchedule[key]) {
              teacherConflicts.push({
                day,
                period: slot.label,
                teacher: subject.teacher,
                subject: subject.name
              });
            } else {
              teacherSchedule[key] = true;
            }
          }
        }
      });
    });

    if (teacherConflicts.length > 0) {
      newErrors.conflicts = 'Teacher scheduling conflicts detected';
      setConflicts(teacherConflicts);
    } else {
      setConflicts([]);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleScheduleChange = (day, slotId, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [slotId]: {
            ...prev.schedule[day]?.[slotId],
            [field]: value
          }
        }
      }
    }));
  };

  const copyDaySchedule = (fromDay, toDay) => {
    if (window.confirm(`Copy schedule from ${fromDay} to ${toDay}? This will overwrite existing schedule for ${toDay}.`)) {
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [toDay]: { ...prev.schedule[fromDay] }
        }
      }));
    }
  };

  const clearDaySchedule = (day) => {
    if (window.confirm(`Clear all schedule for ${day}?`)) {
      const clearedSchedule = {};
      timeSlots.forEach(slot => {
        if (!slot.isBreak) {
          clearedSchedule[slot.id] = {
            subjectId: null,
            room: '',
            notes: ''
          };
        }
      });
      
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [day]: clearedSchedule
        }
      }));
    }
  };

  const autoGenerateSchedule = () => {
    if (!window.confirm('This will auto-generate a balanced schedule. Continue?')) return;

    const newSchedule = {};
    const subjectHours = {};
    
    // Initialize subject hour counters
    availableSubjects.forEach(sub => subjectHours[sub.id] = 0);

    daysOfWeek.forEach(day => {
      newSchedule[day] = {};
      let dailySubjects = [];

      timeSlots.forEach(slot => {
        if (slot.isBreak) return;

        // Find subject with least hours that hasn't been used today
        let selectedSubject = availableSubjects
          .filter(s => !dailySubjects.includes(s.id) || dailySubjects.filter(id => id === s.id).length < 2)
          .sort((a, b) => subjectHours[a.id] - subjectHours[b.id])[0];

        if (selectedSubject) {
          newSchedule[day][slot.id] = {
            subjectId: selectedSubject.id,
            room: `Room ${Math.floor(Math.random() * 20) + 101}`,
            notes: ''
          };
          subjectHours[selectedSubject.id]++;
          dailySubjects.push(selectedSubject.id);
        }
      });
    });

    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving timetable:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectById = (id) => availableSubjects.find(s => s.id === parseInt(id));

  const inputClasses = (fieldName) => `
    w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-colors duration-200 outline-none
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {initialData ? 'Edit Timetable' : 'Create New Timetable'}
                </h1>
                <p className="mt-2 text-gray-600">
                  Configure class schedule, subjects, and time slots
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  type="button"
                  onClick={autoGenerateSchedule}
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 font-medium transition-colors"
                >
                  Auto-Generate
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Timetable
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className={inputClasses('className')}
                >
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                  ))}
                </select>
                {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={inputClasses('section')}
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D', 'E'].map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
                {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className={inputClasses('academicYear')}
                >
                  <option value="">Select Year</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
                {errors.academicYear && <p className="text-red-500 text-sm mt-1">{errors.academicYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester/Term
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={inputClasses('semester')}
                >
                  <option value="">Select Semester</option>
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                  <option value="Full Year">Full Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveFrom"
                  value={formData.effectiveFrom}
                  onChange={handleInputChange}
                  className={inputClasses('effectiveFrom')}
                />
                {errors.effectiveFrom && <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveTo"
                  value={formData.effectiveTo}
                  onChange={handleInputChange}
                  className={inputClasses('effectiveTo')}
                />
                {errors.effectiveTo && <p className="text-red-500 text-sm mt-1">{errors.effectiveTo}</p>}
              </div>
            </div>
          </div>

          {/* Conflict Warnings */}
          {conflicts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                <AlertCircle className="w-5 h-5" />
                Scheduling Conflicts Detected
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {conflicts.map((conflict, idx) => (
                  <li key={idx}>
                    • {conflict.teacher} is double-booked on {conflict.day} during {conflict.period} ({conflict.subject})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Schedule Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Schedule Builder
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Quick Actions:</span>
                <button
                  type="button"
                  onClick={() => copyDaySchedule(activeDay, prompt('Copy to which day?') || activeDay)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Copy Day
                </button>
                <button
                  type="button"
                  onClick={() => clearDaySchedule(activeDay)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Day
                </button>
              </div>
            </div>

            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeDay === day
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              {timeSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={`p-4 rounded-lg border ${
                    slot.isBreak 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{slot.label}</span>
                      <span className="text-sm text-gray-500">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {slot.isBreak && (
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                          BREAK
                        </span>
                      )}
                    </div>
                  </div>

                  {!slot.isBreak && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                        <select
                          value={formData.schedule[activeDay]?.[slot.id]?.subjectId || ''}
                          onChange={(e) => handleScheduleChange(activeDay, slot.id, 'subjectId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Subject</option>
                          {availableSubjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code}) - {subject.teacher}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Room/Location</label>
                        <input
                          type="text"
                          value={formData.schedule[activeDay]?.[slot.id]?.room || ''}
                          onChange={(e) => handleScheduleChange(activeDay, slot.id, 'room', e.target.value)}
                          placeholder="e.g., Room 101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                        <input
                          type="text"
                          value={formData.schedule[activeDay]?.[slot.id]?.notes || ''}
                          onChange={(e) => handleScheduleChange(activeDay, slot.id, 'notes', e.target.value)}
                          placeholder="Optional notes..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timetable Preview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                      {daysOfWeek.map(day => (
                        <th key={day} className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(slot => (
                      <tr key={slot.id}>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50">
                          {slot.startTime}-{slot.endTime}
                          <div className="text-xs text-gray-500">{slot.label}</div>
                        </td>
                        {daysOfWeek.map(day => (
                          <td key={day} className="border border-gray-300 px-4 py-2 text-sm">
                            {slot.isBreak ? (
                              <span className="text-yellow-600 font-medium">Break</span>
                            ) : (
                              (() => {
                                const slotData = formData.schedule[day]?.[slot.id];
                                const subject = slotData?.subjectId ? getSubjectById(slotData.subjectId) : null;
                                return subject ? (
                                  <div>
                                    <div className="font-medium text-gray-900">{subject.name}</div>
                                    <div className="text-xs text-gray-500">{subject.teacher}</div>
                                    {slotData.room && <div className="text-xs text-blue-600">{slotData.room}</div>}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
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
            </div>
          )}

          {/* Subject Legend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Subjects</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableSubjects.map(subject => (
                <div key={subject.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{subject.name}</p>
                    <p className="text-xs text-gray-500 truncate">{subject.teacher}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;