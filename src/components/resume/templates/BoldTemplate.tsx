import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe, ArrowRight } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const BoldTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Bold Header */}
      <div className="bg-gray-900 text-white p-8 -m-8 mb-6">
        <h1 className="text-5xl font-black mb-2 tracking-tight">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        {data.personalInfo.summary && (
          <p className="text-gray-300 text-sm max-w-2xl mb-4">{data.personalInfo.summary}</p>
        )}
        <div className="flex flex-wrap gap-4 text-gray-400 text-xs">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Mail className="h-3 w-3" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Phone className="h-3 w-3" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <MapPin className="h-3 w-3" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Linkedin className="h-3 w-3" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Globe className="h-3 w-3" />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Highlight */}
      {data.skills.length > 0 && (
        <div className="bg-yellow-400 p-4 -mx-8 px-8">
          <div className="flex flex-wrap gap-2">
            {data.skills.flatMap((skill) => 
              (skill.items || []).map((item, idx) => (
                <span 
                  key={`${skill.id}-${idx}`} 
                  className="bg-gray-900 text-white px-3 py-1 text-xs font-bold rounded"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-yellow-500" />
            EXPERIENCE
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-yellow-400 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{exp.title || 'Job Title'}</h3>
                    <p className="text-gray-600 font-bold">
                      {exp.company || 'Company'}
                    </p>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-xs whitespace-pre-line mt-2">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-yellow-500" />
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-gray-200 pl-3">
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-600 text-xs">{edu.institution || 'Institution'}</p>
                  <p className="text-gray-500 text-xs">
                    {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-yellow-500" />
              CERTIFICATIONS
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-gray-100 p-2 rounded">
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
          <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-yellow-500" />
            PROJECTS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <div key={project.id} className="bg-gray-900 text-white p-4 rounded">
                <h3 className="font-bold text-sm mb-1">{project.name}</h3>
                <p className="text-gray-400 text-xs mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-yellow-400 text-gray-900 px-2 py-0.5 text-xs font-bold rounded">
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

export default BoldTemplate;
