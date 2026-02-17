/**
 * Quality Management Software Systems
 * 
 * ERP and QMS software information for manufacturing and compliance.
 */

export const qualitySoftwareSystems = [
  {
    id: 'sage-100',
    category: 'ERP Software',
    system: 'Sage 100 (formerly Sage MAS 90/200)',
    content: `**Sage 100 ERP for Manufacturing and Quality**

**Overview:**
Sage 100 is a mid-market ERP solution popular with small to medium manufacturers (10-500 employees). Strong in accounting, inventory, and basic manufacturing.

**Key Modules for Quality:**

**1. Inventory Management:**
- Lot/Serial tracking
- Expiration date management
- Bin tracking
- ABC analysis
- Cycle counting support
- Quality hold functionality

**2. Bill of Materials (BOM):**
- Multi-level BOMs
- Revision control
- Where-used inquiry
- Component substitution
- Engineering change control (via ECN module)

**3. Work Order Processing:**
- Production tracking
- Labor collection
- Material issues
- Scrap reporting
- Outside processing

**4. Purchase Order:**
- Inspection required flag
- Certificate of compliance tracking
- Vendor performance metrics
- Receiving inspection hold

**5. Sales Order:**
- Certificate of analysis printing
- Quality documentation attachment
- Customer-specific requirements

**Quality-Related Features:**

**Lot Tracking:**
- Full forward/backward traceability
- Lot recall capabilities
- Expiration monitoring
- FEFO/FIFO support

**Inspection Integration:**
- Receiving inspection queues
- QC status (Approved, Hold, Rejected)
- Inspection data entry (via customization or add-on)

**Reporting for Quality:**
- Inventory valuation
- Lot traceability reports
- Production variance analysis
- Vendor performance
- Scrap analysis

**Add-ons for Enhanced Quality:**

**Paperless Manufacturing:**
- Electronic work instructions
- Shop floor data collection
- Real-time production visibility

**Sage Quality Management (3rd party):**
- Non-conformance tracking
- CAPA management
- Document control
- Audit management

**Integration Capabilities:**
- Microsoft Office (Word/Excel)
- BI tools (Sage Intelligence, Power BI)
- EDI integration
- Barcode scanning

**Limitations for Advanced Quality:**
- No native SPC/statistical analysis
- Limited document management
- Basic calibration tracking (custom fields)
- No FMEA/Control Plan tools
- Limited supplier management

**Compliance Support:**
- 21 CFR Part 11: Limited (electronic signatures via add-on)
- ISO 9001: Supports document control, training records, CAPA (with add-ons)
- Traceability: Good lot/serial tracking

**Best For:**
- Discrete manufacturers
- Job shops
- Make-to-order
- Distribution companies
- Small-medium business

**Not Ideal For:**
- Process manufacturing (batch)
- FDA-regulated medical devices (without extensive customization)
- Aerospace AS9100 (limited configuration management)
- Companies needing advanced QMS features

**Migration Path:**
- Sage 100cloud (subscription-based)
- Sage X3 (larger, more complex manufacturing)
- 3rd party QMS integration (MasterControl, EtQ)`,
    keywords: ['sage 100', 'sage erp', 'mas 90', 'manufacturing erp', 'lot tracking', 'bill of materials', 'work orders']
  },
  {
    id: 'iqms-1',
    category: 'QMS Software',
    system: 'IQMS (now part of Dassault Systèmes DELMIAWorks)',
    content: `**IQMS / DELMIAWorks - Manufacturing ERP and QMS**

**Overview:**
IQMS is a comprehensive manufacturing ERP with strong integrated quality management. Now part of Dassault Systèmes as DELMIAWorks. Popular in plastics, medical device, and automotive.

**Core Quality Modules:**

**1. Quality Management System (QMS):**
- Non-conformance tracking (NCR)
- Corrective/Preventive Action (CAPA)
- Supplier corrective action requests (SCAR)
- Customer complaint management
- Audit management (internal, external, layer process)
- Risk assessment (FMEA)

**2. Document Control:**
- Controlled document repository
- Version control
- Approval workflows
- Electronic signatures (21 CFR Part 11 compliant)
- Training documentation linked to documents
- Obsolescence management

**3. Calibration Management:**
- Equipment calibration scheduling
- Calibration procedure storage
- Calibration data entry
- Measurement uncertainty tracking
- Calibration label printing
- Alert notifications for due calibrations

**4. Gage R&R Studies:**
- Built-in Gage R&R calculation
- ANOVA method support
- Gage tracking database
- Calibration and R&R history

**5. SPC (Statistical Process Control):**
- Real-time SPC from shop floor
- Control charts (X-bar, R, S, I-MR, p, np, c, u)
- Cpk/Ppk calculation
- Out-of-control alerting
- Pattern detection rules (Western Electric)

**6. Supplier Quality:**
- Supplier rating system
- Receiving inspection
- Certificate of compliance tracking
- Supplier audit scheduling
- Approved vendor list (AVL)
- Supplier scorecards

**7. Inspection Planning:**
- AQL sampling plans (MIL-STD-105E, ANSI/ASQ Z1.4)
- In-process inspection
- Final inspection
- Inspection data collection
- First Article Inspection (FAI)

**8. Traceability:**
- Lot/Serial control
- Full genealogy tracking
- Container hierarchy
- Shelf life management
- Recall management tools

**Regulatory Compliance:**

**FDA 21 CFR Part 820 (QSR):**
- Device history records (DHR)
- Device master records (DMR)
- Training records
- CAPA system
- Electronic signatures

**ISO 13485 (Medical Devices):**
- Risk management integration
- Design controls
- Validation documentation
- Post-market surveillance

**IATF 16949 (Automotive):**
- APQP support
- PPAP management
- Control plans
- FMEA
- SPC
- MSA

**AS9100 (Aerospace):**
- Configuration management
- First article inspection
- Counterfeit parts prevention
- Key characteristics tracking

**Industry-Specific Features:**

**Plastics/Injection Molding:**
- Machine integration (real-time)
- Process monitoring
- Cavity-specific tracking
- Regrind management
- Mold maintenance scheduling

**Medical Devices:**
- UDI (Unique Device Identification)
- EUDAMED reporting support
- Risk management file (ISO 14971)
- Design history file (DHF)
- Clinical data management

**Food & Beverage:**
- Lot traceability
- Allergen tracking
- Quality hold/quarantine
- COA generation
- Recall management

**Mobile Capabilities:**
- Mobile quality inspection
- Shop floor data collection
- Barcode/RFID scanning
- Real-time alerts
- Offline mode

**Reporting and Analytics:**
- Real-time dashboards
- Quality KPIs (PPM, COPQ, OEE)
- Audit trails
- Executive quality reports
- Drill-down capabilities

**Integration:**
- Native ERP integration (no separate QMS)
- CAD integration (SolidWorks)
- MES integration
- CRM integration
- Business intelligence (Power BI)

**Implementation:**
- On-premise or cloud deployment
- Typical implementation: 6-12 months
- Requires data migration planning
- Training programs available
- Ongoing support

**Pricing:**
- Subscription-based (per user/month)
- Typically $150-300/user/month
- Implementation services additional
- Maintenance included in subscription

**Best For:**
- Mid-size manufacturers (50-500 employees)
- Regulated industries (medical, automotive)
- Companies wanting integrated ERP+QMS
- Manufacturers needing real-time SPC
- Multi-site operations

**Not Ideal For:**
- Small companies (<$5M revenue)
- Simple distributors
- Companies needing only basic accounting
- Organizations wanting best-of-breed separate systems`,
    keywords: ['iqms', 'delmiaworks', 'manufacturing qms', 'spc software', 'fda 21 cfr part 820', 'iso 13485 software', 'automotive qms', 'medical device erp']
  }
];

export default qualitySoftwareSystems;
