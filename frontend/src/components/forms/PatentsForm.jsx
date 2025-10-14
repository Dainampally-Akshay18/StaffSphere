import React from 'react'

export default function PatentsForm({ patents, setPatents }) {
  const addPatent = () => {
    setPatents([...patents, { 
      title_of_invention: '', application_number: '', application_type: '', 
      date_of_filing: '', applicant_names: '', field_of_invention: '', 
      publication_date: '', application_status: '', country: '', 
      in_cmrit: '', before_cmrit: '' 
    }])
  }

  const removePatent = (index) => {
    setPatents(patents.filter((_, i) => i !== index))
  }

  const updatePatent = (index, field, value) => {
    const updated = [...patents]
    updated[index] = { ...updated[index], [field]: value }
    setPatents(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patents</h2>
        <button
          type="button"
          onClick={addPatent}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Patent
        </button>
      </div>

      {patents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <p className="text-gray-500">No patents added yet. Click "Add Patent" to start.</p>
        </div>
      ) : (
        patents.map((patent, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Patent
              </h3>
              <button
                type="button"
                onClick={() => removePatent(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title of Invention *"
                value={patent.title_of_invention}
                onChange={(e) => updatePatent(index, 'title_of_invention', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Application Number"
                value={patent.application_number}
                onChange={(e) => updatePatent(index, 'application_number', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                value={patent.application_type}
                onChange={(e) => updatePatent(index, 'application_type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Application Type</option>
                <option value="Filed">Filed</option>
                <option value="Published">Published</option>
                <option value="Granted">Granted</option>
              </select>
              <input
                type="date"
                placeholder="Date of Filing"
                value={patent.date_of_filing}
                onChange={(e) => updatePatent(index, 'date_of_filing', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="date"
                placeholder="Publication Date"
                value={patent.publication_date}
                onChange={(e) => updatePatent(index, 'publication_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Applicant Names"
                value={patent.applicant_names}
                onChange={(e) => updatePatent(index, 'applicant_names', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Field of Invention"
                value={patent.field_of_invention}
                onChange={(e) => updatePatent(index, 'field_of_invention', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                value={patent.application_status}
                onChange={(e) => updatePatent(index, 'application_status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Application Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="text"
                placeholder="Country"
                value={patent.country}
                onChange={(e) => updatePatent(index, 'country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                value={patent.in_cmrit}
                onChange={(e) => updatePatent(index, 'in_cmrit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
