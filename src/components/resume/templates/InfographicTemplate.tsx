import { ResumeData } from '@/pages/ResumeBuilder';

interface InfographicTemplateProps {
  data: ResumeData;
}

const InfographicTemplate = ({ data }: InfographicTemplateProps) => {
  return (
    <div className="resume-preview bg-white text-black min-h-[1123px] w-[794px] font-sans flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-3xl font-bold text-purple-600 mb-4">
            {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0).toUpperCase() : 'Y'}
          </div>
          <h1 className="text-xl font-bold mb-1">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-white/50"></span>
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-start gap-2">
                <span className="text-purple-200">📧</span>
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-start gap-2">
                <span className="text-purple-200">📱</span>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-start gap-2">
                <span className="text-purple-200">📍</span>
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-start gap-2">
                <span className="text-purple-200">💼</span>
                <span className="break-all text-xs">{data.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills with visual bars */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-white/50"></span>
              Skills
            </h2>
            <div className="space-y-3">
              {data.skills.flatMap(skill => skill.items).slice(0, 8).map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item}</span>
                    <span>{85 + (index % 3) * 5}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${85 + (index % 3) * 5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-white/50"></span>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-purple-200 text-xs">{edu.institution}</p>
                  <p className="text-purple-300 text-xs">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8">
        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">👤</span>
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience Timeline */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">💼</span>
              Experience
            </h2>
            <div className="relative pl-6 border-l-2 border-purple-200 space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[29px] w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{exp.title}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🚀</span>
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-bold text-gray-800 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🏆</span>
              Certifications
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
                  <p className="font-semibold text-sm text-gray-800">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InfographicTemplate;
