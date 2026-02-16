/**
 * Supplier Compliance & Supply Chain Knowledge Base
 * 
 * Conflict minerals, due diligence, and supply chain compliance requirements.
 */

export const supplierComplianceKnowledge = [
  {
    id: 'conflict-minerals-1',
    category: 'Supply Chain',
    topic: 'Conflict Minerals (3TG)',
    content: `**Conflict Minerals Reporting (US Dodd-Frank Act Section 1502)**

**What are Conflict Minerals?**
- **3TG:** Tin (Cassiterite), Tantalum (Coltan), Tungsten (Wolframite), Gold
- Sourced from Democratic Republic of Congo (DRC) and adjoining countries
- May finance armed groups

**Who Must Report?**
- SEC-registered companies
- Manufacture or contract to manufacture products using 3TG
- Must conduct Reasonable Country of Origin Inquiry (RCOI)

**Reporting Requirements:**
1. **Form SD** filed annually with SEC
2. **Conflict Minerals Report (CMR)** if not DRC conflict-free
3. **Due diligence** following OECD Guidance

**OECD 5-Step Framework:**
1. Establish strong company management systems
2. Identify and assess risk in supply chain
3. Design and implement strategy to respond to risks
4. Carry out independent third-party audit
5. Report annually on supply chain due diligence

**Smelter and Refiner Lists:**
- Use RMI (Responsible Minerals Initiative) lists
- Conformant vs. Active smelters
- Check smelter status: www.responsiblemineralsinitiative.org

**CMRT (Conflict Minerals Reporting Template):**
- Industry-standard template for collecting data
- Sent to suppliers to identify smelters
- Must be updated regularly

**EU Conflict Minerals Regulation (2021):**
- Directly applies to EU importers of 3TG
- Due diligence obligations
- More limited scope than US rule

**Penalties (US):**
- SEC enforcement actions
- Reputational damage
- Shareholder lawsuits
- Customer contract issues`,
    keywords: ['conflict minerals', '3tg', 'tin', 'tantalum', 'tungsten', 'gold', 'dodd-frank', 'form sd', 'smelter', 'refiner', 'cmrt', 'oecd', 'drc']
  },
  {
    id: 'supplier-audit-1',
    category: 'Supply Chain',
    topic: 'Supplier Quality Audits',
    content: `**Supplier Quality Audit Best Practices**

**Audit Types:**
1. **Initial/Qualification Audit** - Before approval
2. **Surveillance Audit** - Regular monitoring (annual)
3. **Special Cause Audit** - After quality issues
4. **Re-qualification Audit** - After significant changes

**Audit Standards:**
- **VDA 6.3** (Process audit - Automotive)
- **ISO 19011** (Audit guidelines)
- **Customer-specific requirements**
- **Industry standards** (AS9100, IATF 16949, etc.)

**Key Audit Areas:**
1. **Quality Management System**
   - Document control
   - Management review
   - Internal audits
   - Corrective actions

2. **Production Process Control**
   - Process validation
   - SPC implementation
   - Control plans
   - Work instructions

3. **Measurement Systems**
   - Calibration system
   - MSA studies
   - Gauge R&R

4. **Supplier Management**
   - Their supplier controls
   - Incoming inspection
   - Sub-tier traceability

5. **Change Management**
   - ECN process
   - Customer notification
   - PPAP for changes

**Audit Scoring:**
- Green (A): 90-100% - Approved
- Yellow (B): 80-89% - Conditional approval with action plan
- Red (C): <80% - Not approved

**Common Findings:**
- Missing SPC on critical dimensions
- Incomplete calibration records
- No PFMEA updates
- Inadequate training records
- Poor house keeping (5S)`,
    keywords: ['supplier audit', 'vda 6.3', 'process audit', 'qualification audit', 'surveillance audit', 'supplier quality', 'audit scoring']
  },
  {
    id: 'coc-requests-1',
    category: 'Supply Chain',
    topic: 'Certificate of Compliance (CoC)',
    content: `**Certificate of Compliance Requests**

**What is a CoC?**
Document certifying that product/material meets specified requirements.

**Types of CoC:**
1. **Regulatory CoC** - Meets legal requirements
2. **Specification CoC** - Meets technical specs
3. **Origin CoC** - Country of origin
4. **Conformity CoC** - ISO, industry standards

**Information to Request:**
- Product name/part number
- Specification/revision
- Batch/lot number
- Test results
- Date of manufacture
- Authorized signature
- Company certification

**REACH CoC:**
- Confirmation substance is listed on IECSC or registered
- SVHC content < 0.1%
- Authorization compliance

**RoHS CoC:**
- Confirmation of compliance with restricted substances
- May include test reports

**Prop 65 CoC:**
- Confirmation product doesn't contain listed chemicals above NSRL
- Or warning is provided

**Full Material Declaration (FMD):**
- Detailed breakdown of all substances
- CAS numbers
- Concentration ranges
- Required for high-risk products

**Managing CoCs:**
- Request at PO placement
- Verify authenticity
- Maintain in supplier file
- Update annually
- Version control

**Red Flags:**
- Generic templates without specific data
- Missing signatures
- Outdated test reports
- Refusal to provide
- Suspicious formatting`,
    keywords: ['certificate of compliance', 'coc', 'full material declaration', 'fmd', 'conformity', 'reach coc', 'rohs coc', 'supplier documentation']
  },
  {
    id: 'supply-chain-risk-1',
    category: 'Supply Chain',
    topic: 'Supply Chain Risk Management',
    content: `**Supply Chain Risk Management**

**Types of Risks:**
1. **Quality Risks**
   - Supplier defects
   - Inconsistent quality
   - Process drift

2. **Delivery Risks**
   - Capacity constraints
   - Logistics disruptions
   - Lead time variability

3. **Financial Risks**
   - Supplier bankruptcy
   - Currency fluctuation
   - Price volatility

4. **Regulatory Risks**
   - Non-compliance by supplier
   - Trade restrictions
   - Tariffs

5. **Geopolitical Risks**
   - Natural disasters
   - Political instability
   - Pandemics

**Risk Assessment Matrix:**
| Severity | Probability | Risk Level |
|----------|-------------|------------|
| High | High | Critical |
| High | Medium | High |
| Medium | High | High |
| Low | High | Medium |

**Mitigation Strategies:**
1. **Dual Sourcing** - Multiple suppliers for critical items
2. **Safety Stock** - Buffer inventory
3. **Supplier Development** - Improve capabilities
4. **Contracts** - Long-term agreements with penalties
5. **Monitoring** - KPIs and early warning systems
6. **Geographic Diversification** - Spread risk across regions

**Critical Supplier Criteria:**
- Single source
- High dollar value
- Long lead time
- Impact on safety/regulatory
- Difficult to qualify alternatives

**Supplier Scorecard Metrics:**
- Quality (PPM, defects)
- Delivery (OTD, lead time)
- Cost (price competitiveness)
- Service (responsiveness)
- Risk (financial, geographic)

**Business Continuity Planning:**
- Alternative supplier identification
- Qualification in advance
- Emergency response procedures
- Communication protocols`,
    keywords: ['supply chain risk', 'risk management', 'dual sourcing', 'critical supplier', 'supplier scorecard', 'business continuity', 'mitigation']
  }
];

export default supplierComplianceKnowledge;
