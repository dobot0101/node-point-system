### 사용 기술
- Node.js, Express, Typescript
- MySQL
- Jest, Supertest

### 실행 방법
1. DB 생성
2. /secret.env 파일의 DB 접속 정보를 본인의 환경에 맞게 변경
3. 터미널에 npm install 입력
4. 터미널에 npm run build 입력
5. 터미널에 npm start 입력
6. 아래의 API End point에 요청
    - 포인트 적립
        - POST /events
        - Request body의 action 값(ADD, MOD, DELETE)에 따라 포인트 생성, 수정, 취소 처리됨
    - 전체 회원 포인트 내역 조회
        - GET /points/list
    - 회원 포인트 내역 조회
        - GET /members/:userId/pointList
    - 회원 포인트 합계 조회
        - GET /members/:userId/totalPoint
        
### 테스트 코드 실행 방법
1. TEST DB 생성
2. /secret.env 파일의 TEST_DB 정보를 본인의 환경에 맞게 변경
3. 터미널에 npm test 입력

### 테이블, 인덱스 DDL 파일 위치
- /ddl.sql

### 기타
1. 1-2-3-4-5 형태의 UUID를 32145  형태로 변경한 이유
    - DB에서 긴 문자열을 인덱스로 사용하는건 인덱스가 비정상적으로 커지고 검색 성능도 많이 떨어지기 때문에 추천하지 않음
    - 하지만 32145 형태로 변환하면 어느정도 순서를 보장하는 값이 되어서 auto_increment 값을 PK로 사용하는 것과 비슷한 성능을 낼 수 있음
    - 이를 ordered UUID 라고 말한다.
2. 꼭 uuid는 꼭 v4로 사용해야되나?
    - 결론부터 말하면 아니다. v4 다음으로 v1이 사용되는데 timestamp + mac 주소의 조합으로 생성된다(v4는 랜덤 값). 그렇기 때문에 uuid 값을 통해 mac 주소를 알 수 있고, 언제 생성하였는지 유추할 수 있다는 보안 문제가 있다. 하지만 v4 uuid 값 보다 값이 더 유니크하다는 특징이 있다.
3. uuid는 DB에 binary(16), varchar(36) 중 어떤 타입으로 저장해야되나?    
    - 검색한 결과 정답이 없는 것 같다. 만약 binary(16) 타입으로 저장한다면 
```
insert into uuid_test select unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', ''))
```
이런식으로 저장한다. 데이터의 길이는 줄어든다는 장점이 있지만 저장된 select 해보면 human readable 하지 않다. 그래서 만약 readable한 값이 필요할 때는 
```
select unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', ''))```
```
이런식으로 값을 변환해야한다.

    
4. 간단한 인증 프로세스 구현  
    - 개발 중에 인증된 클라이언트만 API를 요청할 수 있어야 한다는 생각이 들어서 간단한 인증 토큰 생성 / 인증을 구현하였습니다.  
    - 만약 적용하고 테스트하려면 src/app.ts 파일의 주석을 참고하여 실행할 미들웨어 코드를 교체하고,  
    아래의 이미지와 같이 서버 시작 시 터미널에 찍히는 accessToken을 authorization 헤더에 추가하여 API를 요청하면 됩니다.
    ![access_token](./img/readme_accesstoken.png)
    
5. 포인트 내역 테이블 설계에 대한 고민
    - 처음에는 point 테이블에 review_type, review_id 컬럼을 만들고 리뷰에 대한 포인트만 저장하게 설계하였다. 하지만 나중에 "리뷰 외에 다른 경우에도 포인트를 적립하게 된다면?" 이라는 생각이 들었고 기존의 review_type, review_id 컬럼을 source_type, source_id, memo 컬럼으로 변경하여 혹시 모를 다른 경우에도 포인트를 적립할 수 있는 구조로 변경하였다.
