// src/components/classes/ClassList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { classService } from '../../services/class.service'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'

export default function ClassList() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedClass, setExpandedClass] = useState(null)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      setClasses(response.data || [])
    } catch (error) {
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await classService.delete(id)
      toast.success('Class deleted')
      loadClasses()
    } catch (error) {
      toast.error(error.message || 'Failed to delete')
    }
  }

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Delete this section?')) return
    try {
      await classService.deleteSection(id)
      toast.success('Section deleted')
      loadClasses()
    } catch (error) {
      toast.error('Failed to delete section')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Classes & Sections</h1>
        <button onClick={() => navigate('/classes/new')} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Class
        </button>
      </div>

      <div className="space-y-4">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
            >
              <div className="flex items-center">
                {expandedClass === cls.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <h3 className="ml-2 text-lg font-semibold">{cls.name}</h3>
                <span className="ml-4 text-sm text-gray-500">({cls.sections?.length || 0} sections)</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(cls.id) }}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {expandedClass === cls.id && (
              <div className="px-4 pb-4">
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Sections</h4>
                  </div>
                  
                  {cls.sections?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No sections created yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {cls.sections.map(section => (
                        <div key={section.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Section {section.name}</span>
                            <span className="ml-2 text-sm text-gray-500">Capacity: {section.capacity}</span>
                            {section.room_number && <span className="ml-2 text-sm text-gray-500">Room: {section.room_number}</span>}
                          </div>
                          <button 
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <SectionForm classId={cls.id} onSuccess={loadClasses} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Inline Section Form Component
function SectionForm({ classId, onSuccess }) {
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState(40)
  const [roomNumber, setRoomNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await classService.createSection(classId, { name, capacity, room_number: roomNumber })
      toast.success('Section created')
      setName('')
      setCapacity(40)
      setRoomNumber('')
      onSuccess()
    } catch (error) {
      toast.error(error.message || 'Failed to create section')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-3 items-end border-t pt-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Section Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="input-field w-32" 
          placeholder="A"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Capacity</label>
        <input 
          type="number" 
          value={capacity} 
          onChange={(e) => setCapacity(e.target.value)} 
          className="input-field w-24" 
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Room No</label>
        <input 
          value={roomNumber} 
          onChange={(e) => setRoomNumber(e.target.value)} 
          className="input-field w-32" 
          placeholder="101"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Creating...' : 'Add Section'}
      </button>
    </form>
  )
}