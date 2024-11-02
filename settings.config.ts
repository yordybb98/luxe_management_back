export const settings = {
  // DIRECTORY CONFIGS
  BASE_ROOT_DIRECTORY: '\\\\LUXE_BACKUP\\Luxe Files\\_Disenos',
  FOLDERS_STRUCTURE: [
    'Admon',
    'Arte Final',
    'Cut',
    'Editables',
    'Materiales',
    'Preview',
    'Print',
    'Resultado',
  ],
};

// ODOO STAGES IDS
export const STAGES_IDS = {
  REQUEST: 1,
  QUOTATION: 2,
  QUOTATION_SENT: 3,
  WON: 4,
  ON_HOLD: 13,
  ANTICIPO: 8,
  PROPOSITION: 9,
  PROPOSITION_SENT: 34,
  ADJUSTMENT_1: 28,
  ADJUSTMENT_2: 29,
  ADJUSTMENT_FINAL: 30,
  APROVED_BY_CLIENT: 35,
  PRODUCTION: 10,
  INSTALLATION: 5,
  FINISHED: 6,
  SERVICE_CALLS: 11,
  COBRADO: 7,
  DESIGN: 27,
};

export const STAGESIDSALLOWEDTODOAPROPOSAL = [
  STAGES_IDS.DESIGN, //Design
  STAGES_IDS.ADJUSTMENT_1, //First Adjustment
  STAGES_IDS.ADJUSTMENT_2, //Second Adjustment
  STAGES_IDS.ADJUSTMENT_FINAL, //Final Adjustment
];
