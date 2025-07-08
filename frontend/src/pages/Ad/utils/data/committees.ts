interface Committee {
  id: string;
  name: string;
  code: string;
  hasCheckposts: boolean;
  checkposts: string[];
}

export const committees: Committee[] = [
  {
    id: 'amc-001',
    name: 'Karapa Agricultural Market Committee',
    code: 'KRP-AMC',
    hasCheckposts: true,
    checkposts: ['Penuguduru'],
  },
  {
    id: 'amc-002',
    name: 'Kakinada Rural Agricultural Market Committee',
    code: 'KKDR-AMC',
    hasCheckposts: true,
    checkposts: ['Atchempeta', 'Turangi Bypass'],
  },
  {
    id: 'amc-003',
    name: 'Pithapuram Agricultural Market Committee',
    code: 'PTM-AMC',
    hasCheckposts: true,
    checkposts: ['Pithapuram', 'Chebrolu'],
  },
  {
    id: 'amc-004',
    name: 'Tuni Agricultural Market Committee',
    code: 'TUNI-AMC',
    hasCheckposts: true,
    checkposts: ['Tuni', 'K/P/Puram', 'Rekavanipalem'],
  },
  {
    id: 'amc-005',
    name: 'Prathipadu Agricultural Market Committee',
    code: 'PTD-AMC',
    hasCheckposts: true,
    checkposts: ['Kathipudi', 'Prathipadu', 'Yerravaram'],
  },
  {
    id: 'amc-006',
    name: 'Jaggampeta Agricultural Market Committee',
    code: 'JPT-AMC',
    hasCheckposts: true,
    checkposts: ['Jaggampeta', 'Rajupalem'],
  },
  {
    id: 'amc-007',
    name: 'Peddapuram Agricultural Market Committee',
    code: 'PDM-AMC',
    hasCheckposts: true,
    checkposts: ['Peddapuram'],
  },
  {
    id: 'amc-008',
    name: 'Samalkota Agricultural Market Committee',
    code: 'SMLK-AMC',
    hasCheckposts: false,
    checkposts: [],
  },
  {
    id: 'amc-009',
    name: 'Kakinada Agricultural Market Committee',
    code: 'KKD-AMC',
    hasCheckposts: false,
    checkposts: [],
  },
];

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
