// src/pages/admissions/NewAdmission.jsx
import AdmissionForm from '../../components/admissions/AdmissionForm'
import { admissionService } from '../../services/admission.service'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function NewAdmission() {
  const navigate = useNavigate()

  const handleCreateAdmission = async (data) => {
    try {
      // data is FormData coming from AdmissionForm
      const payload = new FormData()

      // 🔴 REQUIRED FIELD MAPPING (frontend → backend)
      payload.append('first_name', data.get('firstName'))
      payload.append('last_name', data.get('lastName'))
      payload.append('date_of_birth', data.get('dateOfBirth'))
      payload.append('gender', data.get('gender'))

      payload.append('parent_name', data.get('guardianName'))
      payload.append('parent_phone', data.get('guardianPhone'))
      payload.append('parent_email', data.get('guardianEmail'))

      // Backend expects class ID
      payload.append('applied_for_class_id', data.get('gradeApplying'))

      // 🔹 Contact & address (optional but useful)
      payload.append('email', data.get('email'))
      payload.append('phone', data.get('phone'))
      payload.append('address', data.get('address'))
      payload.append('city', data.get('city'))
      payload.append('state', data.get('state'))
      payload.append('pincode', data.get('zipCode'))

      // 🔹 Optional fields
      payload.append('previous_school', data.get('previousSchool'))
      payload.append('medical_notes', data.get('medicalNotes'))
      payload.append('emergency_contact', data.get('emergencyContact'))
      payload.append('emergency_phone', data.get('emergencyPhone'))

      // 📎 Documents (multiple files)
      data.getAll('documents').forEach((file) => {
        payload.append('documents', file)
      })

      // 🚀 API call
      await admissionService.create(payload)

      toast.success('Admission submitted successfully')
      navigate('/admissions')
    } catch (error) {
      console.error('Admission submission failed:', error)
      toast.error(
        error.response?.data?.message || 'Failed to submit admission'
      )
    }
  }

  return <AdmissionForm onSubmit={handleCreateAdmission} />
}