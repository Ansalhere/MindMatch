import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ProfessionalTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
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
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-gray-600 text-xs">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-gray-700 font-medium">{exp.company || 'Company Name'}</p>
                  {exp.location && <span className="text-gray-600 text-xs">{exp.location}</span>}
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line pl-4">
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
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <span className="text-gray-600 text-xs">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-gray-700">{edu.institution || 'Institution'}</p>
                  {edu.gpa && <span className="text-gray-600 text-xs">GPA: {edu.gpa}</span>}
                </div>
                {edu.location && <p className="text-gray-600 text-xs">{edu.location}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.map((skill) => (
              <div key={skill.id}>
                <span className="font-bold text-gray-900">{skill.category}: </span>
                <span className="text-gray-700">{skill.items?.join(', ') || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  <span className="text-gray-700"> - {cert.issuer}</span>
                </div>
                <span className="text-gray-600 text-xs">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mb-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-gray-600 text-xs">
                    <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <p className="text-gray-600 text-xs">
                    <span className="font-medium">Link:</span> {project.link}
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

export default ProfessionalTemplate;
