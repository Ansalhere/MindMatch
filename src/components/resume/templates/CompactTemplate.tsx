import { ResumeData } from '@/pages/ResumeBuilder';

interface TemplateProps {
  data: ResumeData;
}

const CompactTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-4 text-xs max-w-2xl mx-auto">
      {/* Header - Two column compact */}
      <div className="border-b-2 border-gray-800 pb-2 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          {data.personalInfo.summary && (
            <p className="text-gray-600 mt-1 text-xs leading-tight">
              {data.personalInfo.summary}
            </p>
          )}
        </div>
        <div className="text-right text-gray-600 space-y-0.5">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div className="truncate">{data.personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Experience & Projects */}
        <div className="col-span-2 space-y-3">
          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                Experience
              </h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                    <span className="text-gray-500 text-xs">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-gray-700">{exp.company || 'Company'}</div>
                  {exp.description && (
                    <div className="text-gray-600 text-xs mt-1 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                Projects
              </h2>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <h3 className="font-bold text-gray-900 text-xs">{project.name}</h3>
                  <p className="text-gray-600 text-xs">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-gray-500 text-xs">{project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Skills, Education, Certs */}
        <div className="space-y-3">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                Skills
              </h2>
              {data.skills.map((skill) => (
                <div key={skill.id} className="mb-2">
                  <h3 className="font-bold text-gray-800 text-xs">{skill.category}</h3>
                  <div className="text-gray-600 text-xs">
                    {(skill.items || []).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <h3 className="font-bold text-gray-800 text-xs">{edu.degree || 'Degree'}</h3>
                  <div className="text-gray-600 text-xs">{edu.institution || 'Institution'}</div>
                  <div className="text-gray-500 text-xs">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                Certifications
              </h2>
              {data.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="font-bold text-gray-800 text-xs">{cert.name}</h3>
                  <div className="text-gray-600 text-xs">{cert.issuer}</div>
                  <div className="text-gray-500 text-xs">{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactTemplate;
