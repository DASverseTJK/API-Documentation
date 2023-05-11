Introduction
What does your API do?
G1 CASH 라는 앱의 회원가입과 로그인을 다루는 백엔드 부분을 Node.js 와 Postman 을 이용해 구현 해 보았습니다.













Overview
Things that the developers should know about
Global variable
verificationToken
[POST] send Auth Email Copy 에서 매번 암호화된 랜덤한 값을 받습니다

email
[POST] send Auth Email Copy 에 Body 값에 수동으로 정해줍니다 (유저 값)


Environment
url
localhost:3000


[GET] UserInfo
{{url}}/test
유저들의 정보를 출력 합니다.

[POST] send Auth Email
{{url}}/signup/auth
유저의 이메일 입력값이 들어오면 토큰을 발행하고 해당 이메일로 전송을 합니다.

[DELETE] Fail Auth then Delete Temp Account
{{url}}/delete/temp
이메일 전송 시 토큰을 해당 이메일에 저장을 해야 되기 때문에 이메일 전송 후 3분 동안 이메일 인증이 되지 않으면 해당 이메일을 삭제합니다
문제점 :
해당 이메일을 다시 사용 시 3분 후에 시도를 해야됩니다
아직 구현되지 않았습니다.



[POST] verifyEmail
{{url}}/signup/verify
토큰을 수령 후 정확한 토큰 값을 입력 후 이메일 인증을 완료합니다

[POST] Signup Request
{{url}}/signup
이메일 인증이 완료 된 후에 이메일과 비밀번호를 이용해 아이디를 생성합니다

[GET] Log In
{{url}}/test/login
유저가 로그인 하려는 이메일이 존재하는지 체크 합니다
유저가 로그인 하려는 이메일의 비밀번호가 맞는지 체크합니다
로그인


Authentication
What is the preferred way of using the API?
Method:
VerificationToken
유저에게 이메일을 받음과 동시에 인증토큰을 발행하여 해당 유저의 이메일로 전송을 하여 이메일을 수신한 유저가 이메일 인증을 합니다.


Endpoint:
{{url}}/signup/auth

Reqeust Requirement:
유저의 이메일 값을 필요로 하고 발행 받은 토큰의 값을 정확히 입력해야 합니다.

Response:
성공:
1. 유저의 이메일 입력
2. 발행 받은 토큰 값 정확히 입력
3. 이메일 인증

실패:
1. 중복된 이메일 값
2. 토큰 값 오타 혹은 정확하지 않은 토큰 값 입력
3. 3분 동안 인증 실패


Error Handling:

CodeMessage[409]: Duplicated Email AddressUser already exist. Use different email[400]: Either email or verificationToken missingFill out empty space
Error Codes
What errors and status codes can a user expect?
CodeMessage[404]: Email not existCould not find email that you are looking for[404]: Missing Token valueToken is missng[404]: User Not FoundUser not Found[400]: Password confirmation FailPassword and Confirm Password do not match. Check your password[400]: Either email or verificationToken missingFill out empty space[400]: Verification FailVerification Token Invalid. Try again[400]: Trying registration before verificationInvalid Approach: Check verification, if not please contact[409]: Duplicate EmailUser already exist. Use different email
Rate limit
Is there a limit to the number of requests a user can send?
1 time in 3 minutes
But it will be modified as 5 times in 3 min later.




