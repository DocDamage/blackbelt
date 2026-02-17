/**
 * Global Compliance Knowledge Base
 * 
 * Comprehensive coverage of chemical regulations, product safety standards,
 * and compliance requirements across all major markets and industries.
 */

export interface ComplianceEntry {
  id: string;
  category: string;
  regulation: string;
  jurisdiction: string;
  content: string;
  applicableProducts: string[];
  keywords: string[];
}

// European Union Regulations
const euRegulations: ComplianceEntry[] = [
  {
    id: 'eu-reach-1',
    category: 'EU Chemicals',
    regulation: 'REACH (EC 1907/2006)',
    jurisdiction: 'European Union',
    content: `**REACH (Registration, Evaluation, Authorization and Restriction of Chemicals)**

**Scope:** All chemical substances manufactured or imported into EU ≥ 1 tonne/year.

**Key Obligations:**
1. **Registration:** Submit dossier to ECHA for each substance
   - 1-10 tonnes: Standard registration
   - 10-100 tonnes: Extended requirements
   - 100+ tonnes: Full chemical safety report
   
2. **Evaluation:** ECHA assesses registration dossiers
   - Compliance check (formal completeness)
   - Substance evaluation (risk assessment)

3. **Authorization:** SVHC substances require specific authorization
   - Annex XIV: Authorization required
   - Sunset date: After which use is prohibited without authorization
   - Review period: Typically 4-12 years

4. **Restriction:** Annex XVII limits or bans substances
   - Currently 70+ entries covering 1000+ substances
   - Examples: Lead in jewelry, phthalates in toys, asbestos

**SVHC (Substances of Very High Concern):**
Categories:
- CMR (Carcinogenic, Mutagenic, Reprotoxic) Cat 1A/1B
- PBT (Persistent, Bioaccumulative, Toxic)
- vPvB (very Persistent, very Bioaccumulative)
- Endocrine disruptors
- Other equivalent concern

**Thresholds:**
- Article 33: Communicate SVHC > 0.1% w/w
- SCIP database notification for SVHC in articles
- Authorization list: Cannot use after sunset without permit

**Penalties:**
- Fines up to €50,000 per violation
- Criminal liability for intentional violations
- Market withdrawal of non-compliant products`,
    applicableProducts: ['All chemical substances', 'Articles containing chemicals', 'Mixtures', 'Products imported to EU'],
    keywords: ['reach', 'echa', 'svhc', 'authorization', 'restriction', 'annex xiv', 'annex xvii', 'scip', 'registration', 'eu chemicals']
  },
  {
    id: 'eu-rohs-1',
    category: 'EU Electronics',
    regulation: 'RoHS (2011/65/EU)',
    jurisdiction: 'European Union',
    content: `**RoHS (Restriction of Hazardous Substances)**

**Scope:** Electrical and electronic equipment (EEE) placed on EU market.

**Restricted Substances (maximum concentration limits):**
| Substance | Limit (ppm) | CAS Number |
|-----------|-------------|------------|
| Lead (Pb) | 1000 | 7439-92-1 |
| Mercury (Hg) | 1000 | 7439-97-6 |
| Cadmium (Cd) | 100 | 7440-43-9 |
| Hexavalent Chromium (CrVI) | 1000 | 18540-29-9 |
| PBB (Polybrominated Biphenyls) | 1000 | Various |
| PBDE (Polybrominated Diphenyl Ethers) | 1000 | Various |
| DEHP | 1000 | 117-81-7 |
| BBP | 1000 | 85-68-7 |
| DBP | 1000 | 84-74-2 |
| DIBP | 1000 | 84-69-5 |

**EEE Categories:**
1. Large household appliances
2. Small household appliances
3. IT and telecommunications equipment
4. Consumer equipment
5. Lighting equipment
6. Electrical and electronic tools
7. Toys, leisure, and sports equipment
8. Medical devices (from 2021)
9. Monitoring and control instruments
10. Automatic dispensers
11. Other EEE not covered above

**Exemptions:**
- Valid for specific applications (Annexes III and IV)
- Must be renewed periodically
- Examples: Lead in glass, mercury in lamps, cadmium in semiconductors

**Compliance Marking:**
- CE marking required
- Technical documentation
- Declaration of Conformity (DoC)

**Penalties:**
- Product withdrawal
- Fines vary by member state (up to €100,000+)
- Criminal prosecution for severe cases`,
    applicableProducts: ['Electronics', 'Electrical equipment', 'IT equipment', 'Appliances', 'Toys with electronics', 'Medical devices'],
    keywords: ['rohs', 'hazardous substances', 'lead', 'mercury', 'cadmium', 'chromium', 'pbb', 'pbde', 'phthalates', 'electronics', 'eee']
  },
  {
    id: 'eu-weee-1',
    category: 'EU Waste',
    regulation: 'WEEE (2012/19/EU)',
    jurisdiction: 'European Union',
    content: `**WEEE (Waste Electrical and Electronic Equipment)**

**Purpose:** Reduce electronic waste, promote recycling, prevent landfill disposal.

**Producer Obligations:**
1. **Registration:** Register with national WEEE authority in each EU country sold
2. **Financing:** Pay for collection, treatment, recycling of WEEE
3. **Reporting:** Report quantities placed on market and recycled
4. **Labeling:** Mark products with crossed-wheelie-bin symbol
5. **Information:** Provide recycling info to consumers

**Collection Targets:**
- 65% of average weight of EEE placed on market over 3 years
- OR 85% of WEEE generated

**Recovery/Recycling Targets:**
| Category | Recovery | Recycling/Reuse |
|----------|----------|-----------------|
| Large appliances | 85% | 80% |
| Small appliances | 75% | 55% |
| IT/Telecom | 85% | 80% |
| Consumer equipment | 85% | 80% |
| Lighting | 85% | 80% |

**WEEE Categories (6):**
1. Temperature exchange equipment
2. Screens, monitors, equipment with screens >100cm²
3. Lamps
4. Large equipment (any external dimension >50cm)
5. Small equipment (no external dimension >50cm)
6. Small IT and telecommunication equipment

**Producer Registration:**
- Unique WEEE registration number per country
- Authorized representative required if no EU establishment
- Annual reporting of placed on market and WEEE handled`,
    applicableProducts: ['All electrical and electronic equipment', 'Batteries in products', 'Lighting products'],
    keywords: ['weee', 'waste', 'recycling', 'producer responsibility', 'electronic waste', 'collection', 'recovery']
  },
  {
    id: 'eu-food-contact-1',
    category: 'EU Food Safety',
    regulation: 'EU 10/2011 (Food Contact Plastics)',
    jurisdiction: 'European Union',
    content: `**EU Food Contact Materials - Plastics Regulation**

**Scope:** Plastic materials and articles intended to come into contact with food.

**Key Requirements:**
1. **Union List (Annex I):** Only authorized substances may be used
   - Currently 1000+ authorized substances
   - Includes monomers, additives, polymer production aids
   - Each has specific restrictions (SML, QM, QMA)

2. **Specific Migration Limits (SML):**
   - Maximum amount allowed to migrate into food
   - Measured in mg/kg food or mg/dm²
   - Example: BPA SML = 0.05 mg/kg

3. **Overall Migration Limit (OML):**
   - Maximum 60 mg/kg food or 10 mg/dm²
   - Total of all substances migrating

4. **Declaration of Compliance (DoC):**
   - Must accompany products at marketing stages
   - Specifies authorized uses, temperature, food types
   - Migration test results

**Testing Requirements:**
- Overall migration (OML)
- Specific migration (SML) for restricted substances
- Heavy metals (Ba, Co, Cu, Fe, Li, Mn, Zn)
- Primary aromatic amines (PAA)
- Volatile substances

**Dual-Use Additives:**
- Must comply with both food contact and food additive regulations
- Example: Certain antioxidants, colorants

**Bisphenol A (BPA) Restrictions:**
- SML: 0.05 mg/kg
- Prohibited in baby bottles
- New restrictions effective 2025 for other products`,
    applicableProducts: ['Plastic food containers', 'Packaging materials', 'Kitchen utensils', 'Baby bottles', 'Food processing equipment'],
    keywords: ['food contact', 'migration', 'sml', 'oml', 'union list', 'food packaging', 'bpa', 'plastics regulation']
  }
];

// United States Regulations
const usRegulations: ComplianceEntry[] = [
  {
    id: 'us-prop65-1',
    category: 'US California',
    regulation: 'Proposition 65 (Safe Drinking Water and Toxic Enforcement Act)',
    jurisdiction: 'California, USA',
    content: `**California Proposition 65**

**Purpose:** Warn consumers about significant exposure to chemicals causing cancer, birth defects, or reproductive harm.

**Key Requirements:**
1. **Warning Requirements:** Clear and reasonable warnings before exposure
   - New regulations (2018) require specific warning format
   - Must identify at least one chemical by name

2. **Safe Harbor Warnings:**
   - Standard format provides "safe harbor" from enforcement
   - Required elements: ⚠️ symbol, "WARNING", chemical name, exposure risk
   - Example: "WARNING: This product can expose you to [chemical], which is known to the State of California to cause cancer."

**Chemical List:**
- 900+ chemicals listed (updated at least annually)
- No de minimis level (any exposure requires warning unless exempt)
- Two categories: Cancer, Reproductive Toxicity

**Exposure Limits (NSRLs and MADLs):**
- **NSRL (No Significant Risk Level):** For cancer chemicals
  - Maximum daily intake posing no significant risk (1 in 100,000)
- **MADL (Maximum Allowable Dose Level):** For reproductive toxicants
  - No observable effect level divided by 1,000

**Common Listed Chemicals:**
- Lead and lead compounds
- Phthalates (DEHP, DBP, BBP, DIDP, DINP)
- Bisphenol A (BPA)
- Acrylamide
- Cadmium
- Formaldehyde
- Wood dust

**Enforcement:**
- Private attorney general actions (bounty hunters)
- Penalties: Up to $2,500 per violation per day
- 60-day notice of violation before lawsuit
- Settlements often include reformulation

**Exemptions:**
- Naturally occurring chemicals in food
- Businesses with <10 employees
- Government agencies
- Exposures below NSRL/MADL

**Compliance Strategies:**
1. Warning labels on products
2. Point-of-sale warnings
3. Website warnings
4. Product reformulation to eliminate listed chemicals
5. Exposure assessment to demonstrate below safe harbor levels`,
    applicableProducts: ['All consumer products sold in California', 'Food products', 'Cosmetics', 'Building materials', 'Furniture', 'Electronics'],
    keywords: ['prop 65', 'proposition 65', 'california', 'warning label', 'cancer warning', 'reproductive toxicity', 'safe harbor', 'nsrl', 'madl']
  },
  {
    id: 'us-tsca-1',
    category: 'US Federal',
    regulation: 'TSCA (Toxic Substances Control Act)',
    jurisdiction: 'United States',
    content: `**TSCA (Toxic Substances Control Act)**

**Administered by:** EPA (Environmental Protection Agency)

**Scope:** All chemical substances manufactured, imported, or processed in the US (excluding pesticides, food, drugs, cosmetics).

**Key Provisions:**

**1. TSCA Section 5 - New Chemicals:**
- Pre-manufacture notification (PMN) required 90 days before production
- Significant New Use Rules (SNURs) for existing chemicals
- EPA can restrict or prohibit manufacture

**2. TSCA Section 6 - Existing Chemicals:**
- EPA can ban or restrict chemicals posing unreasonable risk
- Recent focus on PBT chemicals (persistent, bioaccumulative, toxic)

**3. TSCA Section 8 - Reporting:**
- Chemical Data Reporting (CDR) every 4 years
- Required if manufacture/import ≥ 25,000 lbs/year
- Lower threshold (2,500 lbs) for certain chemicals

**4. TSCA Section 8(b) - Inventory:**
- Active vs. inactive substance designation
- "Reset" completed in 2019
- New chemicals added after PMN approval

**5 TSCA Section 8(e) - Substantial Risk Reporting:**
- Must report within 30 days if new information suggests substantial risk
- Applies to manufacturers, processors, distributors

**Priority Chemicals Under Review:**
- Asbestos
- 1,4-Dioxane
- HBCD (Hexabromocyclododecane)
- Phthalates
- PFAS (Per- and polyfluoroalkyl substances)

**PFAS Specific Requirements:**
- Reporting for PFAS manufactured since 2011
- Significant reporting burden (2024 deadline)
- Includes article importers

**Penalties:**
- Civil: Up to $50,000 per violation per day
- Criminal: Up to $250,000 fine and/or 1 year imprisonment
- Administrative orders for compliance`,
    applicableProducts: ['Chemical substances', 'Articles containing regulated chemicals', 'Plastics', 'Chemical mixtures', 'Industrial chemicals'],
    keywords: ['tsca', 'epa', 'pmn', 'snur', 'chemical inventory', 'cdp', 'reporting', 'new chemicals', 'existing chemicals']
  },
  {
    id: 'us-fda-food-contact-1',
    category: 'US Food Safety',
    regulation: 'FDA Food Contact Notifications (21 CFR 170-189)',
    jurisdiction: 'United States',
    content: `**FDA Food Contact Substance (FCS) Regulations**

**Legal Authority:** FD&C Act, 21 CFR Parts 170-189

**Regulatory Framework:**
1. **Food Additive Regulations (21 CFR 170-189):** Direct (Part 172) and indirect additives (Parts 174-178)
2. **Food Contact Notifications (FCN):** Premarket notification, effective 120 days unless FDA objects
3. **GRAS:** Self-determination or FDA notification
4. **TOR Exemption:** For dietary concentration ≤ 0.5 ppb

**Key Substance Categories:**
- **Polymers (21 CFR 177):** Polyethylene (177.1520), Polycarbonate (177.1580), Polystyrene (177.1640)
- **Adhesives (21 CFR 175.105):** Permitted substances with migration limits
- **Paper/Paperboard (21 CFR 176):** Components and defoamers
- **Colorants (21 CFR 178.3297):** For polymers

**Conditions of Use:**
| Temperature | Range | Example |
|-------------|-------|---------|
| Freezer | ≤ -10°C | Frozen food packaging |
| Refrigerated | ≤ 10°C | Dairy containers |
| Room temp | ≤ 40°C | Dry goods |
| Hot fill | 66-100°C | Coffee cups |
| Retort | > 100°C | Canned foods |
| Cooking | > 121°C | Ovenware |

**Food Types & Simulants:**
| Type | Description | Simulant |
|------|-------------|----------|
| I | Non-acid, aqueous | 10% ethanol |
| II | Acidic, aqueous | 3% acetic acid |
| III-IV | Alcoholic | 10-50% ethanol |
| V | Fatty | n-heptane or oil |
| VI-IX | Dry foods | MPPO (Tenax) |

**Chemicals of Concern:**
- **BPA:** Banned in baby bottles/sippy cups
- **PFAS:** Phasing out long-chain PFAS
- **Phthalates:** Limited use (DEHP, DBP, BBP)
- **Heavy metals:** Strict limits

**Recycled Plastics (21 CFR 177.1630):**
- Letter of Non-Objection (LNO) required from FDA
- Challenge testing for contaminant removal
- Source control requirements

**Compliance Documentation:**
- Declaration of Compliance (DoC)
- Letters of guaranty
- Migration testing reports
- Regulatory status documents`,
    applicableProducts: ['Food packaging', 'Food processing equipment', 'Kitchenware', 'Beverage containers', 'Food storage', 'Plastics in food contact', 'Paper food packaging', 'Can coatings', 'Recycled plastics'],
    keywords: ['fda', 'food contact', 'fcn', 'food additive', 'gras', 'migration', 'food packaging', 'indirect additive', '21 cfr 170', '21 cfr 177', 'recycled plastics', 'lno', 'threshold of regulation']
  }
];

// Asia-Pacific Regulations
const apacRegulations: ComplianceEntry[] = [
  {
    id: 'cn-reach-1',
    category: 'China Chemicals',
    regulation: 'China REACH (MEE Order No. 12)',
    jurisdiction: 'China',
    content: `**China REACH - Regulation on Environmental Management of New Chemical Substances**

**Scope:** New chemical substances manufactured or imported into China.

**Key Requirements:**

**1. IECSC (Inventory of Existing Chemical Substances in China):**
- Check if substance is listed (~45,000 substances)
- Listed = Existing chemical (no registration)
- Not listed = New chemical (registration required)

**2. Registration Types:**

**Standard Registration:**
- ≥ 1 tonne/year
- Data requirements based on tonnage band
- Chinese testing required for higher tonnages
- Processing time: 6-12 months

**Simplified Registration:**
- Research and development
- Process development
- Specific low-volume uses
- Lower data requirements

**3. Data Requirements (Standard):**
- Physicochemical properties
- Toxicological data (acute, sub-chronic, chronic)
- Ecotoxicological data
- Environmental fate
- Testing must follow Chinese standards (GB)

**4. Registration Certificate:**
- Valid for 5 years
- Can apply for extension
- Includes approved uses and volume limits

**5. Reporting Obligations:**
- Annual activity report
- Post-registration data if new hazard info emerges

**Penalties:**
- Fines: CNY 200,000 - 1,000,000
- Business suspension
- Criminal liability for serious cases

**Comparison to EU REACH:**
- Similar concept but separate system
- No pre-registration phase
- Different data requirements
- Different inventory
- Separate registration for each legal entity`,
    applicableProducts: ['Chemical substances imported to China', 'New chemicals manufactured in China', 'Chemical mixtures'],
    keywords: ['china reach', 'mee', 'iecsc', 'chemical registration', 'new chemical substances', 'chinese chemicals']
  },
  {
    id: 'kr-reach-1',
    category: 'South Korea Chemicals',
    regulation: 'K-REACH (Act on Registration and Evaluation of Chemicals)',
    jurisdiction: 'South Korea',
    content: `**K-REACH - Korea REACH**

**Scope:** New chemical substances and existing substances ≥ 1 tonne/year.

**Key Components:**

**1. Registration:**
- **Existing Chemicals:** (KECI listed ~43,000 substances)
  - Pre-registration (2019 deadline passed)
  - Joint registration for priority substances
- **New Chemicals:**
  - Registration required before manufacture/import
  - Standard or simplified based on tonnage

**2. Registration Tonnage Bands:**
| Tonnage | Data Requirements |
|---------|-------------------|
| 0.1-1 t/y | Simplified |
| 1-10 t/y | Basic set |
| 10-100 t/y | Extended set |
| 100-1000 t/y | Full set |
| 1000+ t/y | Full set + CSR |

**3. CMR Substances:**
- Carcinogenic, Mutagenic, Reprotoxic substances
- Strict reporting and management
- Priority for risk assessment

**4. Product and Process Oriented Research (PPORD):**
- Exemption for R&D
- Volume limited to 1 tonne/year
- Must report to MOE

**5. Polymers:**
- Monomers and additives ≥ 2% must be registered
- Polymer of Low Concern (PLC) criteria available

**6. Only Representative (OR):**
- Non-Korean companies can appoint OR
- OR assumes importer obligations
- Must be based in Korea

**Penalties:**
- Fines: KRW 100 million (~$75,000)
- Imprisonment: Up to 7 years
- Business suspension possible`,
    applicableProducts: ['Chemical substances in South Korea', 'Imported chemicals', 'Polymers', 'Chemical mixtures'],
    keywords: ['k-reach', 'korea reach', 'keci', 'chemical registration', 'moek', 'cmr substances', 'joint registration']
  },
  {
    id: 'jp-cscl-1',
    category: 'Japan Chemicals',
    regulation: 'CSCL (Chemical Substances Control Law)',
    jurisdiction: 'Japan',
    content: `**Japan CSCL - Chemical Substances Control Law**

**Scope:** All industrial chemicals manufactured or imported in Japan.

**Regulatory Categories:**

**1. Existing Chemical Substances (ENCS):**
- ~21,000 substances listed
- No notification required
- Listed in two parts (Part 1 and Part 2)

**2. New Chemical Substances:**
- Pre-market notification required to METI
- Small quantity or polymer exemptions available
- Review period: ~3 months

**3. Class I Specified Chemical Substances:**
- Persistent, bioaccumulative, long-term toxicity
- Strict production/import permission system
- Examples: PCBs, DDT, aldrin

**4. Class II Specified Chemical Substances:**
- Persistence and bioaccumulation concerns
- Notification and labeling required
- Examples: Chlordecone, HCB

**5. Monitoring Chemical Substances:**
- Suspected hazards but insufficient data
- Annual reporting of quantities
- ~30 substances currently listed

**Notification Requirements:**
- New chemical notification
- Annual quantity reporting
- Change in use notification
- Hazard data updates

**Testing Requirements:**
- Biodegradation (OECD 301)
- Bioaccumulation (fish)
- Long-term toxicity
- Must use GLP (Good Laboratory Practice)

**Polymer Exemption:**
- Number average MW ≥ 10,000
- Low MW content < 1%
- Not reactive functional groups
- No CMR components ≥ 1%`,
    applicableProducts: ['Industrial chemicals in Japan', 'Imported chemicals', 'Polymers', 'Chemical intermediates'],
    keywords: ['cscl', 'japan chemicals', 'encs', 'meti', 'specified chemicals', 'new chemical notification', 'polymers']
  },
  {
    id: 'au-icos-1',
    category: 'Australia Chemicals',
    regulation: 'AICIS (Australian Industrial Chemicals Introduction Scheme)',
    jurisdiction: 'Australia',
    content: `**AICIS - Australian Industrial Chemicals Introduction Scheme**

**Replaced:** NICNAS (National Industrial Chemicals Notification and Assessment Scheme) as of July 1, 2020.

**Scope:** Industrial chemicals imported or manufactured in Australia.

**Introduction Categories:**

**1. Listed:**
- Chemical on Australian Inventory of Chemical Substances (AICS)
- ~40,000 substances
- No pre-introduction reporting
- Must be introduced at or below listed volume

**2. Exempted:**
- Very low risk
- Annual reporting only
- Examples: Polymers of low concern, R&D ≤ 100kg/year

**3. Reported:**
- Low risk but not exempted
- Pre-introduction report required
- Examples: Low volume introductions (≤ 1 t/y)

**4. Assessed:**
- Higher risk chemicals
- Full assessment certificate required
- 30-60 day assessment period
- Certificates valid for 5 years

**Categorization Criteria:**
- Human health hazard characteristics
- Environment hazard characteristics
- Exposure potential
- Introduction volume

**AICS Confidential Inventory:**
- Confidential listing possible
- Generic chemical name published
- Searchable by introducers

**Obligations:**
- Annual declaration by registered introducers
- Record keeping (5 years)
- Compliance with terms of introduction
- Secondary notification if new hazard info emerges

**Penalties:**
- Civil penalties: AUD 333,000 (individual), AUD 1.665 million (corporation)
- Criminal penalties for serious breaches`,
    applicableProducts: ['Industrial chemicals in Australia', 'Imported chemicals', 'Polymers', 'Cosmetic ingredients (if industrial use)'],
    keywords: ['aicis', 'australia chemicals', 'aics', 'industrial chemicals', 'listed', 'exempted', 'reported', 'assessed']
  }
];

// Plastics and Industry-Specific
const plasticsRegulations: ComplianceEntry[] = [
  {
    id: 'plastics-bpa-1',
    category: 'Global Plastics',
    regulation: 'Bisphenol A (BPA) Restrictions',
    jurisdiction: 'Multiple',
    content: `**Bisphenol A (BPA) Global Regulations**

**What is BPA?**
- Chemical used to make polycarbonate plastics and epoxy resins
- Concerns about endocrine disruption
- Migration from packaging into food

**EU Restrictions:**
- **Food Contact:** SML = 0.05 mg/kg (10/2011)
- **Baby Bottles:** Prohibited since 2011
- **Sippy Cups:** Prohibited
- **Other Products:** Under review for additional restrictions (2025)
- **Thermal Paper:** Prohibited since 2020

**US Restrictions:**
- **FDA:** Banned in baby bottles and sippy cups (2012)
- **State Laws:**
  - California: Prop 65 warning required
  - New York, Washington, Vermont: Various restrictions
  - Connecticut: Ban in reusable food/beverage containers
- **FDA continues to study** safety in other applications

**Canada:**
- Listed as toxic substance under CEPA
- Prohibited in baby bottles
- BPA-free alternatives encouraged

**China:**
- Prohibited in infant food containers
- Migration limits for other uses
- GB standards specify testing methods

**Japan:**
- Voluntary industry reduction
- No strict bans but monitoring
- Consumer preference for BPA-free

**Alternatives to BPA:**
- BPS (Bisphenol S) - similar concerns emerging
- BPF (Bisphenol F) - similar concerns
- Tritan™ copolyester
- Glass, stainless steel
- Plant-based alternatives

**Testing Methods:**
- EU: EN 13130 series
- US FDA: Guidance for industry
- Migration testing with food simulants
- LC-MS/MS detection

**Labeling:**
- "BPA-Free" claims must be truthful
- EU prohibits misleading BPA-free claims for baby bottles
- Some jurisdictions require warnings instead of "free" claims`,
    applicableProducts: ['Polycarbonate plastics', 'Epoxy can coatings', 'Thermal paper', 'Food containers', 'Baby bottles', 'Medical devices'],
    keywords: ['bpa', 'bisphenol a', 'endocrine disruptor', 'polycarbonate', 'baby bottles', 'food contact', 'migration']
  },
  {
    id: 'plastics-phthalates-1',
    category: 'Global Plastics',
    regulation: 'Phthalate Restrictions',
    jurisdiction: 'Multiple',
    content: `**Phthalate Regulations Global Overview**

**Common Phthalates and Uses:**
- **DEHP:** PVC plasticizer (being phased out)
- **DBP:** Adhesives, inks, PVC
- **BBP:** Vinyl flooring, adhesives
- **DINP:** PVC, toys (replacing DEHP)
- **DIDP:** Wire/cable, automotive
- **DNOP:** Food wrap, medical tubing

**EU Restrictions:**

**REACH Annex XVII:**
- Toys/Childcare: DEHP, DBP, BBP prohibited
- Toys that can be placed in mouth: DINP, DIDP, DNOP prohibited
- Limit: 0.1% in plasticized material

**RoHS:**
- DEHP, BBP, DBP, DIBP restricted in electronics (0.1%)

**REACH SVHC:**
- DEHP, DBP, BBP, DIBP, DCHP as SVHCs
- Communication required if > 0.1%

**US Restrictions:**

**CPSC:**
- Children's toys: DEHP, DBP, BBP prohibited (permanent ban)
- Children's toys: DINP prohibited (interim)
- Limit: 0.1%

**California Prop 65:**
- DEHP, DBP, BBP, DIDP, DINP listed
- Warnings required for significant exposure

**State Laws:**
- Vermont, Washington: Children's product reporting
- Multiple states considering bans

**Other Regions:**

**Canada:**
- DEHP in toys prohibited
- Proposed restrictions on other phthalates

**China:**
- GB 6675: DEHP, DBP, BBP prohibited in toys (0.1%)
- GB standards for food contact

**Japan:**
- voluntary standards for toys

**Alternatives:**
- DINCH (BASF)
- DEHT/DOTP (Eastman)
- Bio-based plasticizers
- Citrate esters
- Polymeric plasticizers

**Testing:**
- CPSC-CH-C1001-09 (US)
- EN 71-9 (EU toys)
- GC-MS analysis
- Sample preparation critical`,
    applicableProducts: ['PVC products', 'Toys', 'Childcare articles', 'Food packaging', 'Medical devices', 'Wire/cable', 'Flooring'],
    keywords: ['phthalates', 'dehp', 'dbp', 'bbp', 'dinp', 'didp', 'plasticizers', 'pvc', 'toys', 'endocrine disruptors']
  },
  {
    id: 'plastics-heavy-metals-1',
    category: 'Global Plastics',
    regulation: 'Heavy Metals in Plastics Restrictions',
    jurisdiction: 'Multiple',
    content: `**Heavy Metals Restrictions in Plastics and Products**

**Lead (Pb):**

**EU:**
- REACH Annex XVII: 0.05% in jewelry
- RoHS: 0.1% in electronics
- Packaging: 100 ppm total (94/62/EC)
- Paint: 0.009% (toys)

**US:**
- CPSIA: 100 ppm in children's products (accessible parts)
- 90 ppm in paint
- California: Prop 65 warning for lead

**Cadmium (Cd):**

**EU:**
- REACH Annex XVII: Prohibited in jewelry, plastics, paints
- RoHS: 0.01% (100 ppm) in electronics
- Packaging: 100 ppm total

**US:**
- CPSIA: 75 ppm in paint (children's products)
- CPSC guidance for cadmium in jewelry
- Illinois, Minnesota: State-specific restrictions

**Mercury (Hg):**
- RoHS: 0.1% in electronics
- Batteries: restricted (98/101/EC)
- Thermometers: phasing out

**Hexavalent Chromium (CrVI):**
- RoHS: 0.1% in electronics
- REACH: Restricted in various applications
- Leather: 3 ppm limit

**Testing Methods:**
- XRF (screening)
- ICP-OES or ICP-MS (confirmation)
- Sample digestion required
- CPSC-CH-E1001-08.3 (US toys)

**Packaging Heavy Metals (EU 94/62/EC):**
- Sum of Pb, Cd, Hg, Cr(VI) ≤ 100 ppm
- Essential for all packaging in EU
- Certificate of compliance recommended

**Conflict Minerals (US Dodd-Frank):**
- 3TG: Tin, Tantalum, Tungsten, Gold
- Reporting required for SEC-registered companies
- Due diligence on supply chain
- No prohibition, just disclosure

**Emerging Concerns:**
- Arsenic in wood, glass
- Antimony as catalyst residue (PET)
- Cobalt in pigments
- Nickel in plastics (allergen)`,
    applicableProducts: ['All consumer products', 'Electronics', 'Toys', 'Jewelry', 'Packaging', 'Paint', 'Plastics with pigments'],
    keywords: ['heavy metals', 'lead', 'cadmium', 'mercury', 'chromium', 'rohs', 'cpsia', 'packaging', 'jewelry']
  }
];

// Additional EU Regulations
const euAdditionalRegulations: ComplianceEntry[] = [
  {
    id: 'eu-pops-1',
    category: 'EU POPS',
    regulation: 'EU POPS Regulation (2019/1021)',
    jurisdiction: 'European Union',
    content: `**EU POPS Regulation - Persistent Organic Pollutants**

**Legal Basis:** Stockholm Convention and Aarhus Protocol - regulates substances that persist in environment, bioaccumulate, and pose long-term risks.

**Key Substances and Restrictions:**

**1. PFOS (Perfluorooctane sulfonic acid) and derivatives:**
- **Limit:** 10 mg/kg (0.001%) in substances/mixtures
- **Articles:** 0.1% by weight (textiles, coatings)
- **Semi-finished products:** 1 μg/m² for textiles
- **Uses restricted:** Chrome plating, hydraulic fluids, photoresists, firefighting foam

**2. PFOA (Perfluorooctanoic acid) and salts:**
- **Limit:** 25 ppb for PFOA; 1000 ppb for PFOA-related substances
- **Effective:** July 4, 2020 (main restriction)
- **Exemptions:** Protective clothing for firefighters, medical textiles

**3. SCCPs (Short Chain Chlorinated Paraffins - C10-C13):**
- **Limit:** 1% in substances/mixtures
- **Articles:** 0.15% by weight

**4. HBCDD (Hexabromocyclododecane):**
- **Limit:** 100 mg/kg in substances/mixtures/articles
- **Recycled polystyrene exemption until 2036**

**5. Other Restricted POPS:** PCBs, DDT, Chlordane, Dieldrin, Endrin, Heptachlor, Toxaphene, Mirex, HCB

**Compliance Actions:** Screen supply chain, test products, obtain declarations

**Testing Methods:** LC-MS/MS for PFAS, GC-MS for SCCPs, LC-MS/MS for HBCDD`,
    applicableProducts: ['Textiles', 'Electronics', 'Firefighting equipment', 'Metalworking fluids', 'Plasticizers', 'Recycled materials'],
    keywords: ['pops', 'persistent organic pollutants', 'stockholm convention', 'pfos', 'pfoa', 'sccp', 'hbcd', 'pcbs', 'chlorinated paraffins']
  },
  {
    id: 'eu-mdr-1',
    category: 'EU Medical Devices',
    regulation: 'EU MDR (2017/745)',
    jurisdiction: 'European Union',
    content: `**EU MDR - Medical Device Regulation (2017/745)**

**Scope:** All medical devices placed on EU market (Class I, IIa, IIb, III).

**Device Classification:**
| Class | Risk | Examples | Route |
|-------|------|----------|-------|
| I | Low | Bandages, gloves | Self-cert |
| IIa | Medium | Hearing aids | Notified Body |
| IIb | Higher | Infusion pumps | Notified Body |
| III | High | Heart valves | Notified Body |

**Key Requirements:**
- **UDI:** Unique Device Identification mandatory
- **EUDAMED:** Device registration in EU database
- **Technical Documentation:** Including clinical evidence
- **Quality Management:** EN ISO 13485 required

**Transition Timeline:**
- Class III/IIb active: Dec 31, 2027
- Class IIa/I: Dec 31, 2028

**Penalties:** Up to €10 million or 4% annual turnover`,
    applicableProducts: ['Medical devices', 'Active implants', 'Surgical instruments', 'Diagnostic equipment', 'Software as Medical Device'],
    keywords: ['eu mdr', 'medical device regulation', 'udi', 'eudamed', 'notified body', 'iso 13485', 'class i', 'class ii', 'class iii']
  },
  {
    id: 'eu-reach-14',
    category: 'EU REACH Authorization',
    regulation: 'REACH Annex XIV (Authorization)',
    jurisdiction: 'European Union',
    content: `**REACH Annex XIV - Substances Subject to Authorization**

**Key Terms:**
- **Sunset Date:** After this, use prohibited without authorization
- **Latest Application Date:** Deadline for submitting application

**Current Substances (Selected):**
| Substance | Sunset Date | CAS |
|-----------|-------------|-----|
| DEHP | 2015-02-21 | 117-81-7 |
| DBP | 2015-02-21 | 84-74-2 |
| BBP | 2015-02-21 | 85-68-7 |
| DIBP | 2020-02-21 | 84-69-5 |
| Chromium trioxide | 2017-09-21 | 1333-82-0 |

**Authorization Justification:** Substitution plan, socio-economic analysis, alternatives analysis

**Compliance Actions:** Screen supply chain, check sunset dates, plan substitution or authorization`,
    applicableProducts: ['Chemical substances', 'Chrome plating', 'Phthalates in plastics', 'Industrial chemicals'],
    keywords: ['reach annex xiv', 'authorization', 'sunset date', 'svhc authorization', 'dehp authorization', 'chromium authorization']
  },
  {
    id: 'eu-reach-17',
    category: 'EU REACH Restrictions',
    regulation: 'REACH Annex XVII (Restrictions)',
    jurisdiction: 'European Union',
    content: `**REACH Annex XVII - Restrictions on Dangerous Substances**

**70+ entries covering 1000+ substances**

**Common Restrictions:**

**1. CMR Substances:**
- Entry 28-30: Prohibited in consumer products
- Entry 72: 33 CMRs restricted in clothing/textiles

**2. Phthalates:**
- Entry 51: DEHP, DBP, BBP ≤ 0.1% in toys
- Entry 52: DINP, DIDP, DNOP ≤ 0.1% in mouthable toys

**3. Heavy Metals:**
- Entry 63: Lead ≤ 0.05% in jewelry
- Entry 23: Cadmium ≤ 0.01% in plastics

**4. PFAS:**
- Entry 68: PFOA ≤ 25 ppb

**5. Recent Additions:**
- Microplastics: Intentionally added prohibited
- Formaldehyde: 0.062 mg/m³ emission limit (Entry 77)
- Dioxane: ≤ 10 mg/kg in cosmetics (Entry 76)`,
    applicableProducts: ['Consumer products', 'Toys', 'Textiles', 'Electronics', 'Jewelry', 'Plastics', 'Chemicals'],
    keywords: ['reach annex xvii', 'restrictions', 'cmr', 'lead restriction', 'cadmium restriction', 'phthalate restriction', 'microplastics']
  }
];

// Additional US Regulations
const usAdditionalRegulations: ComplianceEntry[] = [
  {
    id: 'us-tsca-6',
    category: 'US Federal',
    regulation: 'TSCA Section 6 - Existing Chemical Restrictions',
    jurisdiction: 'United States',
    content: `**TSCA Section 6 - Existing Chemical Risk Management**

**Current Restrictions:**

**1. PCE (Perchloroethylene):**
- Prohibited in most consumer products
- Workplace restrictions for dry cleaning

**2. TCE (Trichloroethylene):**
- Prohibited: Aerosol/vapor degreasing
- Allowed: Some aerospace/military with controls

**3. Methylene Chloride:**
- Prohibited in consumer paint strippers (2019)
- Industrial use with strict controls

**4. HBCDD:**
- Prohibited with recycling exemption until 2026

**PBT Chemicals - Section 6(h):**
- 2,4,6-TTBP: ≤ 0.3% in containers
- DecaBDE: Phased out
- PIP (3:1): Extended phase-out timeline

**Penalties:** Up to $50,000 per violation per day`,
    applicableProducts: ['Chemical manufacturing', 'Dry cleaning', 'Metal finishing', 'Aerospace', 'Plastics'],
    keywords: ['tsca section 6', 'existing chemicals', 'pce', 'tce', 'methylene chloride', 'hbcd', 'pbt chemicals']
  },
  {
    id: 'us-pfas-1',
    category: 'US Federal',
    regulation: 'PFAS Regulations (Federal and State)',
    jurisdiction: 'United States',
    content: `**PFAS (Per- and Polyfluoroalkyl Substances) - "Forever Chemicals"**

**Federal Regulations:**

**1. TSCA Section 8(a)(7) Reporting:**
- Manufacturers/importers of PFAS since 2011 must report
- Extensive data on use, volumes, disposal

**2. EPA Drinking Water Standards (2024):**
- PFOA: 4 ppt
- PFOS: 4 ppt
- PFHxS, PFNA, GenX: 10 ppt each

**3. EPA CERCLA Designation (2024):**
- PFOA and PFOS designated hazardous substances
- Superfund liability for releases

**State Regulations:**
- **Maine:** All products PFAS-free by 2030
- **California:** Prop 65 listings, disclosure requirements
- **Washington, New York, Vermont:** Food packaging bans

**Testing:** Targeted LC-MS/MS, Total Organic Fluorine (50 ppm threshold)`,
    applicableProducts: ['Food packaging', 'Textiles', 'Firefighting foam', 'Metal plating', 'Semiconductors'],
    keywords: ['pfas', 'forever chemicals', 'pfoa', 'pfos', 'drinking water', 'tsca reporting', 'state pfas laws']
  }
];

// California ESG Regulations
const californiaESGRegulations: ComplianceEntry[] = [
  {
    id: 'ca-sb253-1',
    category: 'California ESG',
    regulation: 'CA SB-253 (Climate Corporate Data Accountability Act)',
    jurisdiction: 'California, USA',
    content: `**CA SB-253 - Climate Corporate Data Accountability Act**

**Effective:** January 1, 2026 (first reporting 2027)

**Scope:** US entities with >$1 billion revenue doing business in CA

**Requirements:**

**Scope 1 & 2 GHG Emissions:**
- Report 2026 data by 2027
- GHG Protocol Corporate Standard
- Limited assurance initially → reasonable by 2030
- Third-party verification required

**Scope 3 GHG Emissions (Value Chain):**
- Report by 2027
- All indirect emissions (suppliers, transport, use, disposal)
- Exemption if Scope 3 < 40% of total

**Penalties:** Up to $500,000 per reporting year

**Supplier Implications:** Large suppliers must provide GHG data to customers`,
    applicableProducts: ['All companies doing business in California', 'Supply chain partners', 'Private equity portfolio companies'],
    keywords: ['ca sb-253', 'sb253', 'climate disclosure', 'scope 1', 'scope 2', 'scope 3', 'ghg emissions', 'california climate']
  },
  {
    id: 'ca-sb261-1',
    category: 'California ESG',
    regulation: 'CA SB-261 (Climate-Related Financial Risk Act)',
    jurisdiction: 'California, USA',
    content: `**CA SB-261 - Climate-Related Financial Risk Act**

**Effective:** January 1, 2026 (biennial reports)

**Scope:** US entities with >$500 million revenue doing business in CA

**Required Disclosures (TCFD-aligned):**

**Governance:**
- Board oversight of climate risks
- Management role in risk assessment

**Strategy:**
- Climate risks and opportunities
- Impact on business strategy
- Scenario analysis

**Risk Management:**
- Process for identifying risks
- Integration into overall risk management

**Metrics and Targets:**
- GHG emissions metrics
- Climate-related targets and progress

**Penalties:** Up to $50,000 per violation

**Overlap with SB-253:** Companies >$1B must comply with BOTH laws`,
    applicableProducts: ['All companies doing business in California', 'Financial institutions', 'Insurance companies', 'Real estate companies'],
    keywords: ['ca sb-261', 'sb261', 'climate financial risk', 'tcfd', 'climate risk disclosure', 'physical risk', 'transition risk']
  }
];

// Halogen-Free Standards
const halogenFreeStandards: ComplianceEntry[] = [
  {
    id: 'halogen-free-1',
    category: 'Electronics Standards',
    regulation: 'Halogen-Free Standards (IEC 61249-2-21, JPCA-ES-01)',
    jurisdiction: 'Global',
    content: `**Halogen-Free Standards for Electronics**

**Purpose:** Reduce environmental impact by eliminating halogenated flame retardants.

**Key Standards:**

**IEC 61249-2-21:**
- Chlorine (Cl): ≤ 900 ppm (0.09%)
- Bromine (Br): ≤ 900 ppm (0.09%)
- Total halogens (Cl + Br): ≤ 1500 ppm (0.15%)

**JPCA-ES-01-2003:**
- Similar limits (Japan-specific)
- Often cited together with IEC standard

**Why Halogen-Free:**
- Dioxins/furans during incineration
- Toxic smoke in fires
- Environmental persistence

**Testing:** EN 14582 (oxygen combustion + ion chromatography)

**Alternatives:**
- Phosphorus-based flame retardants
- Nitrogen-based (melamine derivatives)
- Inorganic (aluminum hydroxide, magnesium hydroxide)

**Industries:** Consumer electronics, automotive, aerospace, medical devices`,
    applicableProducts: ['Printed circuit boards', 'Electronics enclosures', 'Cables and wire insulation', 'Connectors', 'Semiconductor packaging'],
    keywords: ['halogen-free', 'iec 61249', 'jpca-es-01', 'chlorine limit', 'bromine limit', 'tbbpa', 'flame retardant', 'pcb laminates']
  }
];

// UK Regulations (Post-Brexit)
const ukRegulations: ComplianceEntry[] = [
  {
    id: 'uk-reach-1',
    category: 'UK Chemicals',
    regulation: 'UK REACH',
    jurisdiction: 'United Kingdom',
    content: `**UK REACH (Registration, Evaluation, Authorization and Restriction of Chemicals)**

**Post-Brexit Status:**
UK REACH replaced EU REACH in Great Britain (England, Scotland, Wales) on January 1, 2021. Northern Ireland continues under EU REACH.

**Key Differences from EU REACH:**

**1. Registration:**
- New GB-based registrations required for existing substances
- Grandfathering period for EU registrations held by GB entities
- DUIN (Downstream User Import Notification) deadline: October 27, 2023 (CLOSED)

**2. Data Requirements:**
- Can use EU REACH data (with permission)
- Reduced data submission initially (light-touch approach)
- Full data required within specified timeframes

**3. SVHC (Substances of Very High Concern):**
- UK SVHC list mirrors EU initially
- UK can add substances independently
- Current: Subset of EU SVHC list (approximately 28 substances vs 235+)

**4. Authorization:**
- UK Authorization List mirrors EU Annex XIV
- Sunset dates may differ
- GB-based authorization required for continued use

**5. Only Representative (OR):**
- Must be established in Great Britain
- Cannot use EU-based OR for GB market

**6. Agency:**
- HSE (Health and Safety Executive) instead of ECHA
- UK Agency responsible for evaluations

**Compliance Deadlines:**
- **October 27, 2023:** DUIN deadline (for existing EU REACH registrations)
- **October 27, 2026:** Full registration data submission deadline (for grandfathered registrations)

**Penalties:**
- Unlimited fines (determined by courts)
- Up to 2 years imprisonment for serious violations
- Market access denial

**GB vs Northern Ireland:**
| Region | REACH Regulation | Customs |
|--------|------------------|---------|
| Great Britain | UK REACH | UK customs |
| Northern Ireland | EU REACH | EU customs (NI Protocol) |

**Practical Implications:**
- Dual registrations needed for EU + GB markets
- Separate supply chain management
- Increased compliance costs (estimated 20-40% increase)
- Potential divergence over time`,
    applicableProducts: ['Chemicals manufactured/imported into GB', 'Articles with SVHC', 'Northern Ireland goods entering GB'],
    keywords: ['uk reach', 'gb reach', 'brexit chemicals', 'hse', 'duin', 'gb only representative', 'grandfathering', 'great britain reach']
  }
];

// EU Green Deal / Circular Economy Regulations
const euGreenDealRegulations: ComplianceEntry[] = [
  {
    id: 'eu-cbam-1',
    category: 'EU Climate',
    regulation: 'EU CBAM (Carbon Border Adjustment Mechanism)',
    jurisdiction: 'European Union',
    content: `**EU CBAM - Carbon Border Adjustment Mechanism**

**Purpose:** Prevent carbon leakage by equalizing carbon price between EU imports and domestic production.

**Timeline:**
- **October 2023 - December 2025:** Transitional phase (reporting only)
- **January 2026:** Full implementation (purchase of CBAM certificates required)

**Covered Products (Initial):**
| Sector | HS Codes | Embedded Emissions |
|--------|----------|-------------------|
| Cement | 2507, 2523, 6810 | Direct + indirect |
| Iron & Steel | 7201-7229, 7301-7308 | Direct + indirect |
| Aluminum | 7601-7606, 7610 | Direct + indirect |
| Fertilizers | 2808, 3102, 3105 | Direct + indirect |
| Electricity | 2716 | Direct |
| Hydrogen | 2804 | Direct |

**Expansion Planned:**
- Organic chemicals
- Plastics
- Other sectors by 2030

**Reporting Requirements (Transitional Phase):**
- Quarterly reports via CBAM Transitional Registry
- Embedded emissions data (direct + indirect)
- Carbon price paid in country of origin
- Actual emissions or default values

**CBAM Certificates (From 2026):**
- Purchase from national authorities
- Price linked to EU ETS allowance price
- Surrender certificates equal to embedded emissions
- No free allocation (unlike EU ETS)

**Calculation Methodology:**
- **Direct emissions:** Process emissions (Scope 1)
- **Indirect emissions:** Electricity consumed (Scope 2)
- Based on actual data or EU default values
- Must use EU methodology (monitoring & reporting)

**Importer Obligations:**
1. Register as CBAM declarant
2. Calculate/purchase CBAM certificates
3. Submit annual CBAM declaration
4. Keep records for 4 years

**Exemptions:**
- Value < €150 per shipment
- Countries with linked ETS (none currently, UK being considered)
- Military goods

**Penalties:**
- €10-50 per tonne of unreported emissions
- Market access denial for non-compliance
- Criminal sanctions for fraud

**Preparation Checklist:**
☐ Identify if products fall under CBAM
☐ Establish emissions monitoring system
☐ Engage suppliers for upstream emissions data
☐ Register for CBAM Transitional Registry
☐ Prepare quarterly reports
☐ Budget for CBAM certificate purchases (2026+)`,
    applicableProducts: ['Steel imports', 'Aluminum imports', 'Cement imports', 'Fertilizer imports', 'Electricity imports', 'Hydrogen imports'],
    keywords: ['cbam', 'carbon border adjustment', 'carbon pricing', 'embedded emissions', 'climate levy', 'carbon leakage', 'eu ets', 'carbon import tax']
  },
  {
    id: 'eu-dpp-1',
    category: 'EU Circular Economy',
    regulation: 'Digital Product Passport (DPP)',
    jurisdiction: 'European Union',
    content: `**Digital Product Passport (DPP)**

**Legal Basis:** Ecodesign for Sustainable Products Regulation (ESPR)

**Purpose:** Provide product sustainability information throughout value chain via digital access (QR code/data carrier).

**Timeline:**
- **2024:** ESPR entered into force
- **2027:** First DPPs required (batteries)
- **2030:** Full implementation across priority products

**Key Requirements:**

**1. Data Carrier:**
- QR code or other machine-readable identifier
- Linked to unique product identifier
- Must remain accessible throughout product lifetime

**2. Information to Include:**
| Category | Data Elements |
|----------|---------------|
| Identification | Product ID, manufacturer, model |
| Compliance | Certificates, test reports |
| Sustainability | Environmental footprint, recycled content |
| Circularity | Repair instructions, disassembly info |
| Materials | Substances of concern, material composition |
| Traceability | Supply chain information |

**Priority Product Categories (First Wave):**
1. **Batteries** (first, by 2027)
2. Textiles
3. Construction products
4. Electronics/ICT
5. Furniture
6. Plastics
7. Chemicals
8. Steel

**Battery Passport (First Implementation):**
- Most detailed DPP requirements
- Carbon footprint declaration
- Recycled content information
- Due diligence data
- Performance/durability metrics
- Safety information

**Technical Standards:**
- Interoperability required across systems
- Open standards (not proprietary)
- Data governance frameworks
- Access control (public vs restricted data)

**Access Levels:**
| Stakeholder | Access |
|-------------|--------|
| Consumers | Basic sustainability info |
| Value chain actors | Detailed technical data |
| Authorities | Full compliance data |
| Repair shops | Repair/disassembly info |

**Compliance:**
- Manufacturers responsible for data accuracy
- Regular updates required
- Third-party verification for some data
- Penalties under national laws

**Business Preparation:**
- Assess if products in priority categories
- Evaluate data collection systems
- Engage IT vendors for DPP platforms
- Coordinate with suppliers for upstream data
- Plan QR code integration into products`,
    applicableProducts: ['Batteries', 'Textiles', 'Electronics', 'Construction products', 'Furniture', 'Steel products'],
    keywords: ['digital product passport', 'dpp', 'product passport', 'battery passport', 'espr', 'ecodesign', 'circular economy', 'qr code', 'sustainability data']
  },
  {
    id: 'eu-epr-1',
    category: 'EU Circular Economy',
    regulation: 'Extended Producer Responsibility (EPR)',
    jurisdiction: 'European Union',
    content: `**Extended Producer Responsibility (EPR) Framework**

**Definition:** Producers (manufacturers, importers, brand owners) are financially and operationally responsible for product end-of-life management.

**EU Legal Basis:**
- Waste Framework Directive (2008/98/EC)
- Packaging and Packaging Waste Directive
- WEEE Directive
- Battery Directive
- Single-Use Plastics Directive

**Covered Product Categories:**

| Category | Scope | Fees Based On |
|----------|-------|---------------|
| **Packaging** | All packaging placed on market | Material type, weight, recyclability |
| **WEEE** | Electrical/electronic equipment | Category, weight, collection costs |
| **Batteries** | All battery types | Chemistry, weight |
| **Textiles** | Clothing, footwear (new 2025) | Weight, fiber composition |
| **Furniture** | All furniture (new) | Weight, material |
| **Tyres** | Vehicle and industrial | Type, weight |
| **Oils** | Lubricating and industrial | Volume |
| **Agricultural plastics** | Films, containers, nets | Weight |

**Producer Obligations:**

**1. Registration:**
- Register with national EPR scheme in each EU country
- Obtain producer registration number
- Report placed-on-market quantities

**2. Financial Contribution:**
- Pay EPR fees (modulated by recyclability)
- Finance collection, sorting, recycling
- Advance disposal fees for some products

**3. Collection Targets:**
| Category | Target |
|----------|--------|
| Packaging | 65% recycling by 2025 |
| WEEE | 65% collection rate |
| Batteries | 45% collection rate |
| Textiles | Separate collection by 2025 |

**4. Reporting:**
- Annual reporting of quantities placed on market
- Monthly/quarterly fee payments
- Traceability documentation

**New EU Battery Regulation (2023):**
- Extended EPR for all battery types
- Collection targets:
  - Portable: 45% (2023) → 73% (2030)
  - LMT (Light Means of Transport): 51% (2028) → 61% (2031)
  - Industrial/EV: Mandate but no specific targets yet
- Recycling efficiency targets:
  - Lead-acid: 75%
  - Lithium: 65%
  - Nickel-cadmium: 80%

**Packaging EPR - New Rules (2024+):**
- Extended to e-commerce (marketplaces)
- Design for recycling requirements
- Recycled content targets:
  - 35% by 2030
  - 65% by 2040
- Deposit return schemes for beverage containers

**Penalties:**
- Fines (vary by country: €500-€100,000+)
- Market access denial
- Criminal liability for fraud
- Public procurement exclusion

**Compliance Strategy:**
1. Identify all applicable EPR categories
2. Register in each EU member state sold
3. Calculate and budget EPR fees
4. Implement eco-design for recyclability
5. Consider compliance schemes (PROs)`,
    applicableProducts: ['All packaged products', 'Electronics', 'Batteries', 'Textiles', 'Furniture', 'Tires', 'Lubricants'],
    keywords: ['epr', 'extended producer responsibility', 'producer responsibility', 'packaging waste', 'weee', 'battery recycling', 'textile waste', 'circular economy']
  },
  {
    id: 'eu-green-claims-1',
    category: 'EU Marketing',
    regulation: 'EU Green Claims Directive',
    jurisdiction: 'European Union',
    content: `**EU Green Claims Directive (Anti-Greenwashing)**

**Status:** Adopted 2024, member state implementation by 2026

**Purpose:** Combat greenwashing by ensuring environmental claims are substantiated, comparable, and verifiable.

**Scope:** All voluntary environmental claims made by businesses about products or organizations.

**Prohibited Claims:**

**1. Vague/General Claims (without proof):**
- ❌ "Eco-friendly"
- ❌ "Green"
- ❌ "Environmentally friendly"
- ❌ "Natural"
- ❌ "Biodegradable" (without conditions)
- ❌ "Climate neutral" (without explanation)

**2. Misleading Claims:**
- ❌ Presenting legal compliance as exceptional
- ❌ Cherry-picking favorable environmental aspects
- ❌ Using false certifications
- ❌ Misleading product comparisons

**Substantiation Requirements:**

**1. Scientific Evidence:**
- Based on recognized scientific methods
- Lifecycle perspective considered
- Representative of product's life cycle
- Takes into account all significant environmental aspects

**2. Primary Evidence:**
- Specific to the product/organization
- Not generic industry data
- Regularly updated

**3. Verification:**
- Claims must be verified by independent third party
- Prior verification required before use
- Regular re-verification (at least every 5 years)

**Specific Rules for Common Claims:**

| Claim | Requirements |
|-------|-------------|
| **Recyclable** | Clear instructions, infrastructure availability |
| **Recycled content** | Specific percentage, post-consumer vs post-industrial |
| **Biodegradable** | Specific conditions, timeframe, environment |
| **Compostable** | Reference to standard (EN 13432), timeframe |
| **Carbon neutral** | Clear scope, offsetting limitations disclosed |
| **Organic** | Certification required, percentage threshold |

**Carbon Neutrality Claims - Special Rules:**
- Must prioritize emissions reductions in value chain
- Offsetting can only claim for residual emissions
- Must disclose:
  - What portion is actual reduction vs offset
  - Offset standards used (Gold Standard, VCS)
  - Vintage and type of credits

**Comparative Claims:**
- Must compare equivalent products/functions
- Same life cycle stages considered
- Current, verifiable data
- Clear what is being compared

**Labeling Requirements:**
- Environmental labels must be transparent
- Only EU-approved or widely recognized schemes
- New public environmental labels require EU approval
- Existing private schemes must meet criteria

**Enforcement:**
- Competent national authorities
- Penalties proportionate to environmental impact
- Possible penalties:
  - Fines (up to 4% of annual revenue for serious cases)
  - Market exclusion
  - Mandatory corrective advertising

**Compliance Checklist:**
☐ Audit all environmental claims
☐ Remove unsubstantiated vague claims
☐ Gather scientific evidence for remaining claims
☐ Engage third-party verification
☐ Update marketing materials
☐ Train marketing/sales teams
☐ Implement claim approval process`,
    applicableProducts: ['All consumer products', 'B2B products', 'Services', 'Corporate communications'],
    keywords: ['green claims', 'greenwashing', 'environmental marketing', 'eco-friendly claims', 'substantiation', 'climate neutral', 'carbon neutral', 'anti-greenwashing']
  }
];

// Asia-Pacific Extended Regulations
const apacExtendedRegulations: ComplianceEntry[] = [
  {
    id: 'cn-rohs-2-1',
    category: 'China Electronics',
    regulation: 'China RoHS 2 (Administrative Measures)',
    jurisdiction: 'China',
    content: `**China RoHS 2 - Administrative Measures for Restriction of Hazardous Substances**

**Full Title:** Administrative Measures for the Restriction of the Use of Hazardous Substances in Electrical and Electronic Products

**Effective:** July 1, 2016 (replaced original China RoHS)

**Scope:** Electrical and electronic products (EEP) sold in China

**Restricted Substances (Same as EU RoHS):**
| Substance | Limit |
|-----------|-------|
| Lead (Pb) | 0.1% |
| Mercury (Hg) | 0.1% |
| Cadmium (Cd) | 0.01% |
| Hexavalent Chromium (Cr6+) | 0.1% |
| PBB | 0.1% |
| PBDE | 0.1% |

**Key Differences from EU RoHS:**

**1. Two-Step Approach:**

**Step 1 (Current): Marking and Disclosure**
- Mark products with pollution control logo (e-label)
- Table 1 (橙色标志): Contains restricted substances above limits
- Table 2 (绿色标志): Environmentally friendly use period (EFUP) declared
- Required: Material declaration in standardized SJ/T 11364 format

**Step 2 (Implementation Timeline Uncertain):**
- Full restriction of substances (similar to EU)
- Catalog of products subject to mandatory compliance
- CCC certification integration

**2. EFUP (Environmentally Friendly Use Period):**
- Number of years product can safely contain restricted substances
- Marked on product (e.g., "10" for 10 years)
- Different approach from EU RoHS exemptions

**3. Marking (SJ/T 11364-2014):**
- Pollution Control Mark required on product
- Color-coded:
  - **Green logo (e):** EFUP declared, safe for specified period
  - **Orange logo (e):** Contains restricted substances, Table 1 disclosure required
- Marking on product, packaging, and documentation

**4. Material Declaration:**
- Required for all EEP
- Standardized format
- Names and content of restricted substances
- Parts containing restricted substances

**Product Catalog (Step 2):**
When implemented, mandatory compliance applies to:
- Refrigerators
- Washing machines
- Computers
- Printers
- TVs
- Mobile phones
- (Catalog expanded periodically)

**Testing Standards:**
- GB/T 26125 (equivalent to IEC 62321)
- XRF screening accepted
- Chemical confirmation for positive results

**Compliance Requirements:**
1. Determine if product is EEP
2. Test for restricted substances
3. Create material declaration (Table 1 or Table 2)
4. Apply appropriate pollution control mark
5. Prepare supporting documentation

**Penalties:**
- Administrative penalties
- Market withdrawal
- Brand reputation damage
- Note: Less mature enforcement than EU

**Practical Tips:**
- Most manufacturers comply with Step 1 marking
- Step 2 implementation timeline uncertain
- Many treat as de facto EU RoHS compliance
- Market surveillance increasing`,
    applicableProducts: ['Electronics sold in China', 'Computers', 'Phones', 'Appliances', 'Consumer electronics'],
    keywords: ['china rohs', 'china rohs 2', 'sj/t 11364', 'efup', 'pollution control mark', 'e-label', 'administrative measures', 'gb/t 26125']
  },
  {
    id: 'in-rohs-1',
    category: 'India Electronics',
    regulation: 'India RoHS (E-Waste Management Rules)',
    jurisdiction: 'India',
    content: `**India RoHS - E-Waste (Management) Rules**

**Current Regulation:** E-Waste (Management) Rules, 2022 (amended 2023)

**Legal Basis:** Ministry of Environment, Forest and Climate Change (MoEFCC)

**Scope:** Electrical and electronic equipment (EEE) placed on Indian market

**Restricted Substances (Same 6 as EU RoHS):**
| Substance | Limit (ppm) |
|-----------|-------------|
| Lead (Pb) | 1000 |
| Mercury (Hg) | 1000 |
| Cadmium (Cd) | 100 |
| Hexavalent Chromium (Cr6+) | 1000 |
| PBB | 1000 |
| PBDE | 1000 |

**Compliance Deadlines:**

| Phase | EEE Categories | Effective Date |
|-------|----------------|----------------|
| Phase 1 | Large/Small appliances, IT equipment, Telecom | November 1, 2024 |
| Phase 2 | Consumer electronics, lighting, tools, toys | November 1, 2025 |

**EEE Categories (Schedule I):**
1. Large household appliances
2. Small household appliances
3. IT and telecommunication equipment
4. Consumer equipment
5. Lighting equipment
6. Electrical and electronic tools
7. Toys, leisure, and sports equipment
8. Medical devices (with some exemptions)
9. Monitoring and control instruments
10. Automatic dispensers

**Exemptions:**
- Similar to EU RoHS exemptions
- Renewable every 5 years
- Must apply to Central Pollution Control Board (CPCB)

**Producer Obligations:**

**1. Registration:**
- Register with CPCB/State PCB
- Obtain EPR authorization
- File annual returns

**2. E-Waste Collection:**
- Collection targets based on sales volume
- Set up collection centers
- Take-back programs

**3. Recycling:**
- Meet recycling targets:
  - 2023-24: 60% of quantity sold
  - 2024-25: 70%
  - 2025 onwards: 80%

**4. Compliance Documentation:**
- Technical documents (evidence of compliance)
- Self-declaration of conformity
- Test reports (IEC 62321 series)
- Material safety data sheets

**5. Labeling:**
- Crossed-bin symbol required
- Do not dispose with household waste
- Producer contact information

**Import Requirements:**
- Customs clearance requires compliance documentation
- BIS (Bureau of Indian Standards) marking may be required
- Test reports from recognized labs

**Penalties:**
- Environmental compensation
- Fine up to ₹1,00,000 (approx $1,200 USD)
- Repeat violations: up to ₹5,00,000
- Possible imprisonment up to 5 years for serious violations

**Certification:**
- Third-party testing required
- BIS-recognized labs or international equivalents
- Self-certification allowed with proper documentation

**Comparison with EU RoHS:**
| Aspect | India RoHS | EU RoHS |
|--------|------------|---------|
| Substances | Same 6 | Same 6 + 4 phthalates |
| Enforcement | Developing | Mature |
| Testing | IEC 62321 | IEC 62321 |
| EPR | Yes (combined with e-waste) | Separate WEEE |

**Compliance Tips:**
- Start compliance early (enforcement ramping up)
- Ensure supply chain documentation
- Plan for EPR authorization timeline
- Consider combined EU/India testing
- Monitor CPCB notifications for updates`,
    applicableProducts: ['Electronics sold in India', 'IT equipment', 'Appliances', 'Consumer electronics', 'Lighting'],
    keywords: ['india rohs', 'e-waste india', 'india electronics', 'cpcb', 'moefcc', 'india restricted substances', 'schedule i eee']
  }
];

// Combine all regulations
export const globalComplianceKnowledge: ComplianceEntry[] = [
  ...euRegulations,
  ...usRegulations,
  ...apacRegulations,
  ...plasticsRegulations,
  ...euAdditionalRegulations,
  ...usAdditionalRegulations,
  ...californiaESGRegulations,
  ...halogenFreeStandards,
  ...ukRegulations,
  ...euGreenDealRegulations,
  ...apacExtendedRegulations
];

export default globalComplianceKnowledge;
