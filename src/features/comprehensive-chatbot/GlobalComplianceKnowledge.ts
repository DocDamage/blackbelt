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
    regulation: 'FDA Food Contact Notifications',
    jurisdiction: 'United States',
    content: `**FDA Food Contact Substance Regulations**

**Regulatory Framework:**
1. **Food Additive Regulations (21 CFR 170-189):** Direct and indirect additives
2. **Food Contact Notifications (FCN):** Premarket notification for new substances
3. **Generally Recognized as Safe (GRAS):** Self-determination or FDA notification
4. **Threshold of Regulation (TOR):** Exemption for minimal migration

**Key Requirements:**

**1. Food Contact Notification (FCN):**
- Required for new food contact substances
- Effective 120 days after filing unless FDA objects
- Specific to manufacturer/supplier (not transferable)
- Valid indefinitely unless revoked

**2. Conditions of Use:**
- Temperature (freezer, room, hot fill, boiling)
- Food type (aqueous, acidic, fatty, alcoholic)
- Duration (single use, repeated use)

**3. Migration Testing:**
- Food simulants: 10% ethanol, 50% ethanol, 3% acetic acid, n-heptane, MPPO
- Testing conditions match intended use
- Detection limits typically 10-50 ppb

**4. Chemicals of Concern:**
- **BPA:** Banned in baby bottles and sippy cups
- **PFAS:** FDA monitoring and phasing out
- **Phthalates:** Limited use in food contact
- **Heavy metals:** Strict limits

**GRAS Self-Determination:**
- Expert panel evaluation
- Published safety studies
- No FDA notification required (optional)
- Can be challenged by FDA

**Compliance Documentation:**
- Declaration of Compliance (supplier)
- Letters of guaranty
- Migration testing reports
- Regulatory status documents`,
    applicableProducts: ['Food packaging', 'Food processing equipment', 'Kitchenware', 'Beverage containers', 'Food storage'],
    keywords: ['fda', 'food contact', 'fcn', 'food additive', 'gras', 'migration', 'food packaging', 'indirect additive']
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

// Combine all regulations
export const globalComplianceKnowledge: ComplianceEntry[] = [
  ...euRegulations,
  ...usRegulations,
  ...apacRegulations,
  ...plasticsRegulations
];

export default globalComplianceKnowledge;
