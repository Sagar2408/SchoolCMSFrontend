// src/components/classes/ClassForm.jsx
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { classService } from '../../services/class.service'
import toast from 'react-hot-toast'

export default function ClassForm() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await classService.create(data)
      toast.success('Class created successfully')
      navigate('/classes')
    } catch (error) {
      toast.error(error.message || 'Failed to create class')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Class</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
          <input {...register('name', { required: true })} className="input-field" placeholder="e.g., Class 10" />
          {errors.name && <span className="text-red-500 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numeric Value *</label>
          <input type="number" {...register('numeric_value', { required: true })} className="input-field" placeholder="10" />
          <p className="text-xs text-gray-500 mt-1">Used for ordering (1, 2, 3...)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea {...register('description')} className="input-field" rows="3"></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/classes')} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Create Class</button>
        </div>
      </form>
    </div>
  )
}