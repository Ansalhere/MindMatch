import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ProfessionalTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="space-y-6 text-sm" style={{ width: '100%' }}>
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontSize: '24px', lineHeight: '1.2', marginBottom: '8px' }}>
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '11px' }}>
          {data.personalInfo.email && (
            <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail className="h-3 w-3" style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone className="h-3 w-3" style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin className="h-3 w-3" style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Linkedin className="h-3 w-3" style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe className="h-3 w-3" style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed" style={{ fontSize: '12px', lineHeight: '1.6', color: '#374151' }}>{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="resume-section" style={{ marginBottom: '16px' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Work Experience
          </h2>
          <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{exp.title || 'Job Title'}</h3>
                  <span className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563', whiteSpace: 'nowrap' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <p className="text-gray-700 font-medium" style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{exp.company || 'Company Name'}</p>
                  {exp.location && <span className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>{exp.location}</span>}
                </div>
                {exp.description && (
                  <div className="text-gray-700" style={{ fontSize: '11px', color: '#374151', whiteSpace: 'pre-line', paddingLeft: '0' }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="resume-section" style={{ marginBottom: '16px' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Education
          </h2>
          <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{edu.degree || 'Degree'}</h3>
                  <span className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>{edu.graduationDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p className="text-gray-700" style={{ fontSize: '12px', color: '#374151' }}>{edu.institution || 'Institution'}</p>
                  {edu.gpa && <span className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>GPA: {edu.gpa}</span>}
                </div>
                {edu.location && <p className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>{edu.location}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="resume-section" style={{ marginBottom: '16px' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skills
          </h2>
          <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.skills.map((skill) => (
              <div key={skill.id} style={{ fontSize: '12px' }}>
                <span className="font-bold text-gray-900" style={{ fontWeight: 700, color: '#111827' }}>{skill.category}: </span>
                <span className="text-gray-700" style={{ color: '#374151' }}>{skill.items?.join(', ') || ''}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="resume-section" style={{ marginBottom: '16px' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Certifications
          </h2>
          <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div>
                  <span className="font-bold text-gray-900" style={{ fontWeight: 700, color: '#111827' }}>{cert.name}</span>
                  <span className="text-gray-700" style={{ color: '#374151' }}> - {cert.issuer}</span>
                </div>
                <span className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="resume-section" style={{ marginBottom: '16px' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Projects
          </h2>
          <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.projects.map((project) => (
              <div key={project.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <h3 className="font-bold text-gray-900" style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mb-1" style={{ fontSize: '11px', color: '#374151', marginBottom: '4px' }}>{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>
                    <span className="font-medium" style={{ fontWeight: 500 }}>Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <p className="text-gray-600 text-xs" style={{ fontSize: '10px', color: '#4b5563' }}>
                    <span className="font-medium" style={{ fontWeight: 500 }}>Link:</span> {project.link}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
