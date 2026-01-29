
import { ModuleInfo, MdRegistryItem } from './types';

export const APP_VERSION = "2.5.0";

// Inlined metadata to prevent JSON module resolution errors in browser ESM
const mdRegistry: MdRegistryItem[] = [
  {
    "path": "가스 설비/LPG 설비.md",
    "h4Count": 25,
    "id": "lpg_facility"
  },
  {
    "path": "가스 설비/가스 설비 일반.md",
    "h4Count": 35,
    "id": "gas_facility_general"
  },
  {
    "path": "가스 설비/계측기기.md",
    "h4Count": 26,
    "id": "instrumentation"
  },
  {
    "path": "가스 설비/금속재료.md",
    "h4Count": 15,
    "id": "metal_materials"
  },
  {
    "path": "가스 설비/도시가스 설비.md",
    "h4Count": 17,
    "id": "city_gas_facility"
  },
  {
    "path": "가스 설비/배관.md",
    "h4Count": 34,
    "id": "piping"
  },
  {
    "path": "가스 설비/압축기, 펌프.md",
    "h4Count": 51,
    "id": "compressors_pumps"
  },
  {
    "path": "가스 설비/용기.md",
    "h4Count": 42,
    "id": "gas_containers"
  },
  {
    "path": "가스 설비/조정기 정압기.md",
    "h4Count": 24,
    "id": "regulators"
  },
  {
    "path": "가스 설비/줄톰슨, 단열.md",
    "h4Count": 18,
    "id": "joule_thompson"
  },
  {
    "path": "고압가스의 분류와 성질/가스 일반.md",
    "h4Count": 15,
    "id": "gas_general"
  },
  {
    "path": "고압가스의 분류와 성질/가스 종류.md",
    "h4Count": 32,
    "id": "gas_types"
  },
  {
    "path": "열역학 기초/압력.md",
    "h4Count": 3,
    "id": "pressure"
  },
  {
    "path": "열역학 기초/연소, 폭발 안전.md",
    "h4Count": 23,
    "id": "combustion_safety"
  },
  {
    "path": "표, 공식/가스.md",
    "h4Count": 5,
    "id": "gas_table"
  },
  {
    "path": "표, 공식/공식.md",
    "h4Count": 26,
    "id": "formulas"
  },
  {
    "path": "표, 공식/단답형.md",
    "h4Count": 14,
    "id": "short_answers"
  }
];

// 한국어 과목명 매핑 테이블
const NAME_MAP: Record<string, string> = {
  "lpg_facility": "LPG 설비",
  "gas_facility_general": "가스 설비 일반",
  "instrumentation": "가스 계측",
  "metal_materials": "금속 재료",
  "city_gas_facility": "도시가스 설비",
  "piping": "배관 공학",
  "compressors_pumps": "압축기 및 펌프",
  "gas_containers": "가스 용기",
  "regulators": "조정기 및 정압기",
  "joule_thompson": "줄-톰슨 및 단열",
  "gas_general": "가스 일반",
  "gas_types": "가스 종류",
  "pressure": "기초 압력",
  "combustion_safety": "연소 및 폭발 안전",
  "gas_table": "가스 제원표",
  "formulas": "가스 핵심 공식",
  "short_answers": "핵심 단답형"
};

const ICON_MAP: Record<string, string> = {
  "lpg_facility": "⛽",
  "gas_facility_general": "🏗️",
  "instrumentation": "📏",
  "metal_materials": "🔩",
  "city_gas_facility": "🏙️",
  "piping": "🔗",
  "compressors_pumps": "💨",
  "gas_containers": "🛢️",
  "regulators": "⚖️",
  "joule_thompson": "❄️",
  "gas_general": "📘",
  "gas_types": "🧪",
  "pressure": "📊",
  "combustion_safety": "🔥",
  "gas_table": "📋",
  "formulas": "🧮",
  "short_answers": "💡"
};

export const MODULES: ModuleInfo[] = mdRegistry
  .filter(item => item.h4Count > 0)
  .map(item => ({
    id: item.id,
    name: NAME_MAP[item.id] || item.id,
    description: `${NAME_MAP[item.id] || item.id} 분야의 핵심 이론과 기출 포인트를 학습합니다.`,
    icon: ICON_MAP[item.id] || "📄",
    h4Count: item.h4Count,
    mdPath: item.path
  }));

export const MOCK_DB: Record<string, any> = {};
