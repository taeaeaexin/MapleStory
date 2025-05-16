# 🍄‍ 메이플스토리 이벤트/보상 관리 시스템
> NestJS 기반 MSA 아키텍처 프로젝트
> MongoDB를 사용하였으며 JWT 인증과 역할 기반 권한 관리를 적용하여 유저, 운영자 등 권한 분리 지원

<br>

## 🔧 실행 방법 (Docker Compose 기준)

```bash
# 루트 디렉토리에서 실행
docker-compose up --build
```
- Auth Server : http://localhost:3001
- MongoDB : mongodb://mongo:27017/auth (자동 연결)

<br>

## 🧠 설계 의도
- MSA 구조로 auth, event, gateway를 분리하여 유지보수성과 확장성 높임
- JWT 왜 사용? Role 기반 권한 분리
- 이벤트 설계, 조건 검증 방식, API 구조 선택 이유, 구현 중 겪은 고민 등

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

문제 : Gateway를 통해 signup/login 라우팅 프록시 구현 중 ENOTFOUNR 발생
원인 : 컨테이너 안에서 3001로 요청, 도커 컨테이너끼리는 외부 포트가 아닌 내부 포트 사용해야 함
해결 : 클라이언트 -> Gateway(3000) -> Auth(3000)로 구조 변경

문제 : 409 Conflict를  500 Internal server error로 return해서 착오가 생김
원인 : Auth 서버에서는 정상적으로 409 반환(터미널로 확인), Gateway -> Axios 에러를 catch하면서 그냥 500으로 던짐
해결 : Gateway에서 Axios 오류 상태 그대로 클라이언트에 전달