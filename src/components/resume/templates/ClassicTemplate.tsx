import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-5 text-sm">
      {/* Classic Header */}
      <div className="border-b-4 border-double border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 text-xs">
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

      {/* Objective / Summary */}
      {data.personalInfo.summary && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2 text-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-xs">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-gray-600 text-xs">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 text-xs italic mb-1">
                  {exp.company || 'Company'}{exp.location && `, ${exp.location}`}
                </p>
                {exp.description && (
                  <div className="text-gray-700 text-xs whitespace-pre-line ml-4">
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
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-700 text-xs italic">
                    {edu.institution || 'Institution'}{edu.location && `, ${edu.location}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-gray-600 text-xs">{edu.graduationDate}</span>
                  {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex">
                <span className="font-bold text-gray-800 text-xs w-28">{skill.category}:</span>
                <span className="text-gray-700 text-xs">{(skill.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span className="text-gray-900 text-xs">
                  <span className="font-medium">{cert.name}</span> — {cert.issuer}
                </span>
                <span className="text-gray-600 text-xs">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                <p className="text-gray-700 text-xs">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-gray-600 text-xs italic">
                    Technologies: {project.technologies.join(', ')}
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

export default ClassicTemplate;
