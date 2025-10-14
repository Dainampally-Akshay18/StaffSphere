import React from 'react'

export default function BooksForm({ books, setBooks }) {
  const addBook = () => {
    setBooks([...books, { 
      title: '', isbn_no: '', volume: '', page_no: '', doi: '', 
      month: '', year: '', authors: '', indexing: '', publishers: '', 
      in_cmrit: '', before_cmrit: '' 
    }])
  }

  const removeBook = (index) => {
    setBooks(books.filter((_, i) => i !== index))
  }

  const updateBook = (index, field, value) => {
    const updated = [...books]
    updated[index] = { ...updated[index], [field]: value }
    setBooks(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Books & Book Chapters</h2>
        <button
          type="button"
          onClick={addBook}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <p className="text-gray-500">No books added yet. Click "Add Book" to start.</p>
        </div>
      ) : (
        books.map((book, index) => (
          <div key={index} className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Book / Book Chapter
              </h3>
              <button
                type="button"
                onClick={() => removeBook(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title *"
                value={book.title}
                onChange={(e) => updateBook(index, 'title', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="ISBN Number"
                value={book.isbn_no}
                onChange={(e) => updateBook(index, 'isbn_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Volume"
                value={book.volume}
                onChange={(e) => updateBook(index, 'volume', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Page Number"
                value={book.page_no}
                onChange={(e) => updateBook(index, 'page_no', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="DOI"
                value={book.doi}
                onChange={(e) => updateBook(index, 'doi', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <select
                value={book.month}
                onChange={(e) => updateBook(index, 'month', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                value={book.year}
                onChange={(e) => updateBook(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Authors"
                value={book.authors}
                onChange={(e) => updateBook(index, 'authors', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Publishers"
                value={book.publishers}
                onChange={(e) => updateBook(index, 'publishers', e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <select
                value={book.in_cmrit}
                onChange={(e) => updateBook(index, 'in_cmrit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">In CMRIT?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <select
                value={book.before_cmrit}
                onChange={(e) => updateBook(index, 'before_cmrit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">Before CMRIT?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
