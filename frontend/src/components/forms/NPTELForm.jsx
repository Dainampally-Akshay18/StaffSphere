import React from 'react'

export default function NPTELForm({ courses, setCourses }) {
  const addCourse = () => {
    setCourses([...courses, { 
      institute_offered: 'NPTEL', course_title: '', duration: '', 
      month: '', year: '' 
    }])
  }

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const updateCourse = (index, field, value) => {
    const updated = [...courses]
    updated[index] = { ...updated[index], [field]: value }
    setCourses(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">NPTEL Certifications</h2>
        <button
          type="button"
          onClick={addCourse}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add NPTEL Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-gray-500">No NPTEL courses added yet. Click "Add NPTEL Course" to start.</p>
        </div>
      ) : (
        courses.map((course, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border-2 border-teal-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                NPTEL Course
              </h3>
              <button
                type="button"
                onClick={() => removeCourse(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Title *"
                value={course.course_title}
                onChange={(e) => updateCourse(index, 'course_title', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 12 weeks)"
                value={course.duration}
                onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <select
                value={course.month}
                onChange={(e) => updateCourse(index, 'month', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Month Completed</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year Completed"
                value={course.year}
                onChange={(e) => updateCourse(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
