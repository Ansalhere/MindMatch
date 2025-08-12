import Layout from '@/components/Layout';
import SelfAssessmentCenter from '@/components/skills/SelfAssessmentCenter';

const Skills = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SelfAssessmentCenter />
      </div>
    </Layout>
  );
};

export default Skills;