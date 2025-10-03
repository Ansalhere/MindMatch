import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ExecutiveTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Header - Premium gold accent */}
      <div className="text-center pb-6 border-b-4 border-amber-600">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-gray-700">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-700" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-700" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-700" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-gray-600 mt-1 text-xs">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="h-3 w-3 text-amber-700" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-amber-700" />
                <span>{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Executive Summary */}
      {data.personalInfo.summary && (
        <div className="border-l-4 border-amber-600 pl-4 py-2">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 pb-2 border-b-2 border-amber-600">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className={index !== 0 ? 'pt-5 border-t border-gray-200' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.title || 'Job Title'}</h3>
                    <p className="text-amber-800 font-semibold">
                      {exp.company || 'Company Name'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-xs font-medium">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.location && (
                      <p className="text-gray-500 text-xs">{exp.location}</p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-amber-200">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Credentials */}
      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 pb-2 border-b-2 border-amber-600">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <p className="text-amber-800 font-medium text-sm">
                    {edu.institution || 'Institution'}
                  </p>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{edu.graduationDate}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 pb-2 border-b-2 border-amber-600">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                  <p className="text-amber-800 text-xs">{cert.issuer}</p>
                  <p className="text-gray-600 text-xs">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Core Competencies */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 pb-2 border-b-2 border-amber-600">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {data.skills.map((skill) => (
              <div key={skill.id}>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{skill.category}</h3>
                <p className="text-gray-700 text-xs leading-relaxed">
                  {skill.items.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notable Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 pb-2 border-b-2 border-amber-600">
            Notable Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id} className="border-l-2 border-amber-200 pl-3">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 text-xs leading-relaxed mb-1">{project.description}</p>
                <p className="text-amber-800 text-xs font-medium">
                  Technologies: {project.technologies.join(', ')}
                </p>
                {project.link && (
                  <p className="text-gray-600 text-xs">Link: {project.link}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
