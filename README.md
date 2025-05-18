# 🍄‍ 메이플스토리 이벤트/보상 관리 시스템
> NestJS 기반 MSA 아키텍처 프로젝트  
> JWT 인증 및 역할 기반 권한 제어 적용  
> 유지보수성, 확장성, 인증 보안을 고려한 설계

<br>

## 🔧 실행 방법 (Docker Compose 기준)

```bash
# 루트 디렉토리에서 실행
docker-compose up --build
```
- Auth Server : http://localhost:3000
- MongoDB : mongodb://mongo:27017/auth (자동 연결)

<br>

## 🧠 설계 의도
- 모든 요구사항을 반영해 기능을 구현하되, 이후 확장 및 유지보수를 고려하여 설계
- Gateway가 API 요청 진입점이며 인증과 라이팅 역할
- NestJS의 AuthGuard, RoleGuard, @Roles()를 활용해 역할 기반 접근 제어 명확히 분리
- 이벤트는 condition, amount, unit으로 유연하게 정의 가능
- 보상 요청 시 조건 만족 여부와 중복 여부를 서버에서 판단해 처리

<br>

## 🧱 기술 스택
| 항목 | 버전/도구 |
| - | - |
| 언어 | TypeScript |
| 런타임 | Node.js 18 |
| 프레임워크 | NestJS 최신 |
| DB | MongoDB |
| 인증 | JWT + Passport |
| 배포/실행 | Docker + docker-compose |

<br>

## 🔧 기능 상세

<b>🧩 프로젝트 구조</b>
| 서버 | 역할 |
| - | - |
| auth | 유저 등록, 로그인, JWT 발급 |
| gateway | API 요청 진입 + 인증/인가 |
| event | (이벤트 등록 / 이벤트 관련) |

<br>

<b>🔐 권한 기반 구조</b>
| 역할 | 권한 |
| - | - |
| USER | 보상 요청 |
| OPERATOR | 이벤트/보상 등록 및 이력 조회 |
| ADMIN | 전체 기능 접근 가능 |

<br>

<b>🛡️ Auth Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| POST | /signup | ALL | 회원가입 |
| POST | /login | ALL | 로그인 |

<br>

<b>🌐 Gateway Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| GET | /secure | USER, ADMIN | 로그인한 유저만 접근 가능 (JWT 필요) |

<br>

<b>📢 Event Server</b>
| Method | URI | 권한 | 설명 |
| - | - | - | - |
| POST | /events | OPERATOR | 이벤트 등록 |
| GET | /events | ALL | 전체 이벤트 조회 |
| POST | /events/:id/rewards | OPERATOR | 선택 이벤트에 보상 등록 |
| GET | /events/:id/rewards | ALL | 선택 이벤트 보상 목록 조회 |
| POST | /events/:id/reward-request | USER | 유저가 보상 요청 |
| GET | /reward-requests | OPERATOR, ADMIN | 보상 요청 이력 조회 (userId 쿼리 지원) |

<br>

## 🔍 트러블슈팅
### 1. ENOTFOUND 에러 Gateway -> Auth 프록시 실패
- 문제 : Gateway에서 Auth 서버로 요청 시 ENOTFOUNR 발생
- 원인 : Doker 컨테이너 간 통신에서 외부 포트(3001) 사용
- 해결 : 클라이언트 -> Gateway(3000) -> Auth(3000)로 구조 변경

<br>

### 2. 409 Conflict -> 500 Error 처리 문제
- 문제 : 409 Conflict를 500 Internal server error로 return해서 착오가 생김
- 원인 : Auth 서버에서는 정상적으로 409 반환(터미널로 확인), Gateway -> Axios 에러 핸들러 로직에서 500 반환
- 해결 : Axios의 status 값을 그대로 클라이언트에 반환

<br>

### 3. MSA 구조 위반
- 문제 : Gateway에서 Event 서버의 Controller를 직접 import하여 Nest 앱이 MSA 경계를 침범
- 원인 : MSA 구조를 무시하고 Gateway에서 Event의 controller를 import하려 함
- 해결 : Gateway에서는 Event 서버의 컨트롤러/서비스를 import하지 않고, 오직 httpService로 요청만 위임하도록 구조 정리

<br>

### 4. Error: Socket hang up
- 문제 : Gateway 서버가 꺼져서 요청을 받지 못해 Socket hang up 발생
- 원인 : jwt-auth.guard를 Gateway에 import 하다가 NestJS 부팅 시 해당 모듈을 찾지 못해 Gateway 자체가 죽음
- 해결 : Gateway에는 인증 로직을 직접 사용하지 않고, 인증은 Event 서버에서만 처리하도록 구조 분리

<br>

### 5. GET /events → 401 Unauthorized
- 문제 : 단순 조회 API인 GET /events 요청 시에도 인증이 필요하다고 판단되어 401 Unauthorized 에러 발생
- 원인 : Event 서버에서 APP_GUARD로 JwtAuthGuard를 전역 적용하여 @UseGuards() 없이도 모든 요청에 인증이 요구됨
- 해결 : 인증이 필요 없는 라우터에 @Public() 데코레이터를 추가하고, JwtAuthGuard 내부에서 @Public()을 감지해 인증 로직을 생략하도록 수정

<br>

### 6. seed 실행 시 event._id.toString() → Property '_id' does not exist on type 'Event'.ts(2339)
- 문제 : seeder에서 event._id.toString() 사용 시 TypeScript 오류 발생
- 원인 : createEvent()의 반환 타입이 명확하지 않아 event를 단순 Event 타입으로 추론, _id 속성이 없다고 판단함
- 해결 : 반환값에 EventDocument 타입을 명시하고, 시더 내부에서도 const event: EventDocument = ... 으로 타입 지정하여 _id 인식되도록 수정

### 7. seed 실행 시 event._id.toString() → Property '_id' does not exist on type 'Event'.ts(2339)
- 문제 : seeder에서 event._id.toString() 사용 시 TypeScript 오류 발생
- 원인 : createEvent()의 반환 타입이 명확하지 않아 event를 단순 Event 타입으로 추론, _id 속성이 없다고 판단함
- 해결 : 반환값에 EventDocument 타입을 명시하고, 시더 내부에서도 const event: EventDocument = ... 으로 타입 지정하여 _id 인식되도록 수정

# 내일 할 일
http://localhost:3000/events/6828a04e2986bf1889edf21a/rewards
{
    "statusCode": 500,
    "message": "Internal server error"
}
0) base write gen: 12"}}}
gateway-1  | [Nest] 37  - 05/17/2025, 2:57:16 PM   ERROR [ExceptionsHandler] Request failed with status code 403
gateway-1  | AxiosError: Request failed with status code 403
gateway-1  |     at settle (/app/node_modules/axios/lib/core/settle.js:19:12)
gateway-1  |     at IncomingMessage.handleStreamEnd (/app/node_modules/axios/lib/adapters/http.js:599:11)
gateway-1  |     at IncomingMessage.emit (node:events:529:35)
gateway-1  |     at endReadableNT (node:internal/streams/readable:1400:12)
gateway-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
gateway-1  |     at Axios.request (/app/node_modules/axios/lib/core/Axios.js:45:41)
gateway-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
mongo      | {"t":{"$date":"2025-05-17T14:58:02.535+00:00"},"s":"I",  "c":"WTCHKPT",  "id":22430,   "ctx":"Checkpointer","msg":"WiredTiger message","attr":{"message":{"ts_sec":1747493882,"ts_usec":534983,"thread":"1:0x7f2d8a7db6c0","session_name":"WT_SESSION.checkpoint","category":"WT_VERB_CHECKPOINT_PROGRESS","category_id":7,"verbose_level":"DEBUG_1","verbose_level_id":1,"msg":"saving checkpoint snapshot min: 25, snapshot max: 25 snapshot count: 0, oldest timestamp: (0, 0) , meta checkpoint timestamp: (0, 0) base write gen: 12"}}}

http://localhost:3000/reward-requests?userId=maple_user@maple.com
{
    "statusCode": 500,
    "message": "Internal server error"
}gateway-1  | [Nest] 37  - 05/17/2025, 2:59:00 PM   ERROR [ExceptionsHandler] Request failed with status code 403
gateway-1  | AxiosError: Request failed with status code 403
gateway-1  |     at settle (/app/node_modules/axios/lib/core/settle.js:19:12)
gateway-1  |     at IncomingMessage.handleStreamEnd (/app/node_modules/axios/lib/adapters/http.js:599:11)
gateway-1  |     at IncomingMessage.emit (node:events:529:35)
gateway-1  |     at endReadableNT (node:internal/streams/readable:1400:12)
gateway-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
gateway-1  |     at Axios.request (/app/node_modules/axios/lib/core/Axios.js:45:41)
gateway-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
mongo      | {"t":{"$date":"2025-05-17T14:59:02.548+00:00"},"s":"I",  "c":"WTCHKPT",  "id":22430,   "ctx":"Checkpointer","msg":"WiredTiger message","attr":{"message":{"ts_sec":1747493942,"ts_usec":548271,"thread":"1:0x7f2d8a7db6c0","session_name":"WT_SESSION.checkpoint","category":"WT_VERB_CHECKPOINT_PROGRESS","category_id":7,"verbose_level":"DEBUG_1","verbose_level_id":1,"msg":"saving checkpoint snapshot min: 26, snapshot max: 26 snapshot count: 0, oldest timestamp: (0, 0) , meta checkpoint timestamp: (0, 0) base write gen: 12"}}}

1. 보상 요청 에러
2. 보상 요청 이력 조회 에러
3. 보상 조건 달성했는지 어떻게 판단? -> 유저 status? inventory에 보상 조건 저장하게하고 postman으로 수정요청해서 aomunt status 변경하기
User ID (이메일 말고) 없음