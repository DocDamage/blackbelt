/**
 * Additional Regulations Knowledge Base
 * 
 * POPs, EU MDR, expanded TSCA/PFAS, REACH Annex details
 */

export const additionalRegulations = [
  {
    id: 'eu-pops-1',
    category: 'EU Chemicals',
    regulation: 'EU POPs Regulation (2019/1021)',
    jurisdiction: 'European Union',
    content: `**EU POPs Regulation - Persistent Organic Pollutants**

**What are POPs?**
Persistent Organic Pollutants are chemicals that:
- Remain intact for exceptionally long periods
- Become widely distributed throughout the environment
- Accumulate in fatty tissues of living organisms
- Are toxic to humans and wildlife

**Regulation Scope:**
Prohibits or restricts production, placing on market and use of POPs.

**Annex I (Prohibited)** - Examples:
- Aldrin (Pesticide)
- Chlordane (Pesticide)
- DDT (Pesticide)
- Endrin (Pesticide)
- Heptachlor (Pesticide)
- Hexachlorobenzene (HCB)
- Mirex (Pesticide)
- Toxaphene (Pesticide)
- Polychlorinated Biphenyls (PCBs)
- Polychlorinated dibenzo-p-dioxins (PCDDs)
- Polychlorinated dibenzofurans (PCDFs)

**Annex II (Restricted)** - Examples:
- DDT (disease vector control only)
- Perfluorooctane sulfonic acid (PFOS)
- Perfluorooctanoic acid (PFOA)

**Annex III (Unintentional Trace Contaminants):**
- Limit values for unintentional trace presence
- Sum limit for PCDD/PCDF: 5 μg/kg (5 ppb)
- Sum limit for dioxin-like PCBs: 5 μg/kg

**Annex IV (Waste Management):**
- Concentration limits for waste treatment
- Destruction or irreversible transformation required

**Thresholds:**
- Generally prohibited above trace contamination limits
- No exemption for substances listed in Annex I

**Enforcement:**
- Member state authorities
- Penalties must be effective, proportionate, dissuasive
- Criminal penalties in serious cases

**Relationship to REACH:**
- POPs take precedence over REACH
- More stringent than REACH restrictions
- Stockholm Convention implementation`,
    applicableProducts: ['All products in EU', 'Waste containing POPs', 'Articles with unintentional POP contamination'],
    keywords: ['pops', 'persistent organic pollutants', 'eu pops', 'stockholm convention', 'pcbs', 'dioxins', 'ddt', 'pfos', 'pfoa']
  },
  {
    id: 'eu-mdr-1',
    category: 'EU Medical Devices',
    regulation: 'EU MDR (2017/745) - Medical Device Regulation',
    jurisdiction: 'European Union',
    content: `**EU MDR (Medical Device Regulation 2017/745)**

**Replaced:** MDD (93/42/EEC) and AIMDD (90/385/EEC) as of May 26, 2021

**Key Changes from MDD:**
1. **Expanded Scope:**
   - Previously non-regulated products (colored contact lenses, cosmetic implants)
   - Software as Medical Device (SaMD)
   - Nanomaterials

2. **Unique Device Identification (UDI):**
   - Mandatory for all devices
   - EUDAMED database registration
   - Traceability throughout supply chain

3. **Risk Classification Changes:**
   - More stringent classification rules (22 rules vs 18)
   - Some devices moved to higher classes
   - Class I reusable instruments now require Notified Body

4. **Clinical Evidence:**
   - Stronger clinical evaluation requirements
   - Post-market clinical follow-up (PMCF)
   - Clinical investigation for high-risk devices

5. **Person Responsible for Regulatory Compliance (PRRC):**
   - Required for all manufacturers
   - Must reside in EU (or have EU authorized representative)

**Device Classes:**
- **Class I:** Low risk (sterile, measuring, reusable surgical require NB)
- **Class IIa:** Medium risk
- **Class IIb:** Higher medium risk
- **Class III:** High risk (implants, life-supporting)

**Technical Documentation Requirements:**
1. Device description and specifications
2. Information supplied by manufacturer (IFU, labeling)
3. Design and manufacturing information
4. General safety and performance requirements (GSPR)
5. Benefit-risk analysis
6. Product verification and validation
7. Post-market surveillance plan
8. Post-market clinical follow-up plan

**Quality Management System:**
- EN ISO 13485 mandatory
- Must cover whole lifecycle
- Integrated risk management (ISO 14971)

**Economic Operators:**
- **Manufacturer:** EU entity or authorized representative
- **Authorized Representative:** Must be in EU
- **Importer:** Verify compliance before placing on market
- **Distributor:** Verify device is compliant and registered

**Post-Market Surveillance:**
- Vigilance reporting (serious incidents within 10 days)
- Periodic Safety Update Reports (PSUR) for Class IIa/IIb/III
- Post-market clinical follow-up (PMCF)

**Transition Periods:**
- MDR fully applicable since May 26, 2021
- Extended deadlines for certificates issued under MDD:
  - Class III devices: December 31, 2027
  - Class IIb implantable: December 31, 2027
  - Other Class IIb, IIa, I sterile/measuring: December 31, 2028

**Penalties:**
- Proportionate to risk
- Market withdrawal
- Criminal penalties for serious violations`,
    applicableProducts: ['Medical devices sold in EU', 'Active implantable devices', 'Software as Medical Device', 'Accessories'],
    keywords: ['eu mdr', 'medical device regulation', 'udi', 'eudamed', 'clinical evaluation', 'pmcf', 'notified body', 'iso 13485', 'mdr 2017/745']
  },
  {
    id: 'us-tsca-pfas-1',
    category: 'US Federal',
    regulation: 'TSCA Section 8(a)(7) - PFAS Reporting',
    jurisdiction: 'United States',
    content: `**TSCA PFAS Reporting Requirements**

**Who Must Report:**
- Manufacturers (including importers) of PFAS since 2011
- Article importers (products containing PFAS)
- No de minimis exemption

**Reporting Deadline:**
- Initial deadline: May 8, 2025
- Electronic reporting via CDX

**PFAS Definition (TSCA):**
"Chemical substances that contain at least one of these three structures:
1. R-(CF2)-CF(R')R'', where CF2 and CF are saturated carbons
2. R-CF2OCF2-R', where R/R' can be F, O, or saturated carbons
3. CF3C(CF3)R'R'', where R'/R'' can be F or saturated carbons"

**Information to Report:**
- Chemical identity (structural diagram, CASRN if available)
- Categories of use
- Total volumes manufactured/processed
- Byproducts and disposal
- Environmental and health effects data
- Number of workers exposed
- Exposure assessment data

**Exemptions:**
- R&D only (if < 10kg/year, destroyed after use)
- Microorganisms
- Certain food additives (FDCA regulated)
- Pesticides (FIFRA regulated)

**PFAS Examples:**
- PFOA (Perfluorooctanoic acid)
- PFOS (Perfluorooctane sulfonic acid)
- GenX (HFPO-DA)
- PFBS (Perfluorobutane sulfonic acid)
- Thousands more fluorinated compounds

**State PFAS Regulations:**

**Maine:**
- PFAS reporting required (products)
- PFAS prohibition by 2030

**Washington:**
- PFAS reporting in certain product categories

**Minnesota:**
- PFAS reporting required
- Prohibition dates phased by product

**Vermont:**
- PFAS restrictions in food packaging, firefighting foam

**EU REACH PFAS Restriction Proposal (2023):**
- Proposal to restrict ~10,000 PFAS
- Germany, Netherlands, Norway, Sweden, Denmark proposing
- Would ban PFAS unless essential use proven
- Comment period closed, under evaluation

**PFAS Alternatives:**
- Silicone-based coatings
- Bio-based barriers
- Short-chain PFAS (also under scrutiny)
- Plasma coatings
- Ceramic coatings

**Testing Methods:**
- Total Organic Fluorine (TOF) >50 ppm suggests PFAS
- LC-MS/MS for specific PFAS identification
- Extractable organic fluorine (EOF)

**Business Impact:**
- Significant reporting burden
- Supply chain due diligence required
- Many companies unaware of PFAS in products
- Article importers particularly affected`,
    applicableProducts: ['All PFAS since 2011', 'PTFE', 'Fluorinated polymers', 'Waterproof coatings', 'Firefighting foam', 'Food packaging with PFAS'],
    keywords: ['pfas', 'pfoa', 'pfos', 'genx', 'tsca section 8', 'forever chemicals', 'organic fluorine', 'fluorinated compounds']
  },
  {
    id: 'reach-annex-xiv',
    category: 'EU Chemicals',
    regulation: 'REACH Annex XIV - Authorization List',
    content: `**REACH Annex XIV - Substances Subject to Authorization**

**Purpose:**
Substances of Very High Concern (SVHC) that require specific authorization for use after their sunset date.

**Current Status:**
- 59 entries (as of 2024)
- 223 individual substances

**Authorization Process:**
1. Sunset date passes → Use prohibited without authorization
2. Latest application date → Deadline to submit application
3. ECHA reviews application (includes use-specific risk assessment)
4. European Commission decides on authorization

**Key Entries:**

**Entry 1-7 (Phthalates):**
- DEHP, DBP, BBP, DIBP, DIHP, DCHP
- Sunset dates mostly passed (2015-2019)
- Only specific uses authorized

**Entry 17-18 (Chromium VI):**
- Sodium dichromate, Chromic acid
- Used in plating, anodizing
- Strict workplace controls required

**Entry 20-21 (Arsenic compounds):**
- Arsenic acid, Disodium arsenate
- Wood preservatives, semiconductors

**Entry 30-31 (Lead compounds):**
- Lead chromate pigments
- Lead sulfochromate yellow
- Coatings, paints

**Entry 42-48 (Bisphenol A derivatives):**
- BPA in epoxy resins
- Thermal paper

**Entry 59 (Perfluorobutane sulfonic acid - PFBS):**
- Added 2023
- Used in coatings, cleaning agents
- Sunset date: February 2025

**Applying for Authorization:**
1. Chemical safety report (CSR)
2. Socio-economic analysis (SEA)
3. Analysis of alternatives (AoA)
4. Substitution plan

**Cost:** €50,000-200,000+ per application

**Review Periods:**
- Typically 4-12 years
- Can be shorter for priority substances
- Reviewable at expiration

**Authorizations Granted:**
- Listed in Commission Regulations
- Use-specific (chemical name + use)
- Company-specific

**Downstream User Obligations:**
- Check authorization status
- Ensure supplier has authorization
- Or apply for own authorization

**Non-Compliance:**
- Cannot place on market after sunset without authorization
- Member state enforcement
- Criminal penalties possible`,
    applicableProducts: ['All using Annex XIV substances', 'Plating operations', 'Pigments', 'Plastics with phthalates', 'Coatings'],
    keywords: ['reach annex xiv', 'authorization list', 'sunset date', 'svhc authorization', 'dehp authorization', 'pfbs']
  },
  {
    id: 'reach-annex-xvii',
    category: 'EU Chemicals',
    regulation: 'REACH Annex XVII - Restrictions',
    content: `**REACH Annex XVII - Restrictions on Manufacture, Placing on Market and Use**

**Overview:**
- 70+ entries covering 1000+ substances
- Some restrict specific uses
- Some ban substances entirely
- Applies to all unless specific exemptions

**Key Restrictions by Entry:**

**Entry 23: Cadmium and compounds**
- Prohibited in plastics, paints with limited exceptions
- Limit: 0.01% (100 ppm) in plastics
- Jewelry: 0.01% if extractable
- Bimetallic strips exempted

**Entry 27: Nickel**
- Release limit: 0.5 μg/cm²/week
- Prolonged skin contact (jewelry, watches)
- Spectacle frames, mobile phones

**Entry 43: Azocolourants (Azo dyes)**
- Prohibited in textiles/leather that may come into contact with skin
- Release of aromatic amines >30 ppm prohibited

**Entry 46: Nitrosamines (NDMA, etc.)**
- Prohibited in rubber nipples for babies
- Toys: <0.01 mg/kg releasable

**Entry 47: Chromium VI compounds**
- Cement: <2 mg/kg (soluble CrVI)
- Leather: <3 mg/kg

**Entry 51-52: Phthalates in toys**
- DEHP, DBP, BBP: Prohibited in toys and childcare articles
- DINP, DIDP, DNOP: Prohibited in toys that can be placed in mouth
- Limit: 0.1% sum

**Entry 63: Lead and compounds**
- Jewelry: <0.05% (500 ppm)
- Crystal glass exemptions
- Brass/copper alloys: <0.3-3.5% depending on type

**Entry 66: Mercury**
- Measuring devices prohibited
- Thermometers, barometers (some exemptions for industrial)

**Entry 67: Toluene**
- Adhesives, sprays for general public: <0.1%

**Entry 68: PFOA (Perfluorooctanoic acid)**
- Prohibited in concentrations ≥25 ppb
- Related substances ≥1000 ppb
- Full ban with limited exemptions until 2025

**Entry 72: CMR Substances (1A/1B)**
- Clothing, textiles, footwear: <limit values specified
- Applies to consumer products
- 33 CMR substances listed

**Entry 75: Tattoo inks and permanent makeup**
- Restricts hazardous substances
- Specific concentration limits
- PAHs, metals, colorants regulated

**Compliance Verification:**
- Testing required for restricted substances
- Documentation of compliance
- Risk-based testing program

**Recent Additions (2023-2024):**
- Siloxanes (D4, D5, D6) in wash-off products
- Melamine in food contact
- Microplastics ban

**Enforcement:**
- Member state customs and market surveillance
- Product withdrawal if non-compliant
- Fines and criminal penalties`,
    applicableProducts: ['All consumer products in EU', 'Toys', 'Textiles', 'Jewelry', 'Adhesives', 'Tattoo inks'],
    keywords: ['reach annex xvii', 'restrictions', 'cadmium restriction', 'nickel restriction', 'azo dyes', 'phthalate restriction', 'lead restriction', 'cmr substances']
  }
];

export default additionalRegulations;
