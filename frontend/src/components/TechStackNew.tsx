import "./styles/TechStackNew.css";

import { config } from '../config';
const icons: Record<string,string> = { 'Java':'java', 'Spring Boot':'spring', 'Spring MVC':'spring', 'Spring Security':'spring', 'Hibernate / JPA':'hibernate', 'PostgreSQL':'postgresql', 'React.js':'react', 'JavaScript (ES6+)':'javascript', 'HTML5':'html5', 'CSS3':'css3', 'Git':'git', 'GitHub':'github', 'Maven':'maven', 'Docker':'docker', 'Postman':'postman', 'IntelliJ IDEA':'intellij' };
const techStack = [9,7,6,5].reduce((rows, count) => { const start = rows.flat().length; rows.push(config.techStack.slice(start,start+count)); return rows; }, [] as typeof config.techStack[]);
const TechStackNew = () => {
  return (
    <div className="techstack-new" id="skills">
      {/* Video Background */}
      <div className="techstack-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="techstack-video"
        >
          <source src="/video/video.webm" type="video/webm" />
        </video>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>

        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href="#skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={icons[tech.name] ? `/icons/${icons[tech.name]}.svg` : "/icons/code.svg"} alt={tech.name} loading="lazy" decoding="async" />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
