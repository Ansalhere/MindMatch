import { ResumeData } from '@/pages/ResumeBuilder';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const CreativeTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-5 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-2 bg-gradient-to-b from-purple-900 to-purple-700 text-white p-6 -m-8 -mr-0 min-h-full">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {data.personalInfo.fullName?.split(' ')[0] || 'First'}
              </h1>
              <h1 className="text-3xl font-bold text-purple-200">
                {data.personalInfo.fullName?.split(' ').slice(1).join(' ') || 'Last'}
              </h1>
            </div>

            {/* Contact */}
            <div className="space-y-2 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all text-xs">{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.portfolio && (
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all text-xs">{data.personalInfo.portfolio}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 text-purple-200">SKILLS</h2>
                <div className="space-y-3">
                  {data.skills.map((skill) => (
                    <div key={skill.id}>
                      <h3 className="font-bold text-sm mb-1">{skill.category}</h3>
                      <div className="space-y-1">
                        {skill.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-purple-100">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 text-purple-200">EDUCATION</h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                      <p className="text-purple-100">{edu.institution || 'Institution'}</p>
                      <p className="text-purple-200">{edu.graduationDate}</p>
                      {edu.gpa && <p className="text-purple-100">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-3 space-y-6 pt-6">
          {/* Summary */}
          {data.personalInfo.summary && (
            <div>
              <h2 className="text-xl font-bold text-purple-900 mb-3 pb-2 border-b-4 border-purple-600">
                PROFILE
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-900 mb-4 pb-2 border-b-4 border-purple-600">
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 text-base">{exp.title || 'Job Title'}</h3>
                      <span className="text-purple-700 text-xs font-medium whitespace-nowrap ml-2">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-purple-800 font-medium mb-2">
                      {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                    </p>
                    {exp.description && (
                      <div className="text-gray-700 text-xs whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-900 mb-4 pb-2 border-b-4 border-purple-600">
                PROJECTS
              </h2>
              <div className="space-y-3">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <p className="text-gray-700 text-xs mb-1">{project.description}</p>
                    <p className="text-purple-700 text-xs font-medium">
                      {project.technologies.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-900 mb-3 pb-2 border-b-4 border-purple-600">
                CERTIFICATIONS
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between">
                    <div>
                      <span className="font-bold text-gray-900 text-xs">{cert.name}</span>
                      <span className="text-purple-700 text-xs"> - {cert.issuer}</span>
                    </div>
                    <span className="text-gray-600 text-xs">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
