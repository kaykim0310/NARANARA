// 나라장터(G2B) API 프록시
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

  try {
    const response = await fetch(url.toString());
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
