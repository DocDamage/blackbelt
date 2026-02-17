/**
 * AI/ML in Quality & Manufacturing Knowledge Base
 * 
 * Modern applications of Artificial Intelligence and Machine Learning
 * for quality control, process optimization, and manufacturing excellence.
 */

export interface AIQualityEntry {
  id: string;
  category: string;
  topic: string;
  content: string;
  relatedTopics: string[];
  keywords: string[];
}

const aiQualityKnowledge: AIQualityEntry[] = [
  {
    id: 'ai-vision-1',
    category: 'AI Quality Applications',
    topic: 'Computer Vision for Defect Detection',
    content: `**Computer Vision for Automated Defect Detection**

**Overview:**
AI-powered computer vision systems use cameras and deep learning algorithms to automatically detect defects in manufacturing processes, replacing or augmenting human inspection.

**Technology Stack:**
- **Deep Learning Models:** Convolutional Neural Networks (CNNs), YOLO, ResNet
- **Hardware:** High-resolution industrial cameras, GPU processing units
- **Software:** TensorFlow, PyTorch, OpenCV, custom vision platforms

**Applications:**
| Industry | Defect Type | Detection Capability |
|----------|-------------|---------------------|
| Automotive | Surface scratches, paint defects, weld quality | 99.5%+ accuracy |
| Electronics | Solder joint defects, component placement, PCB traces | Real-time detection |
| Textiles | Fabric defects, color variations, stitching errors | 0.1mm precision |
| Food & Beverage | Foreign object detection, packaging integrity | X-ray + vision fusion |
| Pharmaceuticals | Tablet defects, packaging labels, contamination | FDA 21 CFR Part 11 compliant |

**Implementation Steps:**
1. **Data Collection:** Capture thousands of images (good and defective)
2. **Annotation:** Label defects with bounding boxes or segmentation masks
3. **Model Training:** Train CNN on annotated dataset (typically 80/20 train/test split)
4. **Validation:** Test on holdout dataset, optimize for precision/recall
5. **Deployment:** Edge computing or cloud-based inference
6. **Continuous Learning:** Retrain with new defect types

**Key Metrics:**
- **Precision:** True positives / (True positives + False positives)
- **Recall:** True positives / (True positives + False negatives)
- **F1 Score:** Harmonic mean of precision and recall
- **Inference Time:** Typically 10-100ms per image for real-time applications

**ROI Considerations:**
- Labor cost reduction: 50-80% of inspection staff
- Detection rate improvement: 20-40% over human inspection
- False positive reduction: 60-90% compared to rule-based systems
- Payback period: 12-24 months typical

**Challenges:**
- Requires large labeled datasets (1000+ images per defect type)
- Lighting and positioning consistency critical
- Concept drift when product designs change
- Integration with existing MES/QMS systems`,
    relatedTopics: ['Machine Learning', 'Deep Learning', 'Automated Inspection', 'Industry 4.0'],
    keywords: ['computer vision', 'defect detection', 'cnn', 'deep learning', 'automated inspection', 'machine vision', 'quality inspection', 'visual inspection']
  },
  {
    id: 'ai-predictive-1',
    category: 'AI Quality Applications',
    topic: 'Predictive Quality Analytics',
    content: `**Predictive Quality Analytics**

**Overview:**
Use machine learning to predict quality issues before they occur, enabling proactive intervention rather than reactive correction.

**Types of Predictions:**

**1. Quality Failure Prediction:**
- Predict which units will fail quality checks
- Input: Process parameters, sensor data, environmental conditions
- Output: Probability of defect/failure
- Action: Stop production, adjust parameters, or flag for inspection

**2. Process Drift Detection:**
- Monitor for gradual degradation in process capability
- Statistical process control + ML anomaly detection
- Early warning when Cpk trending downward

**3. Equipment Failure Prediction:**
- Predict machine breakdowns that cause quality issues
- Vibration, temperature, current signature analysis
- Preventive maintenance scheduling

**Machine Learning Models Used:**

| Model Type | Use Case | Accuracy |
|------------|----------|----------|
| Random Forest | Feature importance, defect classification | 85-95% |
| Gradient Boosting (XGBoost) | Quality prediction, ranking | 90-97% |
| Neural Networks | Complex non-linear relationships | 88-96% |
| Time Series (LSTM) | Sequential process data, trend prediction | 85-93% |
| Anomaly Detection (Isolation Forest) | Outlier detection, novel defects | 80-90% |

**Data Requirements:**
- Historical quality data (pass/fail, defect types)
- Process parameters (temperature, pressure, speed, etc.)
- Sensor data (vibration, acoustic, electrical)
- Environmental conditions (humidity, ambient temperature)
- Maintenance records

**Implementation Framework:**
1. **Data Integration:** Connect to SCADA, MES, QMS databases
2. **Feature Engineering:** Create relevant features from raw data
3. **Model Development:** Train and validate prediction models
4. **Real-time Scoring:** Deploy models for live prediction
5. **Alert System:** Notify operators when risk threshold exceeded
6. **Feedback Loop:** Track prediction accuracy and retrain

**Business Impact:**
- Scrap reduction: 25-50%
- Rework reduction: 30-60%
- First-pass yield improvement: 10-20%
- Customer complaints reduction: 40-70%

**Example Use Case - Injection Molding:**
Inputs: Barrel temperature, injection pressure, cooling time, material moisture
Prediction: Probability of sink marks, warpage, or short shots
Action: Automatically adjust parameters or alert operator`,
    relatedTopics: ['Predictive Maintenance', 'Machine Learning', 'Process Control', 'SPC'],
    keywords: ['predictive quality', 'predictive analytics', 'machine learning', 'failure prediction', 'process drift', 'anomaly detection', 'proactive quality']
  },
  {
    id: 'ai-digital-twin-1',
    category: 'AI Quality Applications',
    topic: 'Digital Twins for Quality Simulation',
    content: `**Digital Twins for Quality Simulation**

**Overview:**
A digital twin is a virtual replica of a physical product, process, or system that uses real-time data and AI models to simulate behavior, predict outcomes, and optimize quality.

**Types of Digital Twins:**

**1. Product Digital Twin:**
- Virtual representation of physical product
- Simulates performance under various conditions
- Predicts failure modes and lifetime
- Applications: Aerospace components, automotive parts, medical devices

**2. Process Digital Twin:**
- Virtual model of manufacturing process
- Simulates cause-effect relationships
- Optimizes parameters for quality outcomes
- Applications: CNC machining, welding, chemical processing

**3. System Digital Twin:**
- Models entire production system
- Simulates interactions between processes
- Optimizes flow and resource allocation
- Applications: Smart factories, supply chains

**Technology Components:**
- **CAD/CAE Models:** Physics-based simulations (FEA, CFD)
- **IoT Sensors:** Real-time data from physical assets
- **AI/ML Models:** Data-driven predictions and optimizations
- **Visualization:** 3D models, dashboards, VR/AR interfaces

**Quality Applications:**

| Application | Description | Benefit |
|-------------|-------------|---------|
| Virtual Commissioning | Test processes before physical implementation | 50-70% faster startup |
| Parameter Optimization | AI suggests optimal settings | 15-30% quality improvement |
| What-if Analysis | Simulate changes without production risk | Zero-cost experimentation |
| Root Cause Analysis | Trace quality issues through virtual model | 60-80% faster problem solving |
| Predictive Maintenance | Anticipate equipment failures | 25-40% maintenance cost reduction |

**Implementation Process:**
1. **Model Creation:** Build physics-based or data-driven model
2. **Data Integration:** Connect to real-time sensor feeds
3. **Calibration:** Validate model accuracy against physical system
4. **Simulation:** Run scenarios and optimizations
5. **Deployment:** Integrate recommendations into operations
6. **Evolution:** Continuously update model with new data

**Example - Welding Quality:**
Digital twin simulates weld pool dynamics based on:
- Voltage, current, wire feed speed
- Travel speed, torch angle
- Material properties, shielding gas
Predicts: Penetration depth, porosity risk, heat-affected zone
Optimizes: Parameters for defect-free welds

**ROI Metrics:**
- Reduction in physical prototyping: 40-60%
- Quality improvement: 15-25%
- Time to market reduction: 20-30%
- Operational cost savings: 10-20%`,
    relatedTopics: ['Simulation', 'Industry 4.0', 'IoT', 'Smart Manufacturing'],
    keywords: ['digital twin', 'simulation', 'virtual commissioning', 'what-if analysis', 'virtual prototype', 'smart factory', 'industry 4.0']
  },
  {
    id: 'ai-nlp-1',
    category: 'AI Quality Applications',
    topic: 'NLP for Quality Documentation & Complaint Analysis',
    content: `**Natural Language Processing (NLP) for Quality**

**Overview:**
NLP uses AI to analyze unstructured text data from quality documentation, customer complaints, audit reports, and regulatory filings.

**Applications:**

**1. Customer Complaint Analysis:**
- Automatically categorize complaint types
- Extract sentiment and urgency
- Identify emerging quality issues
- Route to appropriate teams

**2. Root Cause Analysis from Text:**
- Analyze corrective action reports
- Extract contributing factors
- Identify patterns across incidents
- Suggest preventive actions

**3. Document Processing:**
- Extract data from COAs (Certificates of Analysis)
- Parse supplier quality agreements
- Analyze audit findings
- Automate regulatory submission review

**4. Voice of Customer (VoC) Mining:**
- Analyze social media, reviews, surveys
- Extract quality-related themes
- Track sentiment trends over time
- Identify competitive advantages/gaps

**NLP Techniques:**

| Technique | Application | Example |
|-----------|-------------|---------|
| Text Classification | Categorize complaints | "Defect", "Packaging", "Shipping" |
| Named Entity Recognition | Extract specific info | Product codes, dates, locations |
| Sentiment Analysis | Gauge customer satisfaction | Positive/Negative/Neutral scores |
| Topic Modeling | Discover themes | Latent issues in complaints |
| Text Summarization | Condense long reports | Executive summaries |
| Keyword Extraction | Identify important terms | "crack", "discoloration", "late" |

**Implementation Example - Complaint Analysis:**
Input: "The product arrived damaged. Box was crushed and seal was broken. Item had scratches."
NLP Output:
- Category: Shipping Damage
- Severity: High
- Sentiment: Negative (0.85)
- Keywords: damaged, crushed, broken, scratches
- Action: Route to logistics team, flag for packaging review

**Tools & Platforms:**
- **Cloud APIs:** AWS Comprehend, Google Cloud NLP, Azure Text Analytics
- **Open Source:** spaCy, NLTK, Hugging Face Transformers
- **Specialized:** Qualtrics Text iQ, Medallia, Clarabridge

**Quality Impact:**
- Complaint processing time: 70-90% reduction
- Issue detection speed: 60-80% faster
- Data entry errors: 50-80% reduction
- Customer response time: 50-70% improvement

**Best Practices:**
- Build industry-specific training datasets
- Regularly retrain models with new data
- Validate automated classifications
- Maintain human oversight for critical decisions`,
    relatedTopics: ['Text Analytics', 'Customer Complaints', 'Voice of Customer', 'Data Mining'],
    keywords: ['nlp', 'natural language processing', 'text analytics', 'complaint analysis', 'sentiment analysis', 'text mining', 'unstructured data']
  },
  {
    id: 'ai-process-optimization',
    category: 'AI Quality Applications',
    topic: 'AI-Driven Process Optimization',
    content: `**AI-Driven Process Optimization**

**Overview:**
Use reinforcement learning and optimization algorithms to automatically adjust process parameters in real-time to maximize quality and efficiency.

**Optimization Techniques:**

**1. Reinforcement Learning (RL):**
- Agent learns optimal actions through trial and error
- Reward function based on quality metrics
- Continuously adapts to changing conditions
- Applications: Chemical processes, heat treatment, coating

**2. Bayesian Optimization:**
- Efficiently searches parameter space
- Balances exploration vs exploitation
- Fewer experiments needed than traditional DOE
- Applications: New product/process development

**3. Genetic Algorithms:**
- Evolutionary approach to parameter optimization
- Good for complex, multi-modal problems
- Applications: Scheduling, recipe optimization

**Real-time Process Control:**

| Component | Function | AI Technology |
|-----------|----------|---------------|
| Sensors | Collect process data | IoT, smart sensors |
| Edge AI | Local real-time analysis | Edge computing, TinyML |
| Control System | Adjust parameters | MPC, PID + AI tuning |
| Cloud AI | Complex optimization | Deep learning, big data |

**Example - Chemical Process:**
Variables: Temperature, pressure, catalyst concentration, flow rate
Constraints: Safety limits, equipment limits, quality specs
AI Action: Continuously adjust variables to maintain Cpk > 1.33
Result: 15% yield improvement, 30% energy reduction

**Benefits:**
- Consistent quality despite variations
- Reduced operator dependence
- Faster response to disturbances
- Continuous improvement over time

**Challenges:**
- Requires robust safety systems
- Need extensive historical data
- Change management with operators
- Regulatory validation for critical processes`,
    relatedTopics: ['Process Control', 'Reinforcement Learning', 'Optimization', 'Industry 4.0'],
    keywords: ['process optimization', 'reinforcement learning', 'bayesian optimization', 'real-time control', 'adaptive control', 'autonomous manufacturing']
  },
  {
    id: 'ai-mlops-quality',
    category: 'AI Quality Applications',
    topic: 'MLOps for Quality Systems',
    content: `**MLOps for Quality Systems**

**Overview:**
MLOps (Machine Learning Operations) applies DevOps principles to ML models in quality systems, ensuring reliable, scalable, and maintainable AI deployments.

**MLOps Lifecycle for Quality:**

**1. Data Management:**
- Data versioning (DVC, LakeFS)
- Data quality monitoring
- Automated data validation
- Bias detection in training data

**2. Model Development:**
- Experiment tracking (MLflow, Weights & Biases)
- Hyperparameter optimization
- Model versioning
- Reproducible pipelines

**3. Model Validation:**
- Performance metrics tracking
- A/B testing frameworks
- Shadow deployment (test alongside existing system)
- Regulatory compliance validation

**4. Deployment:**
- Containerization (Docker, Kubernetes)
- Edge deployment for real-time inference
- Model serving (TF Serving, TorchServe)
- Blue-green deployments

**5. Monitoring:**
- Model performance drift
- Data distribution drift
- Prediction latency tracking
- Business KPI impact

**6. Retraining:**
- Automated retraining triggers
- Continuous learning pipelines
- Model rollback capabilities

**Quality-Specific Considerations:**

| Aspect | Traditional ML | Quality ML |
|--------|---------------|------------|
| Safety | Important | Critical - must not miss defects |
| Interpretability | Nice to have | Required - explain rejections |
| Latency | Seconds acceptable | Milliseconds for real-time |
| Validation | Holdout test set | Production validation required |
| Compliance | Standard | FDA 21 CFR Part 11, ISO standards |

**Key Metrics to Monitor:**
- **Model Drift:** Performance degradation over time
- **Data Drift:** Input distribution changes
- **Prediction Confidence:** Uncertainty estimates
- **Business Impact:** Quality metrics, cost savings
- **System Health:** Uptime, latency, throughput

**Tools Stack:**
- **Orchestration:** Kubeflow, Apache Airflow, Prefect
- **Monitoring:** Evidently AI, WhyLabs, Arize
- **Feature Store:** Feast, Tecton
- **Deployment:** Seldon, BentoML

**Best Practices:**
- Version everything (data, models, code)
- Implement automated testing
- Maintain model cards (documentation)
- Plan for model retirement/replacement
- Ensure regulatory audit trails`,
    relatedTopics: ['DevOps', 'Model Monitoring', 'Deployment', 'System Reliability'],
    keywords: ['mlops', 'model monitoring', 'model deployment', 'continuous learning', 'model drift', 'ai operations', 'model management']
  },
  {
    id: 'ai-supply-chain',
    category: 'AI Quality Applications',
    topic: 'AI for Supply Chain Quality Risk',
    content: `**AI for Supply Chain Quality Risk Management**

**Overview:**
Machine learning models predict and mitigate quality risks across the supply chain, from raw material sourcing to finished product delivery.

**Risk Prediction Applications:**

**1. Supplier Quality Risk Scoring:**
- Predict likelihood of supplier quality issues
- Input: Historical performance, financial health, geopolitical factors
- Output: Risk score, recommended inspection level

**2. Raw Material Quality Prediction:**
- Predict material properties before testing
- Input: Supplier data, shipping conditions, certificate of analysis
- Output: Expected quality parameters

**3. Shipping Damage Prediction:**
- Predict damage risk based on route, carrier, packaging
- Input: Weather, handling history, route complexity
- Output: Risk level, insurance recommendations

**4. Counterfeit Detection:**
- Identify suspicious suppliers or products
- Input: Price anomalies, documentation patterns, physical characteristics
- Output: Counterfeit probability

**Data Sources:**
- Supplier audit results
- Incoming inspection data
- Certificate of Analysis (CoA)
- Logistics tracking data
- Weather and environmental data
- Economic indicators
- Geopolitical risk indices

**ML Models for Supply Chain:**

| Model | Use Case | Features |
|-------|----------|----------|
| Gradient Boosting | Supplier risk scoring | Performance history, financial metrics |
| Time Series | Demand forecasting for quality planning | Historical demand, seasonality |
| Graph Neural Networks | Supplier network risk | Multi-tier supplier relationships |
| Anomaly Detection | Unusual shipping patterns | Route deviations, timing anomalies |
| NLP | Contract risk analysis | Terms, clauses, penalty structures |

**Quality Assurance Framework:**
1. **Risk Assessment:** Score all suppliers/materials
2. **Sampling Optimization:** Inspect high-risk items more frequently
3. **Preventive Actions:** Address risks before they materialize
4. **Continuous Monitoring:** Track leading indicators
5. **Feedback Loop:** Update models with new incidents

**Business Benefits:**
- Reduced incoming inspection costs: 30-50%
- Fewer supplier quality escapes: 40-60%
- Reduced supply disruptions: 25-40%
- Lower inventory holding costs: 15-25%

**Example - Supplier Risk Score:**
Inputs: On-time delivery (95%), past defects (2%), financial rating (B), location risk (Medium)
AI Prediction: Risk Score = 6.2/10 (Medium-High)
Recommendation: Increase inspection frequency to 100% for next 3 shipments`,
    relatedTopics: ['Supply Chain', 'Risk Management', 'Supplier Management', 'Predictive Analytics'],
    keywords: ['supply chain', 'supplier risk', 'quality risk', 'material quality', 'logistics', 'counterfeit detection', 'risk scoring']
  }
];

export default aiQualityKnowledge;
