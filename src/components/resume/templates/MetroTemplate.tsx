import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const MetroTemplate = ({ data }: TemplateProps) => {
  const colors = ['bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-indigo-500'];
  
  return (
    <div className="space-y-4 text-sm">
      {/* Header - Metro Tiles Style */}
      <div className="grid grid-cols-4 gap-2 -m-8 mb-4 p-4 bg-slate-100">
        <div className="col-span-2 row-span-2 bg-rose-500 p-4 text-white flex flex-col justify-center">
          <h1 className="text-2xl font-black">{data.personalInfo.fullName || 'Your Name'}</h1>
          {data.personalInfo.summary && (
            <p className="text-rose-100 text-xs mt-2 line-clamp-3">{data.personalInfo.summary}</p>
          )}
        </div>
        
        {data.personalInfo.email && (
          <div className="bg-sky-500 p-2 text-white flex flex-col items-center justify-center">
            <Mail className="h-4 w-4 mb-1" />
            <span className="text-xs text-center break-all">{data.personalInfo.email}</span>
          </div>
        )}
        
        {data.personalInfo.phone && (
          <div className="bg-emerald-500 p-2 text-white flex flex-col items-center justify-center">
            <Phone className="h-4 w-4 mb-1" />
            <span className="text-xs">{data.personalInfo.phone}</span>
          </div>
        )}
        
        {data.personalInfo.location && (
          <div className="bg-violet-500 p-2 text-white flex flex-col items-center justify-center">
            <MapPin className="h-4 w-4 mb-1" />
            <span className="text-xs text-center">{data.personalInfo.location}</span>
          </div>
        )}
        
        {data.personalInfo.linkedin && (
          <div className="bg-amber-500 p-2 text-white flex flex-col items-center justify-center">
            <Linkedin className="h-4 w-4 mb-1" />
            <span className="text-xs text-center break-all">{data.personalInfo.linkedin}</span>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-base font-black text-gray-800 mb-2 uppercase tracking-wider">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill, skillIdx) => (
              (skill.items || []).map((item, idx) => (
                <span 
                  key={`${skill.id}-${idx}`} 
                  className={`px-2 py-1 text-xs text-white font-medium ${colors[(skillIdx + idx) % colors.length]}`}
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
          <h2 className="text-base font-black text-gray-800 mb-3 uppercase tracking-wider border-l-4 border-rose-500 pl-2">
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="flex gap-3">
                <div className={`w-1 ${colors[idx % colors.length]} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                      <p className="text-gray-600 font-medium text-xs">
                        {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <span className={`text-xs text-white px-2 py-0.5 ${colors[idx % colors.length]}`}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-gray-600 text-xs mt-1 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-base font-black text-gray-800 mb-2 uppercase tracking-wider border-l-4 border-sky-500 pl-2">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className={`p-2 ${colors[(idx + 1) % colors.length]} bg-opacity-10 border-l-2 ${colors[(idx + 1) % colors.length].replace('bg-', 'border-')}`}>
                  <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-700 text-xs">{edu.institution || 'Institution'}</p>
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
            <h2 className="text-base font-black text-gray-800 mb-2 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={cert.id} className={`p-2 ${colors[(idx + 2) % colors.length]} bg-opacity-10 border-l-2 ${colors[(idx + 2) % colors.length].replace('bg-', 'border-')}`}>
                  <h3 className="font-bold text-gray-900 text-xs">{cert.name}</h3>
                  <p className="text-gray-600 text-xs">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-base font-black text-gray-800 mb-3 uppercase tracking-wider border-l-4 border-violet-500 pl-2">
            Projects
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.projects.map((project, idx) => (
              <div key={project.id} className={`${colors[idx % colors.length]} p-3 text-white`}>
                <h3 className="font-bold text-sm">{project.name}</h3>
                <p className="text-white/80 text-xs mb-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
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
  );
};

export default MetroTemplate;