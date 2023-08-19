### 사용 기술

- Node.js, Express, Typescript, TypeORM
- Postgresql
- Jest
- Docker

### 실행 방법

1. 터미널에 docker compose up 실행
2. 아래의 API End point에 HTTP 요청
   - 회원가입
     - post /auth/register
   - 로그인
     - post /auth/login
     - 로그인 성공 시 JWT를 응답으로 보냄
     - 이후 다른 API 호출 시 header의 Authorization 값으로 Bearer + ' ' + JWT로 입력하고 요청을 보내면 됨
     - ex) Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDg2MGMwMS02MjI5LTQ4ODUtYmQyMi1mZGRjNTQ2NTdkNjYiLCJpYXQiOjE2OTIzMTczNDEsImV4cCI6MTY5MjMyMDk0MX0.-UlGc4CNOS3vVfNCch1_HEkgXvrS4O_nYOYvv4c1oA4
   - 포인트 적립/수정/취소
     - POST /point
     - Request body의 action 값(ADD, MOD, DELETE)에 따라 포인트 지급, 수정, 취소
   - 특정 회원의 포인트 목록 조회
     - GET /user/:userId/points
   - 특정 회원의 보유 포인트 조회
     - GET /user/:userId/total-point

### 기타

1. 인증 (Authentication)

   - 인증된 클라이언트만 API를 사용하게 하기 위해 인증을 구현하였습니다. 회원가입 후 로그인 성공 시 Authorization 토큰이 생성되고 쿠키로 응답을 보내며, 이후 요청 헤더에 Authorization 값을 담아서 다른 API를 호출하면 미들웨어에서 Authorization 토큰을 해석하여 회원정보를 얻고 비즈니스 로직을 실행합니다.

2. Unit 테스트 시 DB 환경에 대한 고민

   - 서비스 DB에 붙어서 테스트 코드가 실행되도록 하면 서비스에 불필요한 데이터가 쌓일 수 있고, 테스트 데이터와 서비스 데이터가 공존하기 때문에 여러번의 테스트 결과가 항상 같음을 보장할 수 없다. 그래서 테스트 DB를 따로 만들려고 했는데 관련 설정, 테스트 데이터 관리, 테스트 환경 일관성 유지 등 생각해야될 문제가 많아지는 것 같아 다른 방법을 고민하였다. 결국 서비스 DB를 사용하지만 트랜잭션 안에서 테스트 코드를 실행하고 테스트가 끝나면 Rollback 하는 방식으로 결정하였다. 테스트 데이터가 누적되지 않아 따로 관리할 필요가 없고, 테스트 DB를 위한 추가 설정도 필요 없어서 꽤 좋은 방법인 것 같다.

3. uuid는 꼭 v4로 사용해야되나요?

   - (이 프로젝트에서 과거에 MySQL을 사용할 때 UUID 타입을 사용하기 위해 여러 자료를 검색한 내용입니다. 현재는 상관없는 내용입니다.)
   - 결론부터 말하면 아니다. v4 다음으로 v1이 사용되는데 timestamp + mac 주소의 조합으로 생성된다(v4는 랜덤 값). 그렇기 때문에 uuid 값을 통해 mac 주소를 알 수 있고, 언제 생성하였는지 유추할 수 있다는 보안 문제가 있다. 하지만 v4 uuid 값 보다 값이 더 유니크하다는 특징이 있다.
   - 개인적인 생각으론 v4를 사용하는게 좋을 것 같다. v1은 약간(?)의 보안 문제가 있고 v4를 사용한다고 해서 중복 값이 발생할 수 있는 확률은 매우 낮으며(=값이 충분히 유니크하며) 개인적인 경험으론 Node.js, Java 프로젝트에서 애플리케이션에서 UUID 값을 생성한다면 UUID 값을 생성하는 내장 메서드들이 기본적으로 v4로 생성해주는 것으로 알고 있어서 v4를 사용하는 것이 편하다고 생각한다.

4. uuid는 DB에 binary(16), varchar(36) 중 어떤 타입으로 저장해야되나?
   - varchar를 binary로 변환하여 저장한다면 컬럼의 용량을 줄일 수 있다.
   - varchar(36) 타입의 값을 binary(16) 타입으로 변경하는 방법은 아래와 같다.
5. (기타) Ordered UUID
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
