const cases = {
  education: {
    label: '교육 자료',
    source: '강의 녹취록 / 참고 문서 / 사례 / 질문 / 디자인 피드백',
    audience: '학습자 / 강의 참가자',
    purpose: '내용을 이해하고 자기 자료로 실습하기',
    facts: '원래 설명의 의미, 확인된 기능과 적용 조건, 교육용 예제의 성격',
    outputs: '강의책자 / 워크북 / 실습자료 중 이번 결과물 하나 선택',
    check: '원자료와 의미 대조 / 기능의 적용 조건 / 실습 단계의 연결 / 가독성',
    evidence: '현재 프로젝트: 녹취록 6개를 바탕으로 V13 50쪽 책과 워크북 제작'
  },
  product: {
    label: '제품소개서',
    source: '실제 제품 사진 / 사양표 / 사용법 / 사용 사례 / 성능 근거',
    audience: '구매 검토자 / 유통 담당자 / 영업 미팅 상대',
    purpose: '필요한 이유와 내 상황에 맞는지 판단하기',
    facts: '모델명, 사양, 가격과 기준일, 성능 근거, 제공 조건',
    outputs: '상세 소개서 / 영업용 1쪽 요약 / 제안서 페이지 / 웹 소개 중 하나 선택',
    check: '제품 사진과 실제 모델 일치 / 수치와 성능 표현의 근거 / 가격과 적용 시점',
    evidence: '향후 적용 예시: 실제 제품 자료를 확보한 뒤 제작과 검증 필요'
  },
  company: {
    label: '기업소개서',
    source: '회사 개요 / 주요 사업 / 핵심 역량 / 프로젝트 기록 / 인증 자료',
    audience: '잠재 고객 / 발주 담당자 / 협업 상대',
    purpose: '맡길 수 있는 일과 협업할 이유 판단하기',
    facts: '회사명, 사업 범위, 연혁, 확인된 실적과 인증, 사례 공개 범위',
    outputs: '기업소개서 / 미팅용 요약 / 고객별 제안 자료 / 회사 웹 소개 중 하나 선택',
    check: '실적과 인증 원본 대조 / 고객명과 사례 공개 범위 / 제공 가능한 업무 범위',
    evidence: '향후 적용 예시: 실제 회사 자료와 공개 범위를 확인한 뒤 제작과 검증 필요'
  }
};
const tabs = [...document.querySelectorAll('[data-case]')];
const panels = [...document.querySelectorAll('[data-case-panel]')];
const status = document.querySelector('#copy-status');
let current = 'education';

function chooseCase(key, focus = false) {
  if (!Object.hasOwn(cases, key)) return;
  current = key;
  for (const tab of tabs) {
    const active = tab.dataset.case === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  }
  for (const panel of panels) panel.hidden = panel.dataset.casePanel !== key;
  document.querySelector('#template-kind').textContent = cases[key].label;
  status.textContent = `현재 선택: ${cases[key].label} · 선택한 대상의 양식을 받거나 복사할 수 있습니다.`;
}

for (const tab of tabs) {
  tab.addEventListener('click', () => chooseCase(tab.dataset.case));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      chooseCase(tabs[next].dataset.case, true);
    }
  });
}

function templateText() {
  const item = cases[current];
  return `원소스 멀티 아웃풋 · 기준 원고 작성 양식\n선택한 적용 대상: ${item.label}\n\n${item.evidence}\n\n01. 어떤 원천 자료가 있나요?\n참고: ${item.source}\n내 자료:\n\n02. 누가, 어떤 목적으로 읽나요?\n독자 참고: ${item.audience}\n목적 참고: ${item.purpose}\n나의 독자와 목적:\n\n03. 반드시 지킬 사실과 메시지는 무엇인가요?\n참고: ${item.facts}\n확인된 사실:\n핵심 메시지:\n표현 원칙:\n\n04. 아직 모르는 정보와 출처는 무엇인가요?\n미정 정보:\n확인할 담당자와 시점:\n원자료 위치와 기준일:\n\n05. 이번에 만들 결과물 하나는 무엇인가요?\n참고: ${item.outputs}\n이번 결과물:\n\n06. 완성 후 무엇과 대조할 건가요?\n참고: ${item.check}\n검수 기준:\n확인한 원자료:\n다음 수정:\n`;
}

document.querySelector('#download-template').addEventListener('click', () => {
  const blob = new Blob(['\ufeff', templateText()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `기준원고_작성양식_${cases[current].label}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = `${cases[current].label} 양식을 다운로드했습니다.`;
});

document.querySelector('#copy-template').addEventListener('click', async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(templateText());
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = templateText();
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw new Error('Copy unavailable');
    }
    status.textContent = `${cases[current].label} 양식을 복사했습니다.`;
  } catch {
    status.textContent = '이 브라우저에서 복사하지 못했습니다. TXT 받기를 이용해 주세요.';
  }
});
