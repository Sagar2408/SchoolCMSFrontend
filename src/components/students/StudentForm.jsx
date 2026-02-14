// src/components/students/StudentForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { studentService } from '../../services/student.service'
import { classService } from '../../services/class.service'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'

export default function StudentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(isEdit)
  
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm()

  const selectedClass = watch('class_id')

  useEffect(() => {
    loadClasses()
    if (isEdit) loadStudent()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find(c => c.id == selectedClass)
      setSections(cls?.sections || [])
      if (!isEdit) setValue('section_id', '')
    }
  }, [selectedClass])

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      setClasses(response.data)
    } catch (error) {
      toast.error('Failed to load classes')
    }
  }

  const loadStudent = async () => {
    try {
      const response = await studentService.getById(id)
      const student = response.data
      reset({
        ...student,
        date_of_birth: student.date_of_birth?.split('T')[0],
        admission_date: student.admission_date?.split('T')[0]
      })
      setSections(student.Class?.sections || [])
    } catch (error) {
      toast.error('Failed to load student')
      navigate('/students')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await studentService.update(id, data)
        toast.success('Student updated successfully')
      } else {
        await studentService.create(data)
        toast.success('Student created successfully')
      }
      navigate('/students')
    } catch (error) {
      toast.error(error.message || 'Operation failed')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Student' : 'Add New Student'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input {...register('first_name', { required: true })} className="input-field" />
            {errors.first_name && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input {...register('last_name', { required: true })} className="input-field" />
            {errors.last_name && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input type="date" {...register('date_of_birth', { required: true })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select {...register('gender', { required: true })} className="input-field">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select {...register('blood_group')} className="input-field">
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Class Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select {...register('class_id', { required: true })} className="input-field">
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select {...register('section_id', { required: true })} className="input-field" disabled={!selectedClass}>
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input {...register('roll_number')} className="input-field" placeholder="Auto-generated if empty" />
          </div>

          {/* Parent Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Parent Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name *</label>
            <input {...register('parent_name', { required: true })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone *</label>
            <input {...register('parent_phone', { required: true })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
            <input type="email" {...register('parent_email')} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Occupation</label>
            <input {...register('parent_occupation')} className="input-field" />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Address</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea {...register('address')} className="input-field" rows="3"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input {...register('city')} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input {...register('state')} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input {...register('pincode')} className="input-field" />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={() => navigate('/students')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  )
}