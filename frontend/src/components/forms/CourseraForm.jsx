import React from 'react'

export default function CourseraForm({ courseraNCourses, setCourseraNCourses }) {
  // ✅ FIX: Add defensive check for undefined
  const courses = courseraNCourses || []

  const addCourse = () => {
    setCourseraNCourses([...courses, {
      institute_offered: 'Coursera',
      course_title: '',
      duration: '',
      month: '',
      year: ''
    }])
  }

  const removeCourse = (index) => {
    setCourseraNCourses(courses.filter((_, i) => i !== index))
  }

  const updateCourse = (index, field, value) => {
    const updated = [...courses]
    updated[index] = { ...updated[index], [field]: value }
    setCourseraNCourses(updated)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span>📚</span> Coursera Certifications
      </h2>

      {courses.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg mb-6">
          <p className="text-sm">
            <span className="font-semibold">No Coursera courses added yet.</span> Click "Add Coursera Course" to start.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <button
                type="button"
                onClick={() => removeCourse(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-xl"
                title="Remove course"
              >
                ×
              </button>

              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Coursera Course {index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.course_title}
                    onChange={(e) => updateCourse(index, 'course_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={course.duration}
                    onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 4 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Completion Month
                  </label>
                  <select
                    value={course.month}
                    onChange={(e) => updateCourse(index, 'month', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Completion Year
                  </label>
                  <input
                    type="number"
                    value={course.year}
                    onChange={(e) => updateCourse(index, 'year', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2023"
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addCourse}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Add Coursera Course
      </button>
    </div>
  )
}
