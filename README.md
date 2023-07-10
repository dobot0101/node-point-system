### 사용 기술

- Node.js, Express, Typescript
- MySQL
- ~~Jest, Supertest~~
- Docker

### 실행 방법

1. DB 생성
2. .env 파일의 DB 접속 정보를 본인의 환경에 맞게 변경
3. 터미널에 docker-compose up 실행
4. 아래의 API End point에 요청
   - 포인트 적립
     - POST /events
     - Request body의 action 값(ADD, MOD, DELETE)에 따라 포인트 생성, 수정, 취소 처리됨
   - 전체 회원 포인트 내역 조회
     - GET /points/list
   - 회원 포인트 내역 조회
     - GET /members/:userId/pointList
   - 회원 포인트 합계 조회
     - GET /members/:userId/totalPoint

### 기타

1. uuid는 꼭 v4로 사용해야되나?

   - 결론부터 말하면 아니다. v4 다음으로 v1이 사용되는데 timestamp + mac 주소의 조합으로 생성된다(v4는 랜덤 값). 그렇기 때문에 uuid 값을 통해 mac 주소를 알 수 있고, 언제 생성하였는지 유추할 수 있다는 보안 문제가 있다. 하지만 v4 uuid 값 보다 값이 더 유니크하다는 특징이 있다.
   - 개인적인 생각으론 v4를 사용하는게 좋을 것 같다. v1은 약간(?)의 보안 문제가 있고 v4를 사용한다고 해서 중복 값이 발생할 수 있는 확률은 매우 낮으며(=값이 충분히 유니크하며) 개인적인 경험으론 Node.js, Java 프로젝트에서 애플리케이션에서 UUID 값을 생성한다면 UUID 값을 생성하는 내장 메서드들이 기본적으로 v4로 생성해주는 것으로 알고 있어서 v4를 사용하는 것이 편하다고 생각한다.
2. uuid는 DB에 binary(16), varchar(36) 중 어떤 타입으로 저장해야되나?
   - varchar를 binary로 변환하여 저장한다면 컬럼의 용량을 줄일 수 있다.
   - varchar(36) 타입의 값을 binary(16) 타입으로 변경하는 방법은 아래와 같다.
3. (기타) Ordered UUID
   - DB에서 UUID(긴 문자열)를 인덱스로 사용하는건 인덱스가 비정상적으로 커지고 검색 성능도 많이 떨어지기 때문에 추천하지 않는다.
   - 하지만 만약 UUID 값의 1-2-3-4-5 형태를 32145 형태로 변환하면 어느정도 순서를 보장하는 값이 되어서 auto_increment 값을 PK로 사용하는 것과 비슷한 성능을 낼 수 있다고 한다. 이를 Ordered UUID라고 한다고 한다.

```
insert into uuid_test select unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', ''))
```

이런식으로 '-' 문자를 replace하고 unhex 함수를 사용하여 binary 값으로 변경하여 저장한다. 컬럼의 용량은 줄어들지만 저장된 select 해보면 human readable 하지 않다. 그래서 만약 readable한 값이 필요할 때는

````
select hex(unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', '')))```
````

이런식으로 값을 변환해야한다.

4. 간단한 인증 프로세스 구현
   - 개발 중에 인증된 클라이언트만 API를 요청할 수 있어야 한다는 생각이 들어서 간단하게 인증 로직을 구현해놓았습니다. 따라서 회원가입(/auth/register) 후 로그인 (/auth/login) 하면 쿠키에 Authorization 토큰이 생성되고, 이후 point 관련 요청에서는 요청 헤더의 Authorization 값의 유효성을 확인한다.
5. 포인트 내역 테이블 설계에 대한 고민
   - 처음에는 point 테이블에 review_type, review_id 컬럼을 만들고 리뷰에 대한 포인트만 저장하게 설계하였다. 하지만 나중에 "리뷰 외에 다른 경우에도 포인트를 적립하게 된다면?" 이라는 생각이 들었고 기존의 review_type, review_id 컬럼을 source_type, source_id, memo 컬럼으로 변경하여 혹시 모를 다른 경우에도 포인트를 적립할 수 있는 구조로 변경하였다.
