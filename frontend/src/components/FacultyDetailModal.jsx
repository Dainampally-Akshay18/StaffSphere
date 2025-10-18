import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export default function FacultyDetailModal({ facultyId, isOpen, onClose }) {
  const [faculty, setFaculty] = useState(null)
  const [personalDetails, setPersonalDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    if (isOpen && facultyId) {
      loadFacultyDetails()
    }
  }, [isOpen, facultyId])

  const loadFacultyDetails = async () => {
    setLoading(true)
    try {
      // Load faculty profile
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_profile')
        .select('*')
        .eq('id', facultyId)
        .single()

      if (facultyError) throw facultyError

      // Load personal details from separate table
      const { data: personalData, error: personalError } = await supabase
        .from('personal_details')
        .select('*')
        .eq('faculty_id', facultyId)
        .single()

      console.log('Faculty Data:', facultyData)
      console.log('Personal Details Data:', personalData)

      // Load all related data
      const [journals, conferences, books, awards, patents, certs] = await Promise.all([
        supabase.from('journals').select('*').eq('faculty_id', facultyId),
        supabase.from('conferences').select('*').eq('faculty_id', facultyId),
        supabase.from('books').select('*').eq('faculty_id', facultyId),
        supabase.from('awards').select('*').eq('faculty_id', facultyId),
        supabase.from('patents').select('*').eq('faculty_id', facultyId),
        supabase.from('online_certifications').select('*').eq('faculty_id', facultyId)
      ])

      console.log('Journals:', journals.data)
      console.log('Conferences:', conferences.data)
      console.log('Books:', books.data)
      console.log('Awards:', awards.data)
      console.log('Patents:', patents.data)
      console.log('Certifications:', certs.data)

      // ✅ FIX: Set personal details separately
      setPersonalDetails(personalData)

      // ✅ FIX: Combine faculty data with all related data in ONE setState call
      setFaculty({
        ...facultyData,
        journals: journals.data || [],
        conferences: conferences.data || [],
        books: books.data || [],
        awards: awards.data || [],
        patents: patents.data || [],
        certifications: certs.data || []
      })

    } catch (error) {
      console.error('Error loading faculty details:', error)
      toast.error('Failed to load faculty details')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'publications', label: 'Publications', icon: '📚' },
    { id: 'awards', label: 'Awards', icon: '🏆' },
    { id: 'certifications', label: 'Certifications', icon: '📜' },
  ]

  const InfoRow = ({ label, value, isLink = false }) => (
    <div className="mb-3">
      <span className="text-gray-600 font-medium">{label}:</span>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
          {value}
        </a>
      ) : (
        <span className="ml-2 text-gray-900">{value || 'N/A'}</span>
      )}
    </div>
  )

  const ListSection = ({ title, data, type }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      {(!data || data.length === 0) ? (
        <p className="text-gray-500 italic">No {title.toLowerCase()} added yet</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">{item.title || item.title_of_award || item.title_of_invention || item.course_title}</h4>
              
              {type === 'journal' && item.journal_name && (
                <p className="text-sm text-gray-700 mb-1"><strong>Journal:</strong> {item.journal_name}</p>
              )}
              {type === 'journal' && item.authors && (
                <p className="text-sm text-gray-700 mb-1"><strong>Authors:</strong> {item.authors}</p>
              )}
              
              {type === 'conference' && item.conference_name && (
                <p className="text-sm text-gray-700 mb-1"><strong>Conference:</strong> {item.conference_name}</p>
              )}
              
              {item.year && (
                <p className="text-sm text-gray-700 mb-1"><strong>Year:</strong> {item.year}</p>
              )}
              
              {item.doi && (
                <p className="text-sm text-gray-700 mb-1"><strong>DOI:</strong> {item.doi}</p>
              )}
              
              {item.indexing && (
                <p className="text-sm text-gray-700 mb-1"><strong>Indexing:</strong> {item.indexing}</p>
              )}
              
              {item.award_given_by && (
                <p className="text-sm text-gray-700 mb-1"><strong>Awarded By:</strong> {item.award_given_by}</p>
              )}
              
              {item.international_national && (
                <p className="text-sm text-gray-700 mb-1"><strong>Level:</strong> {item.international_national}</p>
              )}
              
              {item.application_number && (
                <p className="text-sm text-gray-700 mb-1"><strong>Application No:</strong> {item.application_number}</p>
              )}
              
              {item.application_status && (
                <p className="text-sm text-gray-700 mb-1"><strong>Status:</strong> {item.application_status}</p>
              )}
              
              {item.date_of_filing && (
                <p className="text-sm text-gray-700 mb-1"><strong>Filed:</strong> {item.date_of_filing}</p>
              )}
              
              {item.country && (
                <p className="text-sm text-gray-700 mb-1"><strong>Country:</strong> {item.country}</p>
              )}
              
              {item.institute_offered && (
                <p className="text-sm text-gray-700 mb-1"><strong>Platform:</strong> {item.institute_offered}</p>
              )}
              
              {item.duration && (
                <p className="text-sm text-gray-700 mb-1"><strong>Duration:</strong> {item.duration}</p>
              )}
              
              {item.month && item.year && (
                <p className="text-sm text-gray-700 mb-1"><strong>Completed:</strong> {item.month} {item.year}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {faculty?.title} {faculty?.first_name} {faculty?.last_name}
            </h2>
            <p className="text-blue-100 mt-1">
              {faculty?.designation} - {faculty?.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Personal Tab */}
              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Email" value={faculty?.email} isLink={false} />
                    <InfoRow label="Mobile" value={faculty?.mobile_number} />
                    <InfoRow label="Date of Birth" value={faculty?.date_of_birth} />
                    <InfoRow label="Gender" value={faculty?.gender} />
                    <InfoRow label="Address" value={faculty?.address} />
                    <InfoRow label="District" value={faculty?.district} />
                    <InfoRow label="State" value={faculty?.state} />
                    <InfoRow label="PIN" value={faculty?.pin_no} />
                  </div>
                </div>
              )}

              {/* Academic Tab */}
              {activeTab === 'academic' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Academic Qualifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="UG Specialization" value={personalDetails?.ug_specialization} />
                    <InfoRow label="PG Specialization" value={personalDetails?.pg_specialization} />
                    <InfoRow label="PhD Specialization" value={personalDetails?.phd_specialization} />
                    <InfoRow label="PhD Completion Year" value={personalDetails?.phd_completed_year} />
                    <InfoRow label="PDF Specialization" value={personalDetails?.pdf_specialization} />
                    <InfoRow label="Guideship Details" value={personalDetails?.guideship_details} />
                    <InfoRow label="Pursuing PhD Details" value={personalDetails?.pursuing_phd_details} />
                    <InfoRow label="Funded Projects" value={personalDetails?.funded_projects} />
                  </div>

                  <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Professional Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Total Experience (Years)" value={personalDetails?.experience_years} />
                    <InfoRow label="Editorial Memberships" value={personalDetails?.editorial_member} />
                    <InfoRow label="Professional Body Memberships" value={personalDetails?.professional_body_memberships} />
                  </div>
                </div>
              )}

              {/* Research Tab */}
              {activeTab === 'research' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Research Identifiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="ORCID ID" value={faculty?.orcid_id} />
                    <InfoRow label="Scopus ID" value={faculty?.scopus_id} isLink={true} />
                    <InfoRow label="Google Scholar" value={personalDetails?.google_scholar_link} isLink={true} />
                    <InfoRow label="Researcher ID" value={faculty?.researcher_id} />
                    <InfoRow label="Vidwan ID" value={personalDetails?.vidwan_id} />
                    <InfoRow label="CMRIT IRINS Profile" value={personalDetails?.cmrit_irins_link} isLink={true} />
                  </div>

                  <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Expertise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Expertise Areas" value={faculty?.expertise} />
                    <InfoRow label="Brief Expertise" value={faculty?.brief_expertise} />
                  </div>
                </div>
              )}

              {/* Publications Tab */}
              {activeTab === 'publications' && (
                <div>
                  <ListSection title="Journal Publications" data={faculty?.journals} type="journal" />
                  <ListSection title="Conference Publications" data={faculty?.conferences} type="conference" />
                  <ListSection title="Books & Book Chapters" data={faculty?.books} type="book" />
                </div>
              )}

              {/* Awards Tab */}
              {activeTab === 'awards' && (
                <div>
                  <ListSection title="Awards & Recognition" data={faculty?.awards} type="award" />
                  <ListSection title="Patents" data={faculty?.patents} type="patent" />
                </div>
              )}

              {/* Certifications Tab */}
              {activeTab === 'certifications' && (
                <div>
                  <ListSection title="Online Certifications" data={faculty?.certifications} type="certification" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
