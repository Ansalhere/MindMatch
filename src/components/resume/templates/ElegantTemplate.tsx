import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ElegantTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm font-serif">
      {/* Header with elegant styling */}
      <div className="text-center pb-6 border-b-2 border-gray-800">
        <h1 className="text-4xl font-light tracking-[0.3em] uppercase mb-4">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-gray-600 text-xs">
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
        <div className="text-center px-8">
          <p className="text-gray-700 leading-relaxed italic text-sm">
            "{data.personalInfo.summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4 text-gray-800">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="font-semibold text-gray-900 text-base">{exp.title || 'Job Title'}</h3>
                <p className="text-gray-600 font-medium text-sm">
                  {exp.company || 'Company'} {exp.location && `— ${exp.location}`}
                </p>
                <p className="text-gray-500 text-xs mb-2">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </p>
                {exp.description && (
                  <div className="text-gray-700 text-xs whitespace-pre-line text-left max-w-xl mx-auto">
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
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4 text-gray-800">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                <p className="text-gray-600 text-sm">{edu.institution || 'Institution'}</p>
                <p className="text-gray-500 text-xs">
                  {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4 text-gray-800">
            Skills & Expertise
          </h2>
          <div className="text-center space-y-2">
            {data.skills.map((skill) => (
              <div key={skill.id}>
                <span className="font-medium text-gray-800 text-xs">{skill.category}: </span>
                <span className="text-gray-600 text-xs">{(skill.items || []).join(' • ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4 text-gray-800">
            Certifications
          </h2>
          <div className="text-center space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <span className="font-medium text-gray-900 text-xs">{cert.name}</span>
                <span className="text-gray-600 text-xs"> — {cert.issuer}, {cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4 text-gray-800">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id} className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                <p className="text-gray-700 text-xs">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-gray-500 text-xs italic mt-1">
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

export default ElegantTemplate;
