import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Folder } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const TimelineTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="text-center pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-600 text-xs">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-emerald-600" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-emerald-600" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3 text-emerald-600" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-emerald-600" />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Skills Ribbon */}
      {data.skills.length > 0 && (
        <div className="bg-gray-100 -mx-8 px-8 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {data.skills.map((skill) => (
              (skill.items || []).map((item, idx) => (
                <span 
                  key={`${skill.id}-${idx}`} 
                  className="px-2 py-0.5 text-xs rounded bg-emerald-600 text-white"
                >
                  {item}
                </span>
              ))
            ))}
          </div>
        </div>
      )}

      {/* Main Timeline */}
      <div className="relative pl-8">
        {/* Timeline Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500" />
        
        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 -ml-8">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                <Briefcase className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-emerald-700">Experience</h2>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white shadow" />
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                        <p className="text-emerald-600 font-medium text-xs">
                          {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="text-gray-600 text-xs mt-2 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 -ml-8">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-teal-700">Education</h2>
            </div>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative">
                  <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-teal-400 border-2 border-white shadow" />
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                        <p className="text-teal-600 text-xs">{edu.institution || 'Institution'}</p>
                      </div>
                      <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                    </div>
                    {edu.gpa && <p className="text-gray-500 text-xs mt-1">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 -ml-8">
              <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-cyan-700">Certifications</h2>
            </div>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="relative">
                  <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-cyan-400 border-2 border-white shadow" />
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-cyan-600 text-xs">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 -ml-8">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Folder className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-blue-700">Projects</h2>
            </div>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="relative">
                  <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-blue-400 border-2 border-white shadow" />
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                    <p className="text-gray-600 text-xs">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineTemplate;