import { ResumeData } from '@/pages/ResumeBuilder';

interface TemplateProps {
  data: ResumeData;
}

const MinimalTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-8 text-sm max-w-2xl mx-auto">
      {/* Header - Ultra minimal */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-light text-gray-900 tracking-wide">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-3 text-gray-600 text-xs">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="flex justify-center gap-3 text-gray-500 text-xs">
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.portfolio && data.personalInfo.linkedin && <span>•</span>}
            {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="text-center">
          <p className="text-gray-700 leading-relaxed italic max-w-xl mx-auto">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-center text-sm font-light tracking-widest text-gray-900 mb-6 uppercase">
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">
                  {exp.company || 'Company'}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && (
                  <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line pt-1">
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
          <h2 className="text-center text-sm font-light tracking-widest text-gray-900 mb-6 uppercase">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">{edu.degree || 'Degree'}</h3>
                  <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                </div>
                <p className="text-gray-600 text-xs">
                  {edu.institution || 'Institution'}
                  {edu.location && ` • ${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-center text-sm font-light tracking-widest text-gray-900 mb-6 uppercase">
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.map((skill) => (
              <div key={skill.id} className="text-center">
                <span className="font-medium text-gray-900 text-xs">{skill.category}</span>
                <span className="text-gray-600 text-xs"> • {skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-center text-sm font-light tracking-widest text-gray-900 mb-6 uppercase">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="space-y-1">
                <h3 className="font-medium text-gray-900 text-xs">{project.name}</h3>
                <p className="text-gray-700 text-xs">{project.description}</p>
                <p className="text-gray-600 text-xs">{project.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-center text-sm font-light tracking-widest text-gray-900 mb-6 uppercase">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-center space-y-0.5">
                <p className="font-medium text-gray-900 text-xs">{cert.name}</p>
                <p className="text-gray-600 text-xs">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
