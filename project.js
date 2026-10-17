const inquiry = `공공기관·기업 워크숍 문의

기관·기업명:
담당자 성함과 연락처:
교육 대상과 참가 인원:
참가자의 AI 활용 경험:
보유 자료(녹취록·교육 문서·업무 자료 등):
만들고 싶은 결과물과 교육 목적:
희망 일정:
진행 방식과 교육 장소:
기타 요청 사항:
`;
const emailLink = document.querySelector('#inquiry-email');
emailLink.href = `mailto:ceo@wilab.co.kr?subject=${encodeURIComponent('[워크숍 문의] 경험에서 교육 자산으로')}&body=${encodeURIComponent(inquiry)}`;
document.querySelector('#copy-inquiry').addEventListener('click',async()=>{
  const status = document.querySelector('#inquiry-status');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(inquiry);
    } else {
      const field = document.createElement('textarea');
      field.value=inquiry;
      field.style.position='fixed';
      field.style.left='-9999px';
      document.body.append(field);
      field.select();
      const copied=document.execCommand('copy');
      field.remove();
      if (!copied) throw new Error('Copy unavailable');
    }
    status.textContent='문의 양식을 복사했습니다. 내용을 작성해 ceo@wilab.co.kr로 보내주세요.';
  } catch {
    status.textContent='복사하지 못했습니다. 위 항목을 적어 ceo@wilab.co.kr로 문의해 주세요.';
  }
});
