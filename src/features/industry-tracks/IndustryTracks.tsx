/**
 * Industry-Specific Tracks - Main Component
 * 
 * Provides industry-tailored Six Sigma learning paths for:
 * - Healthcare & Life Sciences
 * - Manufacturing & Operations
 * - Service & Hospitality
 * - IT & Software Development
 * - Financial Services
 */

import React, { useState } from 'react';
import { INDUSTRY_TRACKS, INDUSTRY_MODULES } from './industryData';
import type { IndustryType, IndustryTrack } from './types';
import styles from './IndustryTracks.module.css';

interface IndustryTracksProps {
  onSelectIndustry?: (industry: IndustryType) => void;
  onStartModule?: (moduleId: string) => void;
}

export const IndustryTracks: React.FC<IndustryTracksProps> = ({
  onSelectIndustry,
  onStartModule,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'tools' | 'certification' | 'modules'>('overview');

  const handleSelectIndustry = (industryId: IndustryType) => {
    setSelectedIndustry(industryId);
    setActiveTab('overview');
    onSelectIndustry?.(industryId);
  };

  const industryData = selectedIndustry ? INDUSTRY_TRACKS[selectedIndustry] : null;
  const industryModules = INDUSTRY_MODULES.filter(m => m.industryId === selectedIndustry);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Industry-Specific Tracks</h1>
        <p>Tailored Six Sigma learning paths for your industry</p>
      </header>

      {!selectedIndustry ? (
        <div className={styles.industryGrid}>
          {Object.values(INDUSTRY_TRACKS).map(industry => (
            <button
              key={industry.id}
              className={styles.industryCard}
              onClick={() => handleSelectIndustry(industry.id)}
              style={{ '--industry-color': industry.color } as React.CSSProperties}
            >
              <span className={styles.industryIcon}>{industry.icon}</span>
              <h3>{industry.name}</h3>
              <p>{industry.description}</p>
              <div className={styles.industryStats}>
                <span>{industry.statistics.successRate} success rate</span>
                <span>{industry.caseStudies.length} case studies</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.industryDetail}>
          <button 
            className={styles.backButton}
            onClick={() => setSelectedIndustry(null)}
          >
            ← Back to Industries
          </button>

          <div className={styles.industryHeader} style={{ borderColor: industryData?.color }}>
            <span className={styles.industryIconLarge}>{industryData?.icon}</span>
            <div>
              <h2>{industryData?.name}</h2>
              <p>{industryData?.description}</p>
            </div>
          </div>

          <nav className={styles.tabNav}>
            {(['overview', 'cases', 'tools', 'certification', 'modules'] as const).map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && industryData && (
              <OverviewTab industry={industryData} />
            )}
            {activeTab === 'cases' && industryData && (
              <CaseStudiesTab cases={industryData.caseStudies} />
            )}
            {activeTab === 'tools' && industryData && (
              <ToolsTab tools={industryData.tools} />
            )}
            {activeTab === 'certification' && industryData && (
              <CertificationTab certificationPath={industryData.certificationPath} />
            )}
            {activeTab === 'modules' && (
              <ModulesTab 
                modules={industryModules} 
                onStartModule={onStartModule}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const OverviewTab: React.FC<{ industry: IndustryTrack }> = ({ industry }) => (
  <div className={styles.overview}>
    <section className={styles.section}>
      <h3>Industry Challenges</h3>
      <ul className={styles.challengeList}>
        {industry.challenges.map((challenge, idx) => (
          <li key={idx}>{challenge}</li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h3>Six Sigma Applications</h3>
      <ul className={styles.applicationList}>
        {industry.applications.map((app, idx) => (
          <li key={idx}>{app}</li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h3>Key Metrics</h3>
      <div className={styles.metricsGrid}>
        {industry.metrics.map((metric, idx) => (
          <span key={idx} className={styles.metricTag}>{metric}</span>
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h3>Industry Statistics</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{industry.statistics.successRate}</span>
          <span className={styles.statLabel}>Success Rate</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{industry.statistics.averageProjectDuration}</span>
          <span className={styles.statLabel}>Avg Project Duration</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{industry.statistics.typicalTeamSize}</span>
          <span className={styles.statLabel}>Typical Team Size</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{industry.statistics.averageSavings}</span>
          <span className={styles.statLabel}>Average Savings</span>
        </div>
      </div>
    </section>
  </div>
);

const CaseStudiesTab: React.FC<{ cases: IndustryTrack['caseStudies'] }> = ({ cases }) => (
  <div className={styles.caseStudies}>
    {cases.map(caseStudy => (
      <article key={caseStudy.id} className={styles.caseCard}>
        <header>
          <h3>{caseStudy.title}</h3>
          <span className={styles.company}>{caseStudy.company}</span>
        </header>
        
        <div className={styles.caseContent}>
          <div className={styles.caseSection}>
            <h4>Challenge</h4>
            <p>{caseStudy.challenge}</p>
          </div>
          
          <div className={styles.caseSection}>
            <h4>Approach</h4>
            <p>{caseStudy.approach}</p>
          </div>
          
          <div className={styles.caseSection}>
            <h4>Results</h4>
            <div className={styles.resultsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Before</th>
                    <th>After</th>
                    <th>Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStudy.results.map((result, idx) => (
                    <tr key={idx}>
                      <td>{result.metric}</td>
                      <td>{result.before}</td>
                      <td>{result.after}</td>
                      <td className={styles.improvement}>{result.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <footer className={styles.caseFooter}>
          <span>DMAIC Phase: <strong>{caseStudy.dmaicPhase}</strong></span>
          <span>Duration: <strong>{caseStudy.duration}</strong></span>
          <span>Team: <strong>{caseStudy.teamSize} members</strong></span>
          <span className={styles.roi}>ROI: <strong>{caseStudy.roi}</strong></span>
        </footer>
      </article>
    ))}
  </div>
);

const ToolsTab: React.FC<{ tools: IndustryTrack['tools'] }> = ({ tools }) => (
  <div className={styles.tools}>
    {tools.map(tool => (
      <div key={tool.id} className={styles.toolCard}>
        <div className={styles.toolHeader}>
          <h3>{tool.name}</h3>
          <span className={`${styles.difficulty} ${styles[tool.difficulty]}`}>
            {tool.difficulty}
          </span>
        </div>
        
        <p className={styles.toolDescription}>{tool.description}</p>
        
        <div className={styles.toolSection}>
          <h4>Application</h4>
          <p>{tool.application}</p>
        </div>
        
        <div className={styles.toolSection}>
          <h4>When to Use</h4>
          <ul>
            {tool.whenToUse.map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>
        
        <div className={styles.toolSection}>
          <h4>Examples</h4>
          <ul>
            {tool.examples.map((example, idx) => (
              <li key={idx}>{example}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

const CertificationTab: React.FC<{ certificationPath: IndustryTrack['certificationPath'] }> = ({ 
  certificationPath 
}) => (
  <div className={styles.certification}>
    <div className={styles.certificationPath}>
      {certificationPath.map((level, idx) => (
        <div key={level.level} className={styles.certLevel}>
          <div className={styles.levelBadge}>{level.level.toUpperCase()}</div>
          
          <div className={styles.levelContent}>
            <h3>{level.level.charAt(0).toUpperCase() + level.level.slice(1)} Belt</h3>
            
            <div className={styles.levelDetails}>
              <div>
                <h4>Focus Areas</h4>
                <ul>
                  {level.focus.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              
              <div>
                <h4>Projects</h4>
                <ul>
                  {level.projects.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              
              <div>
                <h4>Industry Skills</h4>
                <ul>
                  {level.industrySpecificSkills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div className={styles.levelMeta}>
                <span><strong>Duration:</strong> {level.duration}</span>
                <span><strong>Prerequisites:</strong> {level.prerequisites.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
          
          {idx < certificationPath.length - 1 && (
            <div className={styles.levelConnector}>↓</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ModulesTab: React.FC<{ 
  modules: typeof INDUSTRY_MODULES; 
  onStartModule?: (moduleId: string) => void;
}> = ({ modules, onStartModule }) => (
  <div className={styles.modules}>
    {modules.length === 0 ? (
      <div className={styles.emptyState}>
        <p>Industry-specific modules coming soon!</p>
        <p>Check out the general Six Sigma curriculum in the meantime.</p>
      </div>
    ) : (
      modules.map(module => (
        <div key={module.id} className={styles.moduleCard}>
          <h3>{module.title}</h3>
          <p>{module.description}</p>
          
          <div className={styles.moduleMeta}>
            <span>{module.lessons.length} lessons</span>
            <span>{module.lessons.reduce((sum, l) => sum + l.duration, 0)} minutes</span>
          </div>
          
          <div className={styles.lessonList}>
            <h4>Lessons</h4>
            <ul>
              {module.lessons.map(lesson => (
                <li key={lesson.id}>
                  <span>{lesson.title}</span>
                  <span>{lesson.duration} min</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            className={styles.startButton}
            onClick={() => onStartModule?.(module.id)}
          >
            Start Module
          </button>
        </div>
      ))
    )}
  </div>
);
