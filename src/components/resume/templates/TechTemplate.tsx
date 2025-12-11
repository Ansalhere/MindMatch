import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const TechTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-5 text-sm bg-gradient-to-br from-slate-50 to-gray-50 p-8">
      {/* Header with Tech Style */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-600 to-cyan-500"></div>
        <div className="pl-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {data.personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600 text-xs">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span className="truncate max-w-xs">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                <span>{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-white p-4 rounded border-l-4 border-blue-600">
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Skills - Highlighted */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data.skills.map((skill) => (
              <div key={skill.id} className="bg-white p-3 rounded border-l-2 border-blue-500">
                <h3 className="font-bold text-blue-700 text-xs mb-1">{skill.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(skill.items || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-gray-700 px-2 py-0.5 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="bg-white p-4 rounded border-l-2 border-cyan-500">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-base">{exp.title || 'Job Title'}</h3>
                  <span className="text-blue-600 text-xs font-medium whitespace-nowrap ml-2">
                    {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2 text-xs">
                  <Briefcase className="h-3 w-3" />
                  <span className="font-medium">{exp.company || 'Company'}</span>
                  {exp.location && <span>• {exp.location}</span>}
                </div>
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

      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            EDUCATION
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="bg-white p-3 rounded border-l-2 border-blue-400">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                      <p className="text-blue-700 text-xs">{edu.institution || 'Institution'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600 text-xs">{edu.graduationDate}</div>
                    {edu.gpa && <div className="text-blue-600 text-xs font-medium">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            PROJECTS
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {data.projects.map((project) => (
              <div key={project.id} className="bg-white p-3 rounded border-l-2 border-cyan-400">
                <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                <p className="text-gray-700 text-xs my-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-2 rounded border border-blue-200">
                <h3 className="font-bold text-gray-900 text-xs">{cert.name}</h3>
                <p className="text-blue-700 text-xs">{cert.issuer}</p>
                <p className="text-gray-500 text-xs">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTemplate;
