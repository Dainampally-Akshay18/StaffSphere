import React from 'react'

export default function JournalsForm({ journals, setJournals }) {
  const addJournal = () => {
    setJournals([...journals, { 
      title: '', issn_no: '', volume: '', issue_no: '', page_no: '', 
      doi: '', month: '', year: '', authors: '', indexing: '', 
      publishers: '', journal_name: '', in_cmrit_before_cmrit: '' 
    }])
  }

  const removeJournal = (index) => {
    setJournals(journals.filter((_, i) => i !== index))
  }

  const updateJournal = (index, field, value) => {
    const updated = [...journals]
    updated[index] = { ...updated[index], [field]: value }
    setJournals(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Journal Publications</h2>
        <button
          type="button"
          onClick={addJournal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Journal
        </button>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <p className="text-gray-500">No journals added yet. Click "Add Journal" to start.</p>
        </div>
      ) : (
        journals.map((journal, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Journal Publication
              </h3>
              <button
                type="button"
                onClick={() => removeJournal(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title *"
                value={journal.title}
                onChange={(e) => updateJournal(index, 'title', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="ISSN Number"
                value={journal.issn_no}
                onChange={(e) => updateJournal(index, 'issn_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Volume"
                value={journal.volume}
                onChange={(e) => updateJournal(index, 'volume', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Issue Number"
                value={journal.issue_no}
                onChange={(e) => updateJournal(index, 'issue_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Page Number"
                value={journal.page_no}
                onChange={(e) => updateJournal(index, 'page_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="DOI"
                value={journal.doi}
                onChange={(e) => updateJournal(index, 'doi', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={journal.month}
                onChange={(e) => updateJournal(index, 'month', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                value={journal.year}
                onChange={(e) => updateJournal(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Authors"
                value={journal.authors}
                onChange={(e) => updateJournal(index, 'authors', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Indexing (e.g., SCI, Scopus)"
                value={journal.indexing}
                onChange={(e) => updateJournal(index, 'indexing', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Publishers"
                value={journal.publishers}
                onChange={(e) => updateJournal(index, 'publishers', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Journal Name"
                value={journal.journal_name}
                onChange={(e) => updateJournal(index, 'journal_name', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={journal.in_cmrit_before_cmrit}
                onChange={(e) => updateJournal(index, 'in_cmrit_before_cmrit', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
