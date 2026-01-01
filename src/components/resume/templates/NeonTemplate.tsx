import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, Zap } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const NeonTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm bg-gray-900 text-white p-8 -m-8 min-h-full">
      {/* Header with neon effect */}
      <div className="text-center pb-6 border-b border-cyan-500/30">
        <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-300">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-cyan-400" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-purple-400" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-pink-400" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3 text-cyan-400" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-purple-400" />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20">
          <p className="text-gray-300 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Skills - Horizontal Pills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              (skill.items || []).map((item, idx) => (
                <span 
                  key={`${skill.id}-${idx}`} 
                  className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300"
                >
                  {item}
                </span>
              ))
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l border-purple-500/30">
                <div className="absolute -left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                <h3 className="font-bold text-white text-base">{exp.title || 'Job Title'}</h3>
                <p className="text-purple-300 font-medium mb-1">
                  {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                </p>
                <p className="text-gray-500 text-xs mb-2">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                {exp.description && (
                  <div className="text-gray-400 text-xs whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout for Education & Certs */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-pink-400 mb-3">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-pink-500/5 p-3 rounded border border-pink-500/20">
                  <h3 className="font-bold text-white text-xs">{edu.degree || 'Degree'}</h3>
                  <p className="text-pink-300 text-xs">{edu.institution || 'Institution'}</p>
                  <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
                  {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-3">Certifications</h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-cyan-500/5 p-3 rounded border border-cyan-500/20">
                  <h3 className="font-bold text-white text-xs">{cert.name}</h3>
                  <p className="text-cyan-300 text-xs">{cert.issuer}</p>
                  <p className="text-gray-500 text-xs">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-purple-400 mb-3">Projects</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.projects.map((project) => (
              <div key={project.id} className="bg-purple-500/5 p-3 rounded border border-purple-500/20">
                <h3 className="font-bold text-white text-sm">{project.name}</h3>
                <p className="text-gray-400 text-xs mb-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-purple-300 text-xs">
                    {project.technologies.join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeonTemplate;