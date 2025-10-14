import React from 'react'

export default function ConferencesForm({ conferences, setConferences }) {
  const addConference = () => {
    setConferences([...conferences, { 
      title: '', isbn_no: '', volume: '', page_no: '', doi: '', 
      month: '', year: '', authors: '', indexing: '', publishers: '', 
      conference_name: '', in_cmrit_before_cmrit: '' 
    }])
  }

  const removeConference = (index) => {
    setConferences(conferences.filter((_, i) => i !== index))
  }

  const updateConference = (index, field, value) => {
    const updated = [...conferences]
    updated[index] = { ...updated[index], [field]: value }
    setConferences(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Conference Publications</h2>
        <button
          type="button"
          onClick={addConference}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Conference
        </button>
      </div>

      {conferences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <p className="text-gray-500">No conferences added yet. Click "Add Conference" to start.</p>
        </div>
      ) : (
        conferences.map((conference, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Conference Paper
              </h3>
              <button
                type="button"
                onClick={() => removeConference(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title *"
                value={conference.title}
                onChange={(e) => updateConference(index, 'title', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="ISBN Number"
                value={conference.isbn_no}
                onChange={(e) => updateConference(index, 'isbn_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Volume"
                value={conference.volume}
                onChange={(e) => updateConference(index, 'volume', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Page Number"
                value={conference.page_no}
                onChange={(e) => updateConference(index, 'page_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="DOI"
                value={conference.doi}
                onChange={(e) => updateConference(index, 'doi', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <select
                value={conference.month}
                onChange={(e) => updateConference(index, 'month', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                value={conference.year}
                onChange={(e) => updateConference(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Authors"
                value={conference.authors}
                onChange={(e) => updateConference(index, 'authors', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Indexing (e.g., IEEE, Springer)"
                value={conference.indexing}
                onChange={(e) => updateConference(index, 'indexing', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Publishers"
                value={conference.publishers}
                onChange={(e) => updateConference(index, 'publishers', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Conference Name"
                value={conference.conference_name}
                onChange={(e) => updateConference(index, 'conference_name', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <select
                value={conference.in_cmrit_before_cmrit}
                onChange={(e) => updateConference(index, 'in_cmrit_before_cmrit', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Publication Period</option>
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
