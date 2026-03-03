// 낙찰정보(ScsbidInfoService) API 프록시
// ★ 수정: URL 경로에 /as/ 추가 (조달청 API 경로 변경됨)
// ★ 수정: ServiceKey → serviceKey (data.go.kr 표준)
const API_KEY = '5002b52ede58ae3359d098a19d4e11ce7f88ffddc737233c2ebce75c033ff44a';

export async function handler(event) {
  const params = event.queryStringParameters || {};
  
  // ★ 핵심 수정: /as/ 경로 추가 (구: /1230000/ScsbidInfoService/ → 신: /1230000/as/ScsbidInfoService/)
  const url = new URL('https://apis.data.go.kr/1230000/as/ScsbidInfoService/getScsbidListSttusServc');
  url.searchParams.set('serviceKey', API_KEY);  // ★ ServiceKey → serviceKey
  url.searchParams.set('numOfRows', params.numOfRows || '100');
  url.searchParams.set('pageNo', params.pageNo || '1');
  url.searchParams.set('type', 'json');
  url.searchParams.set('inqryDiv', params.inqryDiv || '1');
  if (params.inqryBgnDt) url.searchParams.set('inqryBgnDt', params.inqryBgnDt);
  if (params.inqryEndDt) url.searchParams.set('inqryEndDt', params.inqryEndDt);

  console.log('[award] 요청 URL:', url.toString().replace(API_KEY, 'KEY***'));

  try {
    const response = await fetch(url.toString());
    const data = await response.text();
    
    console.log('[award] 응답 상태:', response.status, '길이:', data.length);
    
    // XML 에러 응답 체크 (API 키 미등록 등)
    if (data.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR') || data.includes('returnReasonCode')) {
      console.log('[award] API 에러 응답:', data.substring(0, 500));
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    console.log('[award] 에러:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
