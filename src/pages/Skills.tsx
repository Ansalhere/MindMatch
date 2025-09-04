import Layout from '@/components/Layout';
import EnhancedSkillAssessment from '@/components/skills/EnhancedSkillAssessment';
import SEOHead from '@/components/SEOHead';

const Skills = () => {
  return (
    <>
      <SEOHead
        title="Professional Skill Assessments - RankMe.AI"
        description="Take comprehensive skill assessments in JavaScript, React, Python, and Data Science. Verify your expertise and boost your professional ranking with our AI-powered evaluation system."
        keywords="skill assessment, programming test, technical interview, JavaScript quiz, React assessment, Python test, data science evaluation, skill verification"
        canonical="/skills"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <EnhancedSkillAssessment />
        </div>
      </Layout>
    </>
  );
};

export default Skills;