/**
 * Checklist items seed data — 47 items across 4 categories
 * Extracted from custos-intel-fire-code-kb.html
 */
export const checklistItemsSeed = [
  // ===== A. Sprinkler System Compliance (12 items) =====
  {
    category: 'A_sprinkler',
    itemNumber: 1,
    description:
      'Correct NFPA standard applied (13, 13R, or 13D) for occupancy and building type',
    codeReference: 'NFPA 13/13R/13D · WI SPS 362.0903',
    sortOrder: 1,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 2,
    description:
      'Occupancy hazard classification correctly identified (Light, OH1, OH2, EH1, EH2)',
    codeReference: 'NFPA 13 §5.2-5.4',
    sortOrder: 2,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 3,
    description:
      'Design density meets or exceeds minimum for hazard class',
    codeReference: 'NFPA 13 Fig. 11.2.3.1.1',
    sortOrder: 3,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 4,
    description: 'Design area meets minimum for hazard class',
    codeReference: 'NFPA 13 §11.2.3.1',
    sortOrder: 4,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 5,
    description:
      'Sprinkler spacing ≤ maximum per hazard class (15 ft LH/OH, 12 ft EH)',
    codeReference: 'NFPA 13 §8.6.2.2.1',
    sortOrder: 5,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 6,
    description: 'Sprinkler distance to walls ≥ 4 in minimum',
    codeReference: 'NFPA 13 §8.6.2.2.3',
    sortOrder: 6,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 7,
    description: 'Sprinkler distance to walls ≤ ½ max spacing',
    codeReference: 'NFPA 13 §8.6.2.2.3',
    sortOrder: 7,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 8,
    description:
      'Coverage area per head within maximum (225 ft² LH, 130 ft² OH, 100 ft² EH)',
    codeReference: 'NFPA 13 §8.6.2.2.1',
    sortOrder: 8,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 9,
    description:
      'Deflector-to-ceiling distance within range (1-12 in typical)',
    codeReference: 'NFPA 13 §8.6.4',
    sortOrder: 9,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 10,
    description: 'Sprinkler temperature rating appropriate for location',
    codeReference: 'NFPA 13 §8.3.2',
    sortOrder: 10,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 11,
    description:
      'Hydraulic calculations show adequate safety margin over available supply',
    codeReference: 'NFPA 13 Ch. 23',
    sortOrder: 11,
  },
  {
    category: 'A_sprinkler',
    itemNumber: 12,
    description:
      'All areas covered — no unprotected spaces (closets, attics, concealed spaces)',
    codeReference: 'NFPA 13 §8.15',
    sortOrder: 12,
  },

  // ===== B. Fire Access & Hydrant Compliance (11 items) =====
  {
    category: 'B_fire_access',
    itemNumber: 1,
    description: 'Fire apparatus access road width ≥ 20 ft',
    codeReference: 'IFC §503.2.1',
    sortOrder: 13,
  },
  {
    category: 'B_fire_access',
    itemNumber: 2,
    description: 'Vertical clearance ≥ 13 ft 6 in',
    codeReference: 'IFC §503.2.1',
    sortOrder: 14,
  },
  {
    category: 'B_fire_access',
    itemNumber: 3,
    description: 'Inside turning radius ≥ 25 ft',
    codeReference: 'IFC §503.2.4',
    sortOrder: 15,
  },
  {
    category: 'B_fire_access',
    itemNumber: 4,
    description: 'Dead-end roads ≤ 150 ft or turnaround provided',
    codeReference: 'IFC §D103.4',
    sortOrder: 16,
  },
  {
    category: 'B_fire_access',
    itemNumber: 5,
    description:
      'Aerial access road ≥ 26 ft wide (if building ≥ 3 stories / 30 ft)',
    codeReference: 'IFC §D105',
    sortOrder: 17,
  },
  {
    category: 'B_fire_access',
    itemNumber: 6,
    description: 'Aerial access 15-30 ft from building face',
    codeReference: 'IFC §D105',
    sortOrder: 18,
  },
  {
    category: 'B_fire_access',
    itemNumber: 7,
    description: 'Fire lane markings and signage shown',
    codeReference: 'IFC §503.3',
    sortOrder: 19,
  },
  {
    category: 'B_fire_access',
    itemNumber: 8,
    description:
      'Fire hydrant within 500 ft of building (no sprinklers) or 750 ft (with sprinklers)',
    codeReference: 'IFC §507.5.1',
    sortOrder: 20,
  },
  {
    category: 'B_fire_access',
    itemNumber: 9,
    description:
      'Number of hydrants meets fire flow requirement per IFC Appendix C',
    codeReference: 'IFC App. C Table C105.1',
    sortOrder: 21,
  },
  {
    category: 'B_fire_access',
    itemNumber: 10,
    description:
      'Hydrant spacing meets distance requirements per fire flow',
    codeReference: 'IFC App. C',
    sortOrder: 22,
  },
  {
    category: 'B_fire_access',
    itemNumber: 11,
    description:
      'Hydrants accessible — no parking, landscaping, or structures blocking approach',
    codeReference: 'IFC §507.5.4',
    sortOrder: 23,
  },

  // ===== C. FDC & Standpipe Compliance (10 items) =====
  {
    category: 'C_fdc_standpipe',
    itemNumber: 1,
    description: 'FDC within 100 ft of nearest fire hydrant',
    codeReference: 'NFPA 14 §7.12 · IFC §912.2',
    sortOrder: 24,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 2,
    description: 'FDC ≥ 6 ft from hydrant face',
    codeReference: 'NFPA 14 §7.12',
    sortOrder: 25,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 3,
    description: 'FDC visible from street or apparatus access',
    codeReference: 'IFC §912.2',
    sortOrder: 26,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 4,
    description: 'FDC inlet count correct (1 per 250 gpm demand)',
    codeReference: 'NFPA 14 §7.12',
    sortOrder: 27,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 5,
    description: 'FDC inlet height 18-48 in above grade',
    codeReference: 'NFPA 14 §7.12',
    sortOrder: 28,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 6,
    description: 'FDC signage specified (system type, 1 in min letters)',
    codeReference: 'NFPA 14 §6.4.6',
    sortOrder: 29,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 7,
    description: 'FDC pressure signage specified (if > 150 psi required)',
    codeReference: 'NFPA 14 §6.4.6',
    sortOrder: 30,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 8,
    description: 'No obstructions within clearance area of FDC',
    codeReference: 'IFC §912.2.1',
    sortOrder: 31,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 9,
    description:
      'Standpipe class correct for building height/occupancy',
    codeReference: 'IBC §905.3',
    sortOrder: 32,
  },
  {
    category: 'C_fdc_standpipe',
    itemNumber: 10,
    description:
      'Standpipe outlets at each floor landing in required stairways',
    codeReference: 'IBC §905.4',
    sortOrder: 33,
  },

  // ===== D. Fire & Life Safety General (14 items) =====
  {
    category: 'D_fire_life_safety',
    itemNumber: 1,
    description:
      'Construction type correctly identified and consistent with plans',
    codeReference: 'IBC Ch. 6',
    sortOrder: 34,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 2,
    description: 'Occupancy classification correct for intended use',
    codeReference: 'IBC Ch. 3',
    sortOrder: 35,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 3,
    description:
      'Fire-resistance ratings match construction type requirements',
    codeReference: 'IBC Table 601',
    sortOrder: 36,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 4,
    description:
      'Occupancy separation ratings correct per IBC Table 508.4',
    codeReference: 'IBC §508.4',
    sortOrder: 37,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 5,
    description:
      'WI mixed-use separation (R under UDC from commercial ≥ 1-hr)',
    codeReference: 'WI SPS 362.0202',
    sortOrder: 38,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 6,
    description: 'Fire alarm system shown where required',
    codeReference: 'IBC §907.2',
    sortOrder: 39,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 7,
    description:
      'Smoke detection in sleeping rooms and corridors (Group R)',
    codeReference: 'IBC §907.2.9',
    sortOrder: 40,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 8,
    description: 'Means of egress — travel distance within limits',
    codeReference: 'IBC §1016',
    sortOrder: 41,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 9,
    description:
      'Dead-end corridors ≤ 50 ft (sprinklered) / 20 ft (unsprinklered)',
    codeReference: 'IBC §1018.4',
    sortOrder: 42,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 10,
    description: 'Number of exits meets occupant load requirements',
    codeReference: 'IBC §1021',
    sortOrder: 43,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 11,
    description:
      'Exit widths meet minimum per occupant load calculation',
    codeReference: 'IBC §1005',
    sortOrder: 44,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 12,
    description: 'Fire-rated door schedule matches wall ratings',
    codeReference: 'IBC §716',
    sortOrder: 45,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 13,
    description: 'Corridor wall ratings correct',
    codeReference: 'IBC §1018.1',
    sortOrder: 46,
  },
  {
    category: 'D_fire_life_safety',
    itemNumber: 14,
    description:
      'Shaft enclosures properly rated (2-hr for 4+ stories, 1-hr otherwise)',
    codeReference: 'IBC §708.4',
    sortOrder: 47,
  },
];
