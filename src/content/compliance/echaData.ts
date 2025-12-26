// ECHA Compliance Data loaded from scraped markdown files
// Run `reach_md_pipeline/run_all.py` to regenerate this data

export interface SubstanceEntry {
    name: string;
    cas: string;
    ec: string;
    reason: string;
    dateAdded: string;
    list: 'SVHC' | 'Annex XIV' | 'Annex XVII';
}

// SVHC Candidate List - parsed from scraped ECHA data
export const svhcSubstances: SubstanceEntry[] = [
    { name: "Bisphenol A (BPA)", cas: "80-05-7", ec: "201-245-8", reason: "Toxic for reproduction, Endocrine disrupting", dateAdded: "12-Jan-2017", list: "SVHC" },
    { name: "Bis(2-ethylhexyl) phthalate (DEHP)", cas: "117-81-7", ec: "204-211-0", reason: "Toxic for reproduction (Article 57c)", dateAdded: "28-Oct-2008", list: "SVHC" },
    { name: "Dibutyl phthalate (DBP)", cas: "84-74-2", ec: "201-557-4", reason: "Toxic for reproduction (Article 57c)", dateAdded: "28-Oct-2008", list: "SVHC" },
    { name: "Lead", cas: "7439-92-1", ec: "231-100-4", reason: "Toxic for reproduction (Article 57c)", dateAdded: "27-Jun-2018", list: "SVHC" },
    { name: "Cadmium", cas: "7440-43-9", ec: "231-152-8", reason: "Carcinogenic (Article 57a)", dateAdded: "20-Jun-2013", list: "SVHC" },
    { name: "4-MBC (trimethyl-methylphenyl-bicycloheptan-2-one)", cas: "36861-47-9", ec: "253-242-6", reason: "Endocrine disrupting (Article 57f)", dateAdded: "17-Jan-2022", list: "SVHC" },
    { name: "BMP/TBNPA/2,3-DBPA (brominated propanols)", cas: "3296-90-0", ec: "221-967-7", reason: "Carcinogenic (Article 57a)", dateAdded: "08-Jul-2021", list: "SVHC" },
    { name: "2-(4-tert-butylbenzyl)propionaldehyde", cas: "80-54-6", ec: "201-289-8", reason: "Toxic for reproduction (Article 57c)", dateAdded: "08-Jul-2021", list: "SVHC" },
    { name: "Bis(2-ethylhexyl) tetrabromophthalate", cas: "26040-51-7", ec: "247-426-5", reason: "vPvB (Article 57e)", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "Dioctyltin dilaurate", cas: "3648-18-8", ec: "222-883-3", reason: "Toxic for reproduction (Article 57c)", dateAdded: "19-Jan-2021", list: "SVHC" },
    { name: "Medium-chain chlorinated paraffins (MCCP)", cas: "85535-85-9", ec: "287-477-0", reason: "PBT & vPvB (Article 57d,e)", dateAdded: "08-Jul-2021", list: "SVHC" },
    { name: "Perfluorobutane sulfonic acid (PFBS)", cas: "375-73-5", ec: "206-793-1", reason: "Equivalent concern (Article 57f)", dateAdded: "16-Jan-2020", list: "SVHC" },
    { name: "Perfluoroheptanoic acid", cas: "375-85-9", ec: "206-798-9", reason: "Toxic for reproduction, PBT, vPvB", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "Tris(2-methoxyethoxy)vinylsilane", cas: "1067-53-4", ec: "213-934-0", reason: "Toxic for reproduction (Article 57c)", dateAdded: "17-Jan-2022", list: "SVHC" },
    { name: "Octamethyltrisiloxane", cas: "107-51-7", ec: "203-497-4", reason: "vPvB (Article 57e)", dateAdded: "21-Jan-2025", list: "SVHC" },
    { name: "1-vinylimidazole", cas: "1072-63-5", ec: "214-012-0", reason: "Toxic for reproduction (Article 57c)", dateAdded: "25-Jun-2020", list: "SVHC" },
    { name: "Melamine", cas: "108-78-1", ec: "203-615-4", reason: "Equivalent concern (Article 57f)", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "Glutaraldehyde (glutaral)", cas: "111-30-8", ec: "203-856-5", reason: "Respiratory sensitising (Article 57f)", dateAdded: "08-Jul-2021", list: "SVHC" },
    { name: "Triphenyl phosphate", cas: "115-86-6", ec: "204-112-2", reason: "Endocrine disrupting (Article 57f)", dateAdded: "07-Nov-2024", list: "SVHC" },
    { name: "6,6'-di-tert-butyl-2,2'-methylenedi-p-cresol", cas: "119-47-1", ec: "204-327-1", reason: "Toxic for reproduction (Article 57c)", dateAdded: "17-Jan-2022", list: "SVHC" },
    { name: "1,4-dioxane", cas: "123-91-1", ec: "204-661-8", reason: "Carcinogenic, Equivalent concern", dateAdded: "08-Jul-2021", list: "SVHC" },
    { name: "Barium diboron tetraoxide", cas: "13701-59-2", ec: "237-222-4", reason: "Toxic for reproduction (Article 57c)", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "Decamethyltetrasiloxane", cas: "141-62-8", ec: "205-491-7", reason: "vPvB (Article 57e)", dateAdded: "25-Jun-2025", list: "SVHC" },
    { name: "Bis(2-(2-methoxyethoxy)ethyl)ether", cas: "143-24-8", ec: "205-594-7", reason: "Toxic for reproduction (Article 57c)", dateAdded: "19-Jan-2021", list: "SVHC" },
    { name: "UV-329 (benzotriazole)", cas: "3147-75-9", ec: "221-573-5", reason: "vPvB (Article 57e)", dateAdded: "23-Jan-2024", list: "SVHC" },
    { name: "Perfluamine", cas: "338-83-0", ec: "206-420-2", reason: "vPvB (Article 57e)", dateAdded: "21-Jan-2025", list: "SVHC" },
    { name: "Bumetrizole (UV-326)", cas: "3896-11-5", ec: "223-445-4", reason: "vPvB (Article 57e)", dateAdded: "23-Jan-2024", list: "SVHC" },
    { name: "Isobutyl 4-hydroxybenzoate", cas: "4247-02-3", ec: "224-208-8", reason: "Endocrine disrupting (Article 57f)", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "2-methylimidazole", cas: "693-98-1", ec: "211-765-7", reason: "Toxic for reproduction (Article 57c)", dateAdded: "25-Jun-2020", list: "SVHC" },
    { name: "Diisohexyl phthalate", cas: "71850-09-4", ec: "276-090-2", reason: "Toxic for reproduction (Article 57c)", dateAdded: "16-Jan-2020", list: "SVHC" },
    { name: "2,4,6-tri-tert-butylphenol", cas: "732-26-3", ec: "211-989-5", reason: "Toxic for reproduction, PBT", dateAdded: "23-Jan-2024", list: "SVHC" },
    { name: "Bisphenol S (4,4'-sulphonyldiphenol)", cas: "80-09-1", ec: "201-250-5", reason: "Toxic for reproduction, Endocrine disrupting", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "TBBPA (tetrabromobisphenol A)", cas: "79-94-7", ec: "201-236-9", reason: "Carcinogenic (Article 57a)", dateAdded: "17-Jan-2023", list: "SVHC" },
    { name: "N-(hydroxymethyl)acrylamide", cas: "924-42-5", ec: "213-103-2", reason: "Carcinogenic & Mutagenic (57a,b)", dateAdded: "10-Jun-2022", list: "SVHC" },
    { name: "Butyl 4-hydroxybenzoate (butylparaben)", cas: "94-26-8", ec: "202-318-7", reason: "Endocrine disrupting (Article 57f)", dateAdded: "25-Jun-2020", list: "SVHC" },
];

// Function to search ECHA data
export function searchEchaSubstances(query: string): SubstanceEntry[] {
    const lowerQuery = query.toLowerCase();
    return svhcSubstances.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.cas.includes(lowerQuery) ||
        s.ec.includes(lowerQuery) ||
        s.reason.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
}

// Get substance by CAS number
export function getSubstanceByCas(cas: string): SubstanceEntry | undefined {
    return svhcSubstances.find(s => s.cas === cas);
}

// Get count of substances by reason category
export function getSubstanceStats() {
    const stats = {
        total: svhcSubstances.length,
        carcinogenic: svhcSubstances.filter(s => s.reason.toLowerCase().includes('carcinogenic')).length,
        reprotoxic: svhcSubstances.filter(s => s.reason.toLowerCase().includes('reproduction')).length,
        pbt: svhcSubstances.filter(s => s.reason.toLowerCase().includes('pbt')).length,
        vpvb: svhcSubstances.filter(s => s.reason.toLowerCase().includes('vpvb')).length,
        endocrine: svhcSubstances.filter(s => s.reason.toLowerCase().includes('endocrine')).length,
    };
    return stats;
}
