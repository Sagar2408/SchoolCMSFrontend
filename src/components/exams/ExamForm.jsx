// src/components/exams/ExamForm.jsx
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { examService } from '../../services/exam.service'
import toast from 'react-hot-toast'

export default function ExamForm() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      is_active: true
    }
  })

  const onSubmit = async (data) => {
    try {
      await examService.create(data)
      toast.success('Exam created successfully')
      navigate('/exams')
    } catch (error) {
      toast.error(error.message || 'Failed to create exam')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Exam</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
          <input {...register('name', { required: true })} className="input-field" placeholder="e.g., First Unit Test 2024" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
          <select {...register('type', { required: true })} className="input-field">
            <option value="">Select Type</option>
            <option value="unit_test">Unit Test</option>
            <option value="mid_term">Mid Term</option>
            <option value="final">Final Exam</option>
            <option value="quiz">Quiz</option>
            <option value="practical">Practical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
          <input {...register('academic_year', { required: true })} className="input-field" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" {...register('start_date')} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" {...register('end_date')} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea {...register('description')} className="input-field" rows="3"></textarea>
        </div>

        <div className="flex items-center">
          <input type="checkbox" {...register('is_active')} className="mr-2" />
          <label className="text-sm text-gray-700">Active</label>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/exams')} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Create Exam</button>
        </div>
      </form>
    </div>
  )
}