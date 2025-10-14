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
      // Load faculty profile
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_profile')
        .select('*')
        .eq('id', facultyId)
        .single()

      if (facultyError) throw facultyError

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {faculty?.first_name?.[0] || 'F'}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {faculty?.title} {faculty?.first_name} {faculty?.last_name}
                </h2>
                <p className="text-blue-100">{faculty?.designation} - {faculty?.department}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-4 overflow-x-auto">
                  {['personal', 'academic', 'research', 'publications', 'awards', 'certifications'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoCard label="Full Name" value={faculty?.full_name || `${faculty?.first_name} ${faculty?.last_name}`} />
                      <InfoCard label="Email" value={faculty?.email} />
                      <InfoCard label="Mobile" value={faculty?.mobile_number} />
                      <InfoCard label="Date of Birth" value={faculty?.date_of_birth} />
                      <InfoCard label="Gender" value={faculty?.gender} />
                      <InfoCard label="Address" value={faculty?.address} className="md:col-span-2" />
                      <InfoCard label="District" value={faculty?.district} />
                      <InfoCard label="State" value={faculty?.state} />
                      <InfoCard label="Pin Code" value={faculty?.pin_no} />
                    </div>
                  </div>
                )}

                {/* Academic Tab */}
                {activeTab === 'academic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoCard label="UG Specialization" value={faculty?.ug_specialization} />
                      <InfoCard label="PG Specialization" value={faculty?.pg_specialization} />
                      <InfoCard label="PhD Specialization" value={faculty?.phd_specialization} />
                      <InfoCard label="PhD Completion Year" value={faculty?.phd_completed_year} />
                      <InfoCard label="PDF Specialization" value={faculty?.pdf_specialization} className="md:col-span-2" />
                      <InfoCard label="Guideship Details" value={faculty?.guideship_details} className="md:col-span-2" />
                      <InfoCard label="Pursuing PhD Details" value={faculty?.pursuing_phd_details} className="md:col-span-2" />
                      <InfoCard label="Funded Projects" value={faculty?.funded_projects} className="md:col-span-2" />
                    </div>
                  </div>
                )}

                {/* Research Tab */}
                {activeTab === 'research' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Research Identifiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoCard label="ORCID ID" value={faculty?.orcid_id} isLink />
                      <InfoCard label="Scopus ID" value={faculty?.scopus_id} isLink />
                      <InfoCard label="Google Scholar" value={faculty?.google_scholar_id} isLink />
                      <InfoCard label="Researcher ID" value={faculty?.researcher_id} isLink />
                      <InfoCard label="Vidwan ID" value={faculty?.vidwan_id} />
                      <InfoCard label="CMRIT IRINS Profile" value={faculty?.cmrit_irins_profile_link} isLink />
                    </div>
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Expertise</h3>
                      <InfoCard label="Expertise Areas" value={faculty?.expertise} />
                      <InfoCard label="Brief Expertise" value={faculty?.brief_expertise} className="mt-4" />
                      <InfoCard label="Editorial Memberships" value={faculty?.editorial_member} className="mt-4" />
                      <InfoCard label="Professional Body Memberships" value={faculty?.professional_body_memberships} className="mt-4" />
                    </div>
                  </div>
                )}

                {/* Publications Tab */}
                {activeTab === 'publications' && (
                  <div className="space-y-6">
                    {/* Journals */}
                    <Section title="Journal Publications" count={faculty?.journals?.length}>
                      {faculty?.journals?.map((journal, idx) => (
                        <PublicationCard key={idx} data={journal} type="journal" />
                      ))}
                    </Section>

                    {/* Conferences */}
                    <Section title="Conference Publications" count={faculty?.conferences?.length}>
                      {faculty?.conferences?.map((conf, idx) => (
                        <PublicationCard key={idx} data={conf} type="conference" />
                      ))}
                    </Section>

                    {/* Books */}
                    <Section title="Books & Book Chapters" count={faculty?.books?.length}>
                      {faculty?.books?.map((book, idx) => (
                        <PublicationCard key={idx} data={book} type="book" />
                      ))}
                    </Section>
                  </div>
                )}

                {/* Awards Tab */}
                {activeTab === 'awards' && (
                  <div className="space-y-6">
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
                  <div className="space-y-6">
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
    </div>
  )
}

// Helper Components
const InfoCard = ({ label, value, isLink, className = '' }) => (
  <div className={`${className}`}>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
        {value}
      </a>
    ) : (
      <p className="text-gray-900">{value || 'N/A'}</p>
    )}
  </div>
)

const Section = ({ title, count, children }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">
      {title} {count > 0 && <span className="text-sm text-gray-500">({count})</span>}
    </h3>
    {count === 0 ? (
      <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} added yet</p>
    ) : (
      <div className="space-y-4">{children}</div>
    )}
  </div>
)

const PublicationCard = ({ data, type }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 className="font-semibold text-gray-900 mb-2">{data.title}</h4>
    <div className="text-sm text-gray-600 space-y-1">
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
  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
    <h4 className="font-semibold text-gray-900 mb-2">{data.title_of_award}</h4>
    <div className="text-sm text-gray-600 space-y-1">
      {data.award_given_by && <p><strong>Awarded By:</strong> {data.award_given_by}</p>}
      {data.year && <p><strong>Year:</strong> {data.year}</p>}
      {data.international_national && <p><strong>Level:</strong> {data.international_national}</p>}
    </div>
  </div>
)

const PatentCard = ({ data }) => (
  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
    <h4 className="font-semibold text-gray-900 mb-2">{data.title_of_invention}</h4>
    <div className="text-sm text-gray-600 space-y-1">
      {data.application_number && <p><strong>Application No:</strong> {data.application_number}</p>}
      {data.application_status && <p><strong>Status:</strong> {data.application_status}</p>}
      {data.date_of_filing && <p><strong>Filed:</strong> {data.date_of_filing}</p>}
      {data.country && <p><strong>Country:</strong> {data.country}</p>}
    </div>
  </div>
)

const CertificationCard = ({ data }) => (
  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
    <h4 className="font-semibold text-gray-900 mb-2">{data.course_title}</h4>
    <div className="text-sm text-gray-600 space-y-1">
      {data.institute_offered && <p><strong>Platform:</strong> {data.institute_offered}</p>}
      {data.duration && <p><strong>Duration:</strong> {data.duration}</p>}
      {data.year && <p><strong>Completed:</strong> {data.month} {data.year}</p>}
    </div>
  </div>
)
