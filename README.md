# 메이플스토리 이벤트/보상 관리 백엔드 과제

> NestJS 기반 MSA 아키텍처로 구성된 이벤트 보상 시스템  
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

## 🧩 과제 개요
프로젝트 구조
서버 구성

## 🔧 기능 상세
서버 별 구체적 기능