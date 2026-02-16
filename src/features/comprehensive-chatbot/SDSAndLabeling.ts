/**
 * Safety Data Sheets (SDS) and Labeling Knowledge Base
 * 
 * GHS classification, SDS sections, labeling requirements globally.
 */

export const sdsAndLabelingKnowledge = [
  {
    id: 'sds-overview',
    category: 'Safety Documentation',
    topic: 'Safety Data Sheet (SDS) - Complete Guide',
    content: `**Safety Data Sheet (SDS) - 16 Sections**

**Format:** Globally Harmonized System (GHS) standardized format

**Section 1: Identification**
- Product identifier (name, number)
- Recommended uses
- Supplier contact information
- Emergency phone number

**Section 2: Hazard(s) Identification**
- GHS classification
- Signal word (Danger/Warning)
- Hazard statements
- Precautionary statements
- Pictograms

**Section 3: Composition/Information on Ingredients**
- Chemical identity (CAS numbers)
- Concentration or concentration ranges
- Impurities and stabilizing additives

**Section 4: First-Aid Measures**
- Description of necessary measures
- Most important symptoms/effects
- Indication of immediate medical attention

**Section 5: Fire-Fighting Measures**
- Suitable extinguishing media
- Specific hazards from chemical
- Special protective equipment

**Section 6: Accidental Release Measures**
- Personal precautions
- Environmental precautions
- Methods for containment/cleaning

**Section 7: Handling and Storage**
- Precautions for safe handling
- Conditions for safe storage
- Incompatible materials

**Section 8: Exposure Controls/Personal Protection**
- Control parameters (OELs, PELs)
- Appropriate engineering controls
- Individual protection measures

**Section 9: Physical and Chemical Properties**
- Appearance, odor, pH
- Melting/freezing point
- Boiling point
- Flash point
- Flammability
- Solubility
- Viscosity

**Section 10: Stability and Reactivity**
- Reactivity
- Chemical stability
- Possibility of hazardous reactions
- Conditions to avoid
- Incompatible materials

**Section 11: Toxicological Information**
- Routes of exposure
- Symptoms
- Acute toxicity (LD50/LC50)
- Skin corrosion/irritation
- Serious eye damage/irritation
- Respiratory/skin sensitization
- Germ cell mutagenicity
- Carcinogenicity
- Reproductive toxicity

**Section 12: Ecological Information**
- Toxicity to fish, algae, daphnia
- Persistence and degradability
- Bioaccumulative potential
- Mobility in soil

**Section 13: Disposal Considerations**
- Waste treatment methods
- Contaminated packaging

**Section 14: Transport Information**
- UN number
- Proper shipping name
- Transport hazard class
- Packing group
- Environmental hazards
- Special precautions

**Section 15: Regulatory Information**
- Safety, health and environmental regulations
- Chemical inventory status (TSCA, REACH, etc.)

**Section 16: Other Information**
- Preparation/revision date
- Key abbreviations
- References

**SDS Language Requirements:**
- Must be in official language of country
- US: English (OSHA)
- EU: Language of member state
- Canada: English and French

**SDS Update Frequency:**
- When new significant information available
- Minimum every 3-5 years recommended
- Within 3 months of significant change

**Penalties for Non-Compliance:**
- OSHA fines: Up to $15,625 per violation
- EU: Criminal penalties possible
- Market withdrawal`,
    keywords: ['sds', 'safety data sheet', 'msds', 'ghs', '16 sections', 'hazard classification', 'sections 1-16']
  },
  {
    id: 'ghs-labeling',
    category: 'Safety Documentation',
    topic: 'GHS Labeling Requirements',
    content: `**GHS Label Elements**

**Required Label Elements:**

**1. Product Identifier**
- Name or number matching SDS
- May include chemical name

**2. Supplier Identification**
- Name, address, phone
- Emergency contact number

**3. Hazard Pictograms (9 Total)**

| Symbol | Hazard Class | Pictogram |
|--------|--------------|-----------|
| GHS01 | Explosive | 💥 |
| GHS02 | Flammable | 🔥 |
| GHS03 | Oxidizing | 🟡 |
| GHS04 | Compressed Gas | 🫧 |
| GHS05 | Corrosive | 🧪 |
| GHS06 | Acute Toxicity | ☠️ |
| GHS07 | Harmful/Irritant | ⚠️ |
| GHS08 | Health Hazard | 🫁 |
| GHS09 | Environmental | 🌊 |

**4. Signal Word**
- **DANGER** - More severe hazards
- **WARNING** - Less severe hazards
- Only one per label

**5. Hazard Statements**
- Standardized phrases (H-codes)
- H200-H299: Physical hazards
- H300-H399: Health hazards
- H400-H499: Environmental hazards
- Examples:
  - H225: Highly flammable liquid and vapor
  - H314: Causes severe skin burns and eye damage
  - H330: Fatal if inhaled
  - H360: May damage fertility or unborn child

**6. Precautionary Statements**
- Prevention (P1xx)
- Response (P3xx)
- Storage (P4xx)
- Disposal (P5xx)
- Examples:
  - P210: Keep away from heat/sparks/open flames
  - P280: Wear protective gloves/eye protection
  - P310: Immediately call POISON CENTER/doctor
  - P501: Dispose of contents/container to...

**7. Supplemental Information**
- Physical state, route of exposure
- Percentage of ingredient with unknown acute toxicity

**Label Size Requirements:**
| Container Capacity | Minimum Dimensions |
|-------------------|-------------------|
| ≤ 3 liters | 52 × 74 mm |
| 3-50 liters | 74 × 105 mm |
| 50-500 liters | 105 × 148 mm |
| > 500 liters | 148 × 210 mm |

**Small Container Exemptions:**
- May use reduced label for ≤ 125ml
- Must include: Product ID, pictogram, signal word, supplier
- Full info on outer packaging

**Workplace Labels (US OSHA):**
- Product identifier
- Words/pictures indicating hazards
- Can use GHS pictograms or NFPA/HMIS systems`,
    keywords: ['ghs labeling', 'label elements', 'pictograms', 'signal word', 'hazard statements', 'precautionary statements', 'ghs pictograms']
  },
  {
    id: 'transport-labeling',
    category: 'Safety Documentation',
    topic: 'Dangerous Goods Transport Classification',
    content: `**Dangerous Goods Transport (ADR/RID/IMDG/IATA)**

**UN Classification (9 Classes)**

**Class 1: Explosives**
- 1.1: Mass explosion hazard
- 1.2: Projection hazard
- 1.3: Fire hazard
- 1.4: No significant hazard
- 1.5: Insensitive explosives
- 1.6: Extremely insensitive

**Class 2: Gases**
- 2.1: Flammable gases
- 2.2: Non-flammable, non-toxic
- 2.3: Toxic gases

**Class 3: Flammable Liquids**
- Flash point < 60°C

**Class 4: Flammable Solids**
- 4.1: Flammable solids
- 4.2: Spontaneously combustible
- 4.3: Dangerous when wet

**Class 5: Oxidizing Substances**
- 5.1: Oxidizers
- 5.2: Organic peroxides

**Class 6: Toxic and Infectious**
- 6.1: Toxic substances
- 6.2: Infectious substances

**Class 7: Radioactive Material**

**Class 8: Corrosive Substances**

**Class 9: Miscellaneous**
- Environmentally hazardous
- Lithium batteries
- Magnetized material

**Transport Document Requirements:**
- UN number (4-digit)
- Proper shipping name
- Hazard class
- Packing group (I, II, III)
- Total quantity
- Emergency contact

**Limited Quantities (LQ):**
- Smaller packaging exemptions
- Max net quantity per inner packaging
- Marked with LQ diamond
- Reduced requirements

**Excepted Quantities:**
- Very small amounts
- Max 30g/30ml per inner packaging
- Specific packaging required
- No dangerous goods declaration

**Lithium Batteries:**
- UN 3480 (Li-ion, standalone)
- UN 3481 (Li-ion, with equipment)
- UN 3090 (Li-metal, standalone)
- UN 3091 (Li-metal, with equipment)
- Section II, IB, or Section I based on Watt-hour/mass

**Special Provisions:**
- 188: Limited quantities
- 310/314: Lithium batteries
- Various substance-specific provisions`,
    keywords: ['dangerous goods', 'transport', 'adr', 'imdg', 'iata', 'un number', 'un classification', '9 classes', 'lithium batteries', 'limited quantities']
  }
];

export default sdsAndLabelingKnowledge;
