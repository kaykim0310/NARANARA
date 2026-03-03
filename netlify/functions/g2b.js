// 나라장터(G2B) API 프록시
// ★ 수정: 에러 응답 감지 및 디버깅 로그 추가
const API_KEY = '5002b52ede58ae3359d098a19d4e11ce7f88ffddc737233c2ebce75c033ff44a';

export async function handler(event) {
  const params = event.queryStringParameters || {};
  
  const url = new URL('https://apis.data.go.kr/1230000/ao/PubDataOpnStdService/getDataSetOpnStdBidPblancInfo');
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('numOfRows', params.numOfRows || '100');
  url.searchParams.set('pageNo', params.pageNo || '1');
  url.searchParams.set('type', 'json');
  if (params.bidNtceBgnDt) url.searchParams.set('bidNtceBgnDt', params.bidNtceBgnDt);
  if (params.bidNtceEndDt) url.searchParams.set('bidNtceEndDt', params.bidNtceEndDt);

  console.log('[g2b] 요청 URL:', url.toString().replace(API_KEY, 'KEY***'));

  try {
    const response = await fetch(url.toString());
    const data = await response.text();
    
    console.log('[g2b] 응답 상태:', response.status, '길이:', data.length);
    
    // XML 에러 응답 체크 (API 키 미등록, 트래픽 초과 등)
    if (data.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR')) {
      console.log('[g2b] ❌ API 키가 이 서비스에 등록되지 않음! data.go.kr에서 PubDataOpnStdService 활용신청 필요');
      // 에러 정보를 JSON으로 감싸서 반환
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: {
            header: { resultCode: '99', resultMsg: 'API_KEY_NOT_REGISTERED' },
            body: { items: [], totalCount: 0 }
          },
          _error: 'API 키가 PubDataOpnStdService에 등록되지 않았습니다. data.go.kr에서 활용신청 해주세요.',
          _rawError: data.substring(0, 500)
        }),
      };
    }
    
    if (data.includes('DAILY_TRAFFIC_LIMIT_EXCEEDED')) {
      console.log('[g2b] ❌ 일일 트래픽 한도 초과!');
    }
    
    if (data.includes('returnReasonCode')) {
      console.log('[g2b] API 에러 응답:', data.substring(0, 500));
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
    console.log('[g2b] 에러:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
