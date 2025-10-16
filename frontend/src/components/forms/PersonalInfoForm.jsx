import React from 'react'

export default function PersonalInfoForm({ formData, handleChange, errors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl">👤</span>
        Personal Information
      </h2>
      
      {/* Basic Personal Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <select name="title" value={formData.title} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base">
              <option value="">Select</option>
              {['Dr', 'Mr', 'Ms', 'Mrs', 'Prof'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" required />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" required />
            {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base">
              <option value="">Select</option>
              {['Male', 'Female', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" required />
            {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" required />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="2"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            placeholder="Enter full address"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <input type="text" id="district" name="district" value={formData.district} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
          <div>
            <label htmlFor="pinNo" className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
            <input type="text" id="pinNo" name="pinNo" value={formData.pinNo} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
        </div>
      </div>

      {/* Academic Qualifications Section */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          Academic Qualifications
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="ugSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
              UG Specialization
            </label>
            <input type="text" id="ugSpecialization" name="ugSpecialization" value={formData.ugSpecialization} onChange={handleChange}
              placeholder="e.g., B.E in Computer Science"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="pgSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
              PG Specialization
            </label>
            <input type="text" id="pgSpecialization" name="pgSpecialization" value={formData.pgSpecialization} onChange={handleChange}
              placeholder="e.g., M.Tech in AI & ML"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phdSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
                PhD Specialization
              </label>
              <input type="text" id="phdSpecialization" name="phdSpecialization" value={formData.phdSpecialization} onChange={handleChange}
                placeholder="e.g., Machine Learning"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="phdCompletedYear" className="block text-sm font-medium text-gray-700 mb-2">
                PhD Completion Year
              </label>
              <input type="number" id="phdCompletedYear" name="phdCompletedYear" value={formData.phdCompletedYear} onChange={handleChange}
                placeholder="2020"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
            </div>
          </div>

          <div>
            <label htmlFor="pdfSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
              PDF (Post-Doctoral Fellowship) Specialization
            </label>
            <input type="text" id="pdfSpecialization" name="pdfSpecialization" value={formData.pdfSpecialization} onChange={handleChange}
              placeholder="Post-Doctoral research specialization"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="guideshipDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Guideship Details
            </label>
            <textarea id="guideshipDetails" name="guideshipDetails" value={formData.guideshipDetails} onChange={handleChange} rows="3"
              placeholder="Details about students guided for PhD/M.Tech"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"></textarea>
          </div>

          <div>
            <label htmlFor="pursuingPhdDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Pursuing PhD Details
            </label>
            <textarea id="pursuingPhdDetails" name="pursuingPhdDetails" value={formData.pursuingPhdDetails} onChange={handleChange} rows="2"
              placeholder="Details about current PhD students"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"></textarea>
          </div>

          <div>
            <label htmlFor="fundedProjects" className="block text-sm font-medium text-gray-700 mb-2">
              Funded Projects
            </label>
            <textarea id="fundedProjects" name="fundedProjects" value={formData.fundedProjects} onChange={handleChange} rows="3"
              placeholder="List of funded research projects"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"></textarea>
          </div>
        </div>
      </div>

      {/* Professional Experience Section */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">💼</span>
          Professional Experience
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
              Total Experience (in years)
            </label>
            <input type="number" id="experienceYears" name="experienceYears" value={formData.experienceYears} onChange={handleChange}
              placeholder="15"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="editorialMember" className="block text-sm font-medium text-gray-700 mb-2">
              Editorial Memberships
            </label>
            <input type="text" id="editorialMember" name="editorialMember" value={formData.editorialMember} onChange={handleChange}
              placeholder="Journal names where you are an editorial member"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="professionalBodyMemberships" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Body Memberships
            </label>
            <textarea id="professionalBodyMemberships" name="professionalBodyMemberships" value={formData.professionalBodyMemberships} onChange={handleChange} rows="3"
              placeholder="e.g., IEEE, ACM, CSI"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"></textarea>
          </div>
        </div>
      </div>

      {/* Research Profile Links Section - UPDATED FIELD NAMES */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          Research Profile Links
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="vidwanId" className="block text-sm font-medium text-gray-700 mb-2">
              Vidwan ID
            </label>
            <input type="text" id="vidwanId" name="vidwanId" value={formData.vidwanId} onChange={handleChange}
              placeholder="Enter Vidwan ID"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="cmritIrinsLink" className="block text-sm font-medium text-gray-700 mb-2">
              CMRIT IRINS Profile Link
            </label>
            <input type="url" id="cmritIrinsLink" name="cmritIrinsLink" value={formData.cmritIrinsLink} onChange={handleChange}
              placeholder="https://"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="orcidLink" className="block text-sm font-medium text-gray-700 mb-2">
              ORCID ID Link
            </label>
            <input type="url" id="orcidLink" name="orcidLink" value={formData.orcidLink} onChange={handleChange}
              placeholder="https://orcid.org/0000-0000-0000-0000"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="scopusLink" className="block text-sm font-medium text-gray-700 mb-2">
              SCOPUS ID Link
            </label>
            <input type="url" id="scopusLink" name="scopusLink" value={formData.scopusLink} onChange={handleChange}
              placeholder="https://www.scopus.com/authid/detail.uri?authorId="
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="researcherLink" className="block text-sm font-medium text-gray-700 mb-2">
              Researcher ID Link
            </label>
            <input type="url" id="researcherLink" name="researcherLink" value={formData.researcherLink} onChange={handleChange}
              placeholder="https://www.researcherid.com/rid/"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="googleScholarLink" className="block text-sm font-medium text-gray-700 mb-2">
              Google Scholar Profile Link
            </label>
            <input type="url" id="googleScholarLink" name="googleScholarLink" value={formData.googleScholarLink} onChange={handleChange}
              placeholder="https://scholar.google.com/citations?user="
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>
        </div>
      </div>
    </div>
  )
}
