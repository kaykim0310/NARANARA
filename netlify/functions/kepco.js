// KEPCO(한국전력) API 프록시
const API_KEY = 'G0ESTJM3cNY71nJoO9q27xqACL3O360puGPm0U9Y';

export async function handler(event) {
  const params = event.queryStringParameters || {};
  
  const url = new URL('https://bigdata.kepco.co.kr/openapi/v1/electContract.do');
  url.searchParams.set('apiKey', API_KEY);
  url.searchParams.set('returnType', 'json');
  if (params.noticeBeginDate) url.searchParams.set('noticeBeginDate', params.noticeBeginDate);
  if (params.noticeEndDate) url.searchParams.set('noticeEndDate', params.noticeEndDate);
  if (params.name) url.searchParams.set('name', params.name);

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
