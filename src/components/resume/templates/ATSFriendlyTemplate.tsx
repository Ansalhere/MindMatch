import { ResumeData } from '@/pages/ResumeBuilder';

interface ATSFriendlyTemplateProps {
  data: ResumeData;
}

const ATSFriendlyTemplate = ({ data }: ATSFriendlyTemplateProps) => {
  return (
    <div className="resume-preview bg-white text-black p-10 min-h-[1123px] w-[794px] font-serif" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header - Simple text-based for maximum ATS compatibility */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">
          {data.personalInfo.fullName || 'YOUR NAME'}
        </h1>
        
        <div className="text-sm space-y-1">
          <p>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location
            ].filter(Boolean).join(' | ')}
          </p>
          {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
            <p>
              {[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>
      </header>

      <hr className="border-t border-black mb-4" />

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-sm">{exp.title}</strong>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm italic">{exp.company}</span>
                  {exp.location && <span className="text-sm">{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-sm">{edu.degree}</strong>
                  <span className="text-sm">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm italic">{edu.institution}</span>
                  {edu.gpa && <span className="text-sm">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills - Simple comma-separated for ATS */}
      {data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill) => (
              <p key={skill.id} className="text-sm">
                <strong>{skill.category}:</strong> {skill.items.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-sm">{project.name}</strong>
                  {project.link && <span className="text-sm">{project.link}</span>}
                </div>
                <p className="text-sm mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-sm">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            Certifications
          </h2>
          <ul className="text-sm space-y-1">
            {data.certifications.map((cert) => (
              <li key={cert.id}>
                {cert.name} - {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ATSFriendlyTemplate;
