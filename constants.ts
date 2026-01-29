
import { ModuleInfo, MdRegistryItem } from './types';

export const APP_VERSION = "2.5.1";

const mdRegistry: MdRegistryItem[] = [
  { "path": "가스 설비/LPG 설비.md", "h4Count": 25, "id": "lpg_facility" },
  { "path": "가스 설비/가스 설비 일반.md", "h4Count": 35, "id": "gas_facility_general" },
  { "path": "가스 설비/계측기기.md", "h4Count": 26, "id": "instrumentation" },
  { "path": "가스 설비/금속재료.md", "h4Count": 15, "id": "metal_materials" },
  { "path": "가스 설비/도시가스 설비.md", "h4Count": 17, "id": "city_gas_facility" },
  { "path": "가스 설비/배관.md", "h4Count": 34, "id": "piping" },
  { "path": "가스 설비/압축기, 펌프.md", "h4Count": 51, "id": "compressors_pumps" },
  { "path": "가스 설비/용기.md", "h4Count": 42, "id": "gas_containers" },
  { "path": "가스 설비/조정기 정압기.md", "h4Count": 24, "id": "regulators" },
  { "path": "가스 설비/줄톰슨, 단열.md", "h4Count": 18, "id": "joule_thompson" },
  { "path": "고압가스의 분류와 성질/가스 일반.md", "h4Count": 15, "id": "gas_general" },
  { "path": "고압가스의 분류와 성질/가스 종류.md", "h4Count": 32, "id": "gas_types" },
  { "path": "열역학 기초/압력.md", "h4Count": 3, "id": "pressure" },
  { "path": "열역학 기초/연소, 폭발 안전.md", "h4Count": 23, "id": "combustion_safety" },
  { "path": "표, 공식/가스.md", "h4Count": 5, "id": "gas_table" },
  { "path": "표, 공식/공식.md", "h4Count": 26, "id": "formulas" },
  { "path": "표, 공식/단답형.md", "h4Count": 14, "id": "short_answers" }
];

export interface SubjectInfo extends ModuleInfo {
  subModuleIds: string[];
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'subject_1',
    name: '연소공학',
    description: '연소 기초이론, 열역학 수식 및 폭발 안전 원리를 학습합니다.',
    icon: '🔥',
    h4Count: 0, // Will be calculated
    mdPath: '',
    subModuleIds: ['combustion_safety', 'pressure', 'formulas', 'gas_general']
  },
  {
    id: 'subject_2',
    name: '가스설비',
    description: 'LPG/도시가스 제조, 공급설비 및 압축기/정압기 등 기계설비를 학습합니다.',
    icon: '🏗️',
    h4Count: 0,
    mdPath: '',
    subModuleIds: ['lpg_facility', 'city_gas_facility', 'gas_facility_general', 'piping', 'compressors_pumps', 'gas_containers', 'regulators', 'joule_thompson']
  },
  {
    id: 'subject_3',
    name: '가스안전관리',
    description: '가스 종류별 성질, 법적 안전기준 및 핵심 암기사항을 학습합니다.',
    icon: '🛡️',
    h4Count: 0,
    mdPath: '',
    subModuleIds: ['gas_table', 'short_answers', 'gas_types']
  },
  {
    id: 'subject_4',
    name: '가스계측',
    description: '가스 계측기 원리, 오차 분석 및 금속 재료의 특성을 학습합니다.',
    icon: '📏',
    h4Count: 0,
    mdPath: '',
    subModuleIds: ['instrumentation', 'metal_materials']
  }
].map(subject => {
  const totalCount = mdRegistry
    .filter(item => subject.subModuleIds.includes(item.id))
    .reduce((acc, curr) => acc + curr.h4Count, 0);
  return { ...subject, h4Count: totalCount };
});

export const MODULES = SUBJECTS; // Alias for backward compatibility if needed
export const MOCK_DB: Record<string, any> = {};
