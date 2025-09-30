import ProjectCard from '../ProjectCard'

export default function ProjectCardExample() {
  return (
    <div className="p-8 max-w-md">
      <ProjectCard
        title="ML Lab Research"
        description="Developed decentralized RL policies for robotic swarms using DDPG, PPO, and SAC algorithms."
        technologies={["Python", "PyTorch", "OpenAI Gym", "RL"]}
        githubUrl="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD"
        index={0}
      />
    </div>
  )
}
