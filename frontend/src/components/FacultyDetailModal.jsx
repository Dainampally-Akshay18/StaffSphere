import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export default function FacultyDetailModal({ facultyId, isOpen, onClose }) {
  const [faculty, setFaculty] = useState(null)
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
      // Load faculty profile with ALL fields
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_profile')
        .select('*')
        .eq('id', facultyId)
        .single()

      if (facultyError) throw facultyError

      console.log('Faculty Data Loaded:', facultyData) // Debug log

      // Load all related data
      const [journals, conferences, books, awards, patents, certs] = await Promise.all([
        supabase.from('journals').select('*').eq('faculty_id', facultyId),
        supabase.from('conferences').select('*').eq('faculty_id', facultyId),
        supabase.from('books').select('*').eq('faculty_id', facultyId),
        supabase.from('awards').select('*').eq('faculty_id', facultyId),
        supabase.from('patents').select('*').eq('faculty_id', facultyId),
        supabase.from('online_certifications').select('*').eq('faculty_id', facultyId)
      ])

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-blue-600 flex-shrink-0">
                {faculty?.first_name?.[0] || 'F'}
              </div>
              <div className="text-white min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold truncate">
                  {faculty?.title} {faculty?.first_name} {faculty?.last_name}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 truncate">{faculty?.designation} - {faculty?.department}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Tabs - Mobile Responsive */}
              <div className="border-b border-gray-200 px-2 sm:px-6 bg-white flex-shrink-0">
                <div className="flex gap-1 sm:gap-4 overflow-x-auto hide-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.substring(0, 4)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <InfoCard label="Full Name" value={faculty?.full_name || `${faculty?.first_name} ${faculty?.last_name}`} />
                      <InfoCard label="Email" value={faculty?.email} />
                      <InfoCard label="Mobile" value={faculty?.mobile_number} />
                      <InfoCard label="Date of Birth" value={faculty?.date_of_birth} />
                      <InfoCard label="Gender" value={faculty?.gender} />
                      <InfoCard label="Address" value={faculty?.address} className="sm:col-span-2" />
                      <InfoCard label="District" value={faculty?.district} />
                      <InfoCard label="State" value={faculty?.state} />
                      <InfoCard label="Pin Code" value={faculty?.pin_no} />
                    </div>
                  </div>
                )}

                {/* Academic Tab - FIXED */}
                {activeTab === 'academic' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Academic Qualifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <InfoCard label="UG Specialization" value={faculty?.ug_specialization} />
                      <InfoCard label="PG Specialization" value={faculty?.pg_specialization} />
                      <InfoCard label="PhD Specialization" value={faculty?.phd_specialization} />
                      <InfoCard label="PhD Completion Year" value={faculty?.phd_completed_year} />
                      <InfoCard label="PDF Specialization" value={faculty?.pdf_specialization} className="sm:col-span-2" />
                      <InfoCard label="Guideship Details" value={faculty?.guideship_details} className="sm:col-span-2" />
                      <InfoCard label="Pursuing PhD Details" value={faculty?.pursuing_phd_details} className="sm:col-span-2" />
                      <InfoCard label="Funded Projects" value={faculty?.funded_projects} className="sm:col-span-2" />
                    </div>

                    <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Professional Experience</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <InfoCard label="Total Experience (Years)" value={faculty?.experience_years} />
                        <InfoCard label="Editorial Memberships" value={faculty?.editorial_member} />
                        <InfoCard label="Professional Body Memberships" value={faculty?.professional_body_memberships} className="sm:col-span-2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Research Tab */}
                {activeTab === 'research' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Research Identifiers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <InfoCard label="ORCID ID" value={faculty?.orcid_id} isLink />
                      <InfoCard label="Scopus ID" value={faculty?.scopus_id} isLink />
                      <InfoCard label="Google Scholar" value={faculty?.google_scholar_id} isLink />
                      <InfoCard label="Researcher ID" value={faculty?.researcher_id} isLink />
                      <InfoCard label="Vidwan ID" value={faculty?.vidwan_id} />
                      <InfoCard label="CMRIT IRINS Profile" value={faculty?.cmrit_irins_profile_link} isLink />
                    </div>
                    <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Expertise</h4>
                      <InfoCard label="Expertise Areas" value={faculty?.expertise} />
                      <InfoCard label="Brief Expertise" value={faculty?.brief_expertise} className="mt-3 sm:mt-4" />
                    </div>
                  </div>
                )}

                {/* Publications Tab */}
                {activeTab === 'publications' && (
                  <div className="space-y-4 sm:space-y-6">
                    <Section title="Journal Publications" count={faculty?.journals?.length}>
                      {faculty?.journals?.map((journal, idx) => (
                        <PublicationCard key={idx} data={journal} type="journal" />
                      ))}
                    </Section>

                    <Section title="Conference Publications" count={faculty?.conferences?.length}>
                      {faculty?.conferences?.map((conf, idx) => (
                        <PublicationCard key={idx} data={conf} type="conference" />
                      ))}
                    </Section>

                    <Section title="Books & Book Chapters" count={faculty?.books?.length}>
                      {faculty?.books?.map((book, idx) => (
                        <PublicationCard key={idx} data={book} type="book" />
                      ))}
                    </Section>
                  </div>
                )}

                {/* Awards Tab */}
                {activeTab === 'awards' && (
                  <div className="space-y-4 sm:space-y-6">
                    <Section title="Awards & Recognition" count={faculty?.awards?.length}>
                      {faculty?.awards?.map((award, idx) => (
                        <AwardCard key={idx} data={award} />
                      ))}
                    </Section>

                    <Section title="Patents" count={faculty?.patents?.length}>
                      {faculty?.patents?.map((patent, idx) => (
                        <PatentCard key={idx} data={patent} />
                      ))}
                    </Section>
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                  <div className="space-y-4 sm:space-y-6">
                    <Section title="Online Certifications" count={faculty?.certifications?.length}>
                      {faculty?.certifications?.map((cert, idx) => (
                        <CertificationCard key={idx} data={cert} />
                      ))}
                    </Section>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

// Helper Components - Mobile Responsive
const InfoCard = ({ label, value, isLink, className = '' }) => (
  <div className={`${className}`}>
    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{label}</p>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm sm:text-base">
        {value}
      </a>
    ) : (
      <p className="text-gray-900 break-words text-sm sm:text-base">{value || 'N/A'}</p>
    )}
  </div>
)

const Section = ({ title, count, children }) => (
  <div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
      {title} {count > 0 && <span className="text-xs sm:text-sm text-gray-500">({count})</span>}
    </h3>
    {count === 0 ? (
      <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No {title.toLowerCase()} added yet</p>
    ) : (
      <div className="space-y-3 sm:space-y-4">{children}</div>
    )}
  </div>
)

const PublicationCard = ({ data, type }) => (
  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{data.title}</h4>
    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
      {data.authors && <p><strong>Authors:</strong> {data.authors}</p>}
      {type === 'journal' && data.journal_name && <p><strong>Journal:</strong> {data.journal_name}</p>}
      {type === 'conference' && data.conference_name && <p><strong>Conference:</strong> {data.conference_name}</p>}
      {data.year && <p><strong>Year:</strong> {data.year}</p>}
      {data.doi && <p><strong>DOI:</strong> {data.doi}</p>}
      {data.indexing && <p><strong>Indexing:</strong> {data.indexing}</p>}
    </div>
  </div>
)

const AwardCard = ({ data }) => (
  <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{data.title_of_award}</h4>
    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
      {data.award_given_by && <p><strong>Awarded By:</strong> {data.award_given_by}</p>}
      {data.year && <p><strong>Year:</strong> {data.year}</p>}
      {data.international_national && <p><strong>Level:</strong> {data.international_national}</p>}
    </div>
  </div>
)

const PatentCard = ({ data }) => (
  <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{data.title_of_invention}</h4>
    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
      {data.application_number && <p><strong>Application No:</strong> {data.application_number}</p>}
      {data.application_status && <p><strong>Status:</strong> {data.application_status}</p>}
      {data.date_of_filing && <p><strong>Filed:</strong> {data.date_of_filing}</p>}
      {data.country && <p><strong>Country:</strong> {data.country}</p>}
    </div>
  </div>
)

const CertificationCard = ({ data }) => (
  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{data.course_title}</h4>
    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
      {data.institute_offered && <p><strong>Platform:</strong> {data.institute_offered}</p>}
      {data.duration && <p><strong>Duration:</strong> {data.duration}</p>}
      {data.year && <p><strong>Completed:</strong> {data.month} {data.year}</p>}
    </div>
  </div>
)
