import React from 'react'

export default function AwardsForm({ awards, setAwards }) {
  const addAward = () => {
    setAwards([...awards, { 
      faculty_name: '', title_of_award: '', academic_year: '', 
      month: '', year: '', award_given_by: '', international_national: '', 
      in_cmrit: '', before_cmrit: '' 
    }])
  }

  const removeAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index))
  }

  const updateAward = (index, field, value) => {
    const updated = [...awards]
    updated[index] = { ...updated[index], [field]: value }
    setAwards(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Awards & Recognition</h2>
        <button
          type="button"
          onClick={addAward}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Award
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
          <p className="text-gray-500">No awards added yet. Click "Add Award" to start.</p>
        </div>
      ) : (
        awards.map((award, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Award
              </h3>
              <button
                type="button"
                onClick={() => removeAward(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Faculty Name"
                value={award.faculty_name}
                onChange={(e) => updateAward(index, 'faculty_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                placeholder="Academic Year (e.g., 2023-24)"
                value={award.academic_year}
                onChange={(e) => updateAward(index, 'academic_year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                placeholder="Title of Award *"
                value={award.title_of_award}
                onChange={(e) => updateAward(index, 'title_of_award', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <select
                value={award.month}
                onChange={(e) => updateAward(index, 'month', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                value={award.year}
                onChange={(e) => updateAward(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                placeholder="Award Given By"
                value={award.award_given_by}
                onChange={(e) => updateAward(index, 'award_given_by', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <select
                value={award.international_national}
                onChange={(e) => updateAward(index, 'international_national', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Level</option>
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="State">State</option>
              </select>
              <select
                value={award.in_cmrit}
                onChange={(e) => updateAward(index, 'in_cmrit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Period</option>
                <option value="In CMRIT">In CMRIT</option>
                <option value="Before CMRIT">Before CMRIT</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
