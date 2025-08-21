import Layout from '@/components/Layout';
import SelfAssessmentCenter from '@/components/skills/SelfAssessmentCenter';

const Skills = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SelfAssessmentCenter />
      </div>
    </Layout>
  );
};

export default Skills;