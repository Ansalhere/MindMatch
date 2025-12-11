import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, Circle } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Header with accent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 -m-8 mb-6">
        <h1 className="text-4xl font-bold mb-3">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-blue-100">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-800 leading-relaxed italic">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600">
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-gray-900 text-base">{exp.title || 'Job Title'}</h3>
                    <p className="text-blue-700 font-medium mb-1">
                      {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                    </p>
                    <p className="text-gray-600 text-xs mb-2">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <div className="text-gray-700 text-xs whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600">
                Projects
              </h2>
              <div className="space-y-3">
                  {data.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <p className="text-gray-700 text-xs mb-1">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-blue-700 text-xs">
                        {project.technologies.join(' • ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-600">
                Skills
              </h2>
              <div className="space-y-3">
                {data.skills.map((skill) => (
                  <div key={skill.id}>
                    <h3 className="font-bold text-gray-900 text-xs mb-1">{skill.category}</h3>
                    <div className="space-y-1">
                      {(skill.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Circle className="h-1.5 w-1.5 fill-blue-600 text-blue-600" />
                          <span className="text-xs text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-600">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Degree'}</h3>
                    <p className="text-blue-700 text-xs">{edu.institution || 'Institution'}</p>
                    <p className="text-gray-600 text-xs">{edu.graduationDate}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-600">
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-gray-900 text-xs">{cert.name}</h3>
                    <p className="text-blue-700 text-xs">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
