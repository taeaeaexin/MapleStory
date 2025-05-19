# 🍄‍ 메이플스토리 이벤트 보상 관리 시스템
> 운영자는 이벤트와 보상을 정의할 수 있습니다.  
> 유저는 조건을 만족하면 보상 요청을 하고 상태에 따라 자동 지급/거부가 됩니다.  
> 역할에 따라 보상 요청 내역 조회 권한이 구분됩니다.

<br>

## 📑 목차
- [실행 방법](#-실행-방법-docker-compose-기준)
- [설계 의도](#-설계-의도)
- [기술 스택](#-기술-스택)
- [기능 상세](#-기능-상세)
- [트러블슈팅](#-트러블슈팅)
- [한계점](#-한계와-개선-방향)

<br>

## 🔧 실행 방법 (Docker Compose 기준)

```bash
# 루트 디렉토리에서 실행
docker-compose up --build
```
- Gateway Server : http://localhost:3000
- MongoDB : mongodb://mongo:27017
<details>
  <summary>상세 실행 방법</summary>
  
  ## 1. Docker 실행
  1. MapleStory(root dir)에서 CMD 실행
  2. 'docker-compose up --build' 입력
  3. 이후 Postman으로 진행

  ## 2. Login API
  | Role | Method | URI | Json | Detail |
  | - | - | - | - | - |
  | User | POST | /login | {"email":"maple_user@maple.com", "password":"1234"} | User 로그인 (seed 있음) |
  | OPERATOR | POST | /login | {"email":"maple_operator@maple.com", "password":"1234"} | Operator 로그인 (seed 있음) |
  | AUDITOR | POST | /login | {"email":"maple_auditor@maple.com", "password":"1234"} | Auditor 로그인 (seed 있음) |
  | ADMIN | POST | /login | {"email":"maple_admin@maple.com", "password":"1234"} | Admin 로그인 (seed 있음) |
  - Seed 설정 되어있음 위 데이터로 로그인
  - 발급된 Token을 Authrization -> Bearer Toekn에 입력 후 진행
  - /signup (회원가입) : 동일 json으로 가입 (User role만 가입 가능)
  - /information (정보) : 로그인 중인 정보 조회 (Email, Role, UserId)

  ## 3. Events API
  | Role | Method | URI | Json | Detail |
  | - | - | - | - | - |
  | ALL | GET | /events |  | 이벤트 목록 조회 ('_id' 획득) |
  | OPERATOR, ADMIN | POST | /events | {"title": "이벤트 내용","description": "이벤트 내용","condition": "login","amount": 7,"unit": "일"} | 이벤트 등록 |
  - createdAt, status는 default 값 설정 되어있음

  ## 4. Rewards API
  | Role | Method | URI | Json | Detail |
  | - | - | - | - | - |
  | ALL | GET | /events/'_id'/rewards |  | 선택 이벤트 보상 목록 조회 ('_id' 삽입) |
  | OPERATOR, ADMIN | POST | /events/'_id'/rewards | {"rewardType": "ITEM","name": "이블윙즈","amount": 1} | 선택 이벤트 보상 등록 |
  - _id는 GET /events API에서 이벤트 id를 받아와 삽입

  ## 5. Request-rewards API
  | Role | Method | URI | Json | Detail |
  | - | - | - | - | - |
  | USER | POST | /events/'_id'/reward-request | {"inventory":{"login": 7}} | 이벤트에 따라 contition과 amount가 다름 (예시는 로그인 이벤트) |
  | OPERATOR, ADMIN | GET | /reward-requests |  | 유저 보상 요청 이력 조회 (Filter: userId, eventId, status) |
  | USER | GET | /my-reward-requests |  | 본인 보상 요청 이력 조회 (Filter: eventId, status) |
  - Parameter로 Filter 가능 
  
</details>

<br>

## 🧠 설계 의도
- 모든 요구사항을 반영해 기능을 구현하되, 이후 확장 및 유지보수를 고려하여 설계
- Gateway가 API 요청의 진입점으로 구성하여 JWT 인증 및 역할 기반 접근 제어 중앙 처리
- NestJS의 AuthGuard, RoleGuard, @Roles()를 활용해 권한을 명확히 분리
- 이벤트 조건을 condition, amount, unit 필드로 구성하여 유연하게 정의 가능
- 보상 요청 시 조건 만족 여부, 중복 여부를 서버에서 판단해 처리

<br>

## 🧱 기술 스택
| 항목 | 버전/도구 |
| - | - |
| 언어 | TypeScript |
| 런타임 | Node.js v18 |
| 프레임워크 | NestJS 최신 |
| DB | MongoDB |
| 인증 | JWT + Passport |
| 배포/실행 | Docker + docker-compose |

<br>

## 🔧 기능 상세

<b>🧩 프로젝트 구조</b>
| 서버 | 역할 |
| - | - |
| Gateway | API 요청 진입, 인증/인가, 각 서버로 라우팅 |
| Auth | 회원가입, 로그인, JWT 발급, 역할(Role) 관리 |
| Event | 이벤트 등록, 보상 등록, 유저 보상 요청/처리/저장/조회 |

<br>

<b>🔐 권한 기반 구조</b>
| 역할 | 권한 |
| - | - |
| USER | 보상 요청, 본인 보상 요청 이력 조회 가능 |
| OPERATOR | 이벤트/보상 등록 |
| AUDITOR | 보상 요청 이력 조회만 가능 |
| ADMIN | 모든 기능 접근 가능 |

<br>

<b>🌐 Gateway Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| GET | /information | ALL | Email, Role, UserId 조회 (JWT 필요) |

<br>

<b>🛡️ Auth Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| POST | /signup | ALL | 회원가입 (User 권한만 부여 가능) |
| POST | /login | ALL | 로그인 |

<br>

<b>📢 Event Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| POST | /events | OPERATOR, ADMIN | 이벤트 등록 |
| GET | /events | ALL | 이벤트 목록 조회 |
| POST | /events/:id/rewards | OPERATOR, ADMIN | 선택 이벤트에 보상 등록 |
| GET | /events/:id/rewards | ALL | 선택 이벤트 보상 목록 조회 |
| POST | /events/:id/reward-request | USER | 보상 요청 (조건에 따라 자동으로 보상 지급 여부 판단) |
| GET | /reward-requests | OPERATOR, ADMIN | 유저 보상 요청 이력 조회 (Filter: userId, eventId, status) |
| GET | /my-reward-requests | USER | 본인 보상 요청 이력 조회 (Filter: eventId, status)|

<br>

## 🔍 트러블슈팅

### 1. ENOTFOUND 에러 : Gateway -> Auth 프록시 실패
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : Gateway에서 Auth 서버로 요청 시 ENOTFOUND 오류 발생
  - 원인 : Docker compose 내 컨테이너 간 통신에서 외부 포트(localhost:3001)을 사용하여 연결 불가
  - 해결 : Gateway에서 Auth 요청 시 http://auth:3000으로 변경하여 네트워크 통신 구조 변경
    
</details>

### 2. 409 Conflict가 500 Internal Server Error로 반환
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : 중복 이메일 등으로 발생한 409 Conflict를 클라이언트에는 500 Internal server error로 전달
  - 원인 : Gateway의 Axios 예외 핸들러에서 에러 상태 코드를 전부 500으로 처리
  - 해결 : Axios 예외 핸들링 로직에서 error.response.status와 error.response.data 값을 그대로 반환하도록 수정하여, 실제 에러 상태값이 클라이언트로 전달 되도록 개선
    
</details>

### 3. MSA 구조 위반 : Gateway에서 Event 모듈 직접 참조
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : Gateway에서 Event 서버의 Controller를 직접 import하여 MSA 구조 위반
  - 원인 : 습관적으로 서버 간 명확한 경계를 무시한채 의존도 높은 구조로 설계
  - 해결 : Gateway에서는 Event 서버의 컨트롤러/서비스를 import하지 않고, httpService로 요청만 위임하도록 구조 정리
    
</details>

### 4. Socket hang up Error : Gateway 부팅 실패
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : Gateway 서버가 꺼져서 요청을 받지 못해 Socket hang up 발생
  - 원인 : jwt-auth.guard를 Gateway에 import 하다가 NestJS 부팅 시 해당 모듈을 찾지 못해 Gateway 자체가 죽음
  - 해결 : Gateway에는 인증 로직을 직접 사용하지 않고, 인증은 Event 서버에서만 처리하도록 구조 분리
    
</details>

### 5. GET /events 401 Unauthorized 발생
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : 단순 조회 API인 GET /events 요청 시에도 인증을 요구하는 에러인 401 Unauthorized 발생
  - 원인 : Event 서버에서 APP_GUARD로 JwtAuthGuard를 전역 적용하여 인증이 필요 없는 라우터 까지 막힘
  - 해결 : 인증이 필요 없는 라우터에 @Public() 데코레이터를 추가하고, JwtAuthGuard 내부에서 @Public()을 감지해 인증 로직을 생략하도록 수정
    
</details>

### 6. Seeder 오류 : event._id.toString() 사용 시 타입 에러
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제 : Seed 실행 중 event._id.toString() 호출 시 TypeScript 오류 발생
  - 원인 : createEvent()의 반환 타입이 명확하지 않아 event를 단순 Event 타입으로 추론, _id 속성이 없다고 인식
  - 해결 : 반환값에 EventDocument 타입을 명시하고, 시더 내부에서도 const event: EventDocument = ... 으로 타입 지정하여 _id 인식되도록 수정
    
</details>

### 7. @Req() 사용시 userId 추출 실패
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제: @Body()에서 userId를 받던 코드를 @Req()로 바꾸면서 req.user.sub 참조했지만 undefined 발생
  - 원인: JwtStrategy의 validate()에서 반환한 객체에 sub이 아닌 userId 필드로 설정했기 때문에 req.user.sub는 존재하지 않았음
  - 해결: validate()에서 sub 필드를 그대로 반환하도록 수정하여 req.user.sub로 접근 가능하게 만들었음
    
</details>

### 8. 보상 조건 검증 중 N+1 문제 발생
<details>
  <summary> 자세히 보기 </summary>
  
  - 문제: 보상 조건 검증을 위해 userId를 기준으로 inventory를 반복 조회하면서 성능 저하 발생이 예상되었음 (데이터가 적어서 발생은 안함)
  - 원인: RewardRequest는 유저 ID만 가지고 있고, inventory는 User에서 별도 조회해야 해서 User.findById()가 반복 호출 됨
  - 해결: 유저가 보상 요청을 할 때 자신의 inventory를 @Body()로 함께 전송하도록 구조 변경, 서버는 해당 inventory만으로 조건 검증 수행하므로 DB 조회 불필요 (O(1))
    
</details>

<br>

## ⏳ 한계와 개선 방향

### 1. 수정 기능 부재
<details>
  <summary> 자세히 보기 </summary>
  
  - 현재 이벤트 및 보상 정보는 등록만 가능하고 수정/삭제는 미구현 상태
  - 운영 편의성을 위해 PATCH/DELETE API 확장 고려
  
</details>

### 2. 테스트코드 부재
<details>
  <summary> 자세히 보기 </summary>
  
  - 서비스를 구현하고 Jest까지 공부하여 구현하기에 시간적 한계 (JUnit은 할 줄 압니다!!) 
  - 서비스 단의 핵심 로직(조건 검증, 중복 보상 차단 등)에 대한 테스트 커버리지 시도 중 실패가 매우 아쉬움
  - 개발하면서 테스트 코드도 작성해야 했지만 그렇지 못한점에 반성 중

</details>

### 3. Swagger 문서 미제공
<details>
  <summary> 자세히 보기 </summary>

  - Swagger를 제공하지 않아 Postman 없이 API 테스트 어려운 점이 아쉬움
  
</details>

### 4. 예외 처리 미흡
<details>
  <summary> 자세히 보기 </summary>

  - 예외 처리 세분화 및 사용자 메시지 명확화 필요 (클라이언트에 동일한 에러 메시지 반복적으로 반환 됨)
  - 공통 예외 처리 필터 및 커스텀 에러 클래스를 도입하여 리팩토링 필요
 
</details>

---

<div align="center">

  *온 힘을 다해 부딪힌 이 프로젝트에 후회는 없습니다.  
결과물이 메이플스토리 개발팀의 기준에 닿기를 바랍니다  
감사합니다.*

</div>


