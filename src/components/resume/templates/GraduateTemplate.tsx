import { ResumeData } from '@/pages/ResumeBuilder';

interface GraduateTemplateProps {
  data: ResumeData;
}

const GraduateTemplate = ({ data }: GraduateTemplateProps) => {
  return (
    <div className="resume-preview bg-white text-black p-8 min-h-[1123px] w-[794px] font-sans" style={{ fontFamily: 'Calibri, sans-serif' }}>
      {/* Header - Simple centered design for fresh graduates */}
      <header className="text-center border-b-2 border-blue-500 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-blue-600 font-medium text-lg mb-3">Fresh Graduate • Entry Level</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="flex justify-center gap-4 mt-2 text-sm text-blue-600">
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
          </div>
        )}
      </header>

      {/* Objective/Summary */}
      {data.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Career Objective
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education - Prominently placed for fresh graduates */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    {edu.location && <p className="text-gray-500 text-sm">{edu.location}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600 text-sm">{edu.graduationDate}</span>
                    {edu.gpa && (
                      <p className="text-sm font-semibold text-blue-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.flatMap(skill => skill.items).map((item, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{project.name}</h3>
                  {project.link && (
                    <span className="text-blue-600 text-sm">{project.link}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience/Internships */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Experience / Internships
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.title}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide">
            Certifications
          </h2>
          <ul className="grid grid-cols-2 gap-2">
            {data.certifications.map((cert) => (
              <li key={cert.id} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="font-medium">{cert.name}</span>
                <span className="text-gray-500">- {cert.issuer}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default GraduateTemplate;
