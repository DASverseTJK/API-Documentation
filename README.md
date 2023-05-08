다음은 API 연동 규격서를 위한 간단한 포맷 예시입니다.

# API 연동 규격서

## 1. API 요청 URL 및 HTTP Method

- URL: http://api.example.com/v1/users
- HTTP Method: GET

## 2. Request 및 Response 데이터 포맷

- Request 데이터 포맷: JSON
- Response 데이터 포맷: JSON

## 3. Request Parameter

| Parameter 이름 | 데이터 타입 | 필수 여부 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| id | Integer | Optional | N/A | 사용자 ID |
| name | String | Optional | N/A | 사용자 이름 |
| age | Integer | Optional | N/A | 사용자 나이 |

## 4. Response Status Code

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## 5. Authorization

- OAuth2 인증 방식을 사용
- Access Token을 사용하여 API 호출

## 6. API 호출 제한

- 초당 10회 호출 가능
- 인증된 사용자만 API 호출 가능

## 7. 예제 코드

```javascript
// 사용자 목록 조회 예제
$.ajax({
  url: "http://api.example.com/v1/users",
  type: "GET",
  headers: {
    "Authorization": "Bearer xxxxxxxx"
  },
  data: {
    "name": "John"
  },
  success: function(response) {
    console.log(response);
  },
  error: function(xhr, status, error) {
    console.log(xhr.responseText);
  }
});
``` 

위와 같이 API 연동 규격서를 작성하면, 다른 개발자나 시스템에서 해당 API를 호출할 때 필요한 정보들을 쉽게 파악할 수 있습니다. 이를 통해 API 연동에 대한 이해도가 높아지고, 원활한 연동이 가능해집니다.
