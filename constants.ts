
import { ModuleId, ModuleInfo, Flashcard } from './types';

export const APP_VERSION = "2.5.0";

export const MODULES: ModuleInfo[] = [
  {
    id: ModuleId.COMBUSTION,
    name: "연소공학",
    description: "연소의 기초이론, 완전연소 및 불완전연소, 연소 계산 및 폭발 범위.",
    icon: "🔥"
  },
  {
    id: ModuleId.EQUIPMENT,
    name: "가스설비",
    description: "압축기, 펌프, 배관재료 및 용기, 가스 홀더 등 설비 관리.",
    icon: "🏗️"
  },
  {
    id: ModuleId.SAFETY,
    name: "가스안전관리",
    description: "고압가스 안전관리법, 액화석유가스 및 도시가스 사업법.",
    icon: "🛡️"
  },
  {
    id: ModuleId.MEASUREMENT,
    name: "가스계측",
    description: "온도, 압력, 유량 계측기기 및 자동제어 시스템.",
    icon: "📏"
  }
];

// Mock database to simulate JSON files
export const MOCK_DB: Record<string, Flashcard[]> = {
  [ModuleId.COMBUSTION]: [
    {
      id: "c1",
      question: "메탄($CH_4$) 1$Nm^3$의 완전연소에 필요한 이론 공기량은?",
      answer: "메탄의 연소반응식: $CH_4 + 2O_2 \rightarrow CO_2 + 2H_2O$. \n\n이론 산소량은 2$Nm^3$. 공기 중 산소 농도가 21%이므로, $2 / 0.21 \approx 9.52Nm^3$.",
      category: "연소공학"
    },
    {
      id: "c2",
      question: "고위발열량과 저위발열량의 차이는 무엇인가?",
      answer: "차이는 '수증기의 응축잠열' 유무입니다. 고위발열량(HHV)은 수증기가 액체 상태일 때의 총 열량이며, 저위발열량(LHV)은 수증기의 잠열을 제외한 열량입니다.",
      category: "연소공학"
    }
  ],
  [ModuleId.EQUIPMENT]: [
    {
      id: "e1",
      question: "왕복동 압축기의 특징 세 가지를 기술하시오.",
      answer: "1. 고압을 얻기 쉽다. 2. 토출량 조절 범위가 넓다. 3. 진동과 소음이 크다.",
      category: "가스설비"
    },
    {
      id: "e2",
      question: "가스 배관의 전식 방지법 중 강제 배류법이란?",
      answer: "전철 레일 등으로 누설되는 전류를 배류기를 통해 배관에서 직접 빼내는 방식입니다.",
      category: "가스설비"
    }
  ],
  [ModuleId.SAFETY]: [
    {
      id: "s1",
      question: "방호벽의 설치 목적과 설치 대상은?",
      answer: "폭발 시 파편 등에 의한 피해 확산을 방지하기 위함입니다. 고압가스 저장시설, 처리시설 중 특정 규모 이상의 시설에 설치합니다.",
      category: "가스안전관리"
    }
  ],
  [ModuleId.MEASUREMENT]: [
    {
      id: "m1",
      question: "베르누이 방정식의 가정 조건 3가지는?",
      answer: "1. 비점성 유체 2. 비압축성 유체 3. 정상류 흐름",
      category: "가스계측"
    }
  ]
};
