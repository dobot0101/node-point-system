### 사용 기술

- Node.js, Express, Typescript, TypeORM
- Postgresql
- AWS SQS
- Jest
- Docker

### 기능 설명

- 회원가입, 로그인
  - 로그인 시 JWT 생성
- 인증
  - 회원가입, 로그인 외 API 요청 시 JWT 유효성 확인
- 포인트 적립, 수정, 취소
  - PointService는 AWS SQS 큐에 포인트 적립/수정/취소 요청 메시지 전송
  - SQSConsumer가 메시지 확인 및 포인트 적립/수정/취소 데이터 생성
- 유저 포인트 목록 조회, 보유 포인트 조회

### 실행 방법

1. 터미널에 docker compose up --build 실행<br>
2. 아래의 API End point에 HTTP 요청<br>

   - 회원가입<br>- post /auth/register
   - 로그인<br>- post /auth/login<br>- 로그인 성공 시 JWT 생성 및 응답으로 보냄<br>- 이후 다른 API 요청 시 헤더의 Authorization 필드에 "Bearer token" 값 추가

   - 포인트 적립/수정/취소<br>
     ex)<br>

     ```
     curl --request POST \
     --url http://localhost:3000/points \
     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDg2MGMwMS02MjI5LTQ4ODUtYmQyMi1mZGRjNTQ2NTdkNjYiLCJpYXQiOjE2OTIzMTczNDEsImV4cCI6MTY5MjMyMDk0MX0.-UlGc4CNOS3vVfNCch1_HEkgXvrS4O_nYOYvv4c1oA4' \
     --header 'Content-Type: application/json' \
     --data '{"reviewId":"a1ff42a4-65e4-49f0-ac2b-eae1808097a9","action":"ADD","placeId":"a1ff42a4-65e4-49f0-ac2b-eae1808097a9"}'
     ```

     - placeId는 옵션
     - action 값에 따라 포인트 적립/수정/삭제
       - ADD: 적립
       - MOD: 수정
       - DELETE: 삭제<br><br>

   - 유저의 포인트 목록 조회<br>
     ex)<br>

     ```
     curl --request GET \
     --url http://localhost:3000/users/9d860c01-6229-4885-bd22-fddc54657d66/points \
     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDg2MGMwMS02MjI5LTQ4ODUtYmQyMi1mZGRjNTQ2NTdkNjYiLCJpYXQiOjE2OTIzMTczNDEsImV4cCI6MTY5MjMyMDk0MX0.-UlGc4CNOS3vVfNCch1_HEkgXvrS4O_nYOYvv4c1oA4' \

     ```

   - 유저의 보유 포인트 조회<br>
     ex)

     ```
     curl --request GET \
     --url http://localhost:3000/users/9d860c01-6229-4885-bd22-fddc54657d66/total-point \
     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDg2MGMwMS02MjI5LTQ4ODUtYmQyMi1mZGRjNTQ2NTdkNjYiLCJpYXQiOjE2OTIzMTczNDEsImV4cCI6MTY5MjMyMDk0MX0.-UlGc4CNOS3vVfNCch1_HEkgXvrS4O_nYOYvv4c1oA4' \

     ```

### 기타

1. Unit 테스트 시 DB 환경에 대한 고민<br>- 서비스 DB에 붙어서 테스트 코드가 실행되도록 하면 서비스에 불필요한 데이터가 쌓일 수 있고, 테스트 데이터와 서비스 데이터가 공존하기 때문에 여러번의 테스트 결과가 항상 같음을 보장할 수 없다. 그래서 테스트 DB를 따로 만들려고 했는데 관련 설정, 테스트 데이터 관리, 테스트 환경 일관성 유지 등 생각해야될 문제가 많아지는 것 같아 다른 방법을 고민하였다. 결국 서비스 DB를 사용하지만 트랜잭션 안에서 테스트 코드를 실행하고 테스트가 끝나면 Rollback 하는 방식으로 결정하였다. 테스트 데이터가 누적되지 않아 따로 관리할 필요가 없고, 테스트 DB를 위한 추가 설정도 필요 없어서 꽤 좋은 방법인 것 같다.

2. uuid v4를 사용한 이유 (v1을 사용하지 않은 이유)<br>- v4 다음으로 v1 이 많이 사용되고 v4 보다 값이 유니크하다는 특징이 있음. 하지만 timestamp + mac 주소의 조합으로 생성되기 때문에 UUID 값으로 mac 주소, 생성 시간을 알 수 있다는 보안 문제가 있음.<br>- v1은 위에서 말한 보안 문제가 있고 v4도 충분히 유니크하기 때문에 중복 문제가 발생할 확률은 배우 낮고, 여러 프로그래밍 언어에 uuid-v4 값을 생성하는 내장 메서드가 있기 때문에 v4를 사용하는게 좋다고 생각함.


### 기타 (과거 MySQL 5.7 버전을 사용했을 때의 이슈 정리이므로 현재 버전과 무관)
1. uuid는 DB에 binary(16), varchar(36) 중 어떤 타입으로 저장해야되나?<br>- binary로 저장하면 컬럼의 용량을 줄일 수 있음.

2. (기타) Ordered UUID<br>- DB에서 UUID(긴 문자열)를 인덱스로 사용하는건 인덱스가 비정상적으로 커지고 검색 성능도 많이 떨어지기 때문에 추천하지 않는다.<br>- 하지만 만약 UUID 값의 1-2-3-4-5 형태를 32145 형태로 변환하면 어느정도 순서를 보장하는 값이 되어서 auto_increment 값을 PK로 사용하는 것과 비슷한 성능을 낼 수 있다고 함. 이것을 ordered uuid라고 한다고 함.

   ```
   insert into uuid_test select unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', ''))
   ```

   이런식으로 '-' 문자를 replace하고 unhex 함수를 사용하여 binary 값으로 변경하여 저장할 수 있다. 컬럼의 용량은 줄어들지만 저장된 select 해보면 인간이 읽을 수 없는 형태로 저장된 것을 확인할 수 있다. 만약 읽을 수 있는 값이 필요하면

   ````
   select hex(unhex(replace('87c733ba-f2c4-40a4-b7df-99567cc947bc', '-', '')))
   ````

   이런식으로 값을 변환해야한다.
