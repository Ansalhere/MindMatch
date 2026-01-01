import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, Star } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const SplitTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="flex min-h-full -m-8">
      {/* Left Sidebar - Dark */}
      <div className="w-1/3 bg-slate-800 text-white p-6">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white mb-3">
            {(data.personalInfo.fullName || 'YN').split(' ').map(n => n[0]).join('')}
          </div>
          <h1 className="text-xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-600 pb-2">Contact</h2>
          <div className="space-y-2 text-xs">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.portfolio && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-600 pb-2">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="font-semibold text-xs text-slate-300 mb-1">{skill.category}</h3>
                  <div className="space-y-1">
                    {(skill.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
                        <span className="text-xs">{item}</span>
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
          <div className="mb-6">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-600 pb-2">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-xs">{edu.degree || 'Degree'}</h3>
                  <p className="text-amber-300 text-xs">{edu.institution || 'Institution'}</p>
                  <p className="text-slate-400 text-xs">{edu.graduationDate}</p>
                  {edu.gpa && <p className="text-slate-400 text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-600 pb-2">Certifications</h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-bold text-xs">{cert.name}</h3>
                  <p className="text-slate-400 text-xs">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - Light */}
      <div className="w-2/3 bg-white p-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded"></span>
              About Me
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded"></span>
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-amber-300">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-800">{exp.title || 'Job Title'}</h3>
                      <p className="text-amber-600 font-medium text-sm">
                        {exp.company || 'Company'} {exp.location && `| ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-2">
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
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded"></span>
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm">{project.name}</h3>
                  <p className="text-gray-600 text-xs mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
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
      </div>
    </div>
  );
};

export default SplitTemplate;