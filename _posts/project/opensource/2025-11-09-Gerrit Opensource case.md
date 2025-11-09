---
layout: post
title: ORAN 코드 기여
subtitle: ORAN 코드 기여
date: '2025-11-09 10:45:51 +0900'
categories:
    - project
    - opensource
    - study
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---

# [OpenSource] OSSCA 기간 중 ORAN 프로젝트 기여 내용 총정리

올해는 운 좋게도 7월 12일에서 10월 31일까지 진행하는 **OpenSource Contribution Academy 참가형** 프로그램의 **O-RAN Software Community AI/ML Framework(AIMLFW)** 프로젝트에 선발되어 참여하게 됐습니다.

이번 프로그램에서는 **코드 기여 + 아키텍처 논의 + Gerrit 리뷰 플로우**까지 전부 경험해볼 수 있었습니다.

이 글에서는 제가 AIMLFW에 기여하면서

- ARM 기반 **맥 환경에서 삽질(?)하다가 윈도우 노트북 + Tailscale로 우회한 환경 설정 이야기**
- 실제로 했던 네 가지 기여
  1. local image deletion 스크립트 단순화 시도
  2. LLM ChatBot 구조 설계 & 공식 문서 정리
  3. LLM 챗봇 최소 컨트롤러 엔드포인트 개발
  4. DB 구조 개선(TargetEnvironment 사이드 테이블) 및 테스트 코드 추가  

를 정리해보려고 합니다.

---

# 환경 설정

처음에는 RAM 16G, Disk 512G의 M1 맥북을 가지고 프로젝트를 시작했습니다.  
그런데 AIMLFW 쪽 배포 스크립트와 의존 구성 요소들이 amd64(x86_64) 전제로 구성된 부분이 많아서,  
ARM 환경에서는 컨테이너 이미지/도구 몇 개가 제대로 동작하지 않아 환경 세팅이 제대로 되지 않는 이슈가 있었습니다.

또한 권장 사양도 RAM 32G부터인 문제도 있었습니다.

처음에는 이 부분을 기여 대상으로 삼아 "Mac 환경에서 제대로 구동되도록 해보자...!"라고 생각해보았지만 저 혼자 할 수 없을 것 같은 크기의 기여였고,
쿠버네티스/스토리지/모니터링까지 한 번에 돌려야 해서 리소스와 아키텍처 이슈가 생각보다 컸습니다.

그래서 결국 제가 생각한 가장 효율적인 방법은 다음과 같습니다.

맥은 개발용 클라이언트(IDE, 브라우저)로 쓰고,  
실제 AIMLFW 클러스터는 집에 있는 윈도우 노트북에서 돌리자.  
둘은 Tailscale로 하나의 네트워크처럼 묶자

## 윈도우 노트북에 환경 설정을 하고 Tailscale로 연동

제가 실제로 구축한 흐름은 대략 이런 느낌이었습니다.

1. **윈도우 노트북에 리눅스 개발 환경 준비**
   - Windows 11 기준, **WSL2 + Ubuntu** 설치
   - WSL2에 `docker`, `kind` 또는 `nerdctl` 기반 컨테이너 환경 구성
   - AIMLFW에서 요구하는 것들(예: InfluxDB, LeoFS, Kubeflow 등)을  
     스크립트/Helm 차트 기반으로 배포 가능한 형태로 맞추기

2. **윈도우 노트북에 Tailscale 설치**
   - Tailscale 클라이언트를 윈도우에 설치하고, 제 계정으로 로그인
   - WSL2 → Windows 포트 포워딩

3. **맥북에 Tailscale 설치**
   - 맥에도 Tailscale 설치 후 같은 계정으로 로그인
   - 맥에서 윈도우 노트북에 ssh로 접근

4. **맥에서 VS Code / SSH로 원격 개발**
   - 맥에서는 평소처럼 VS Code를 띄워서 Remote-SSH로 WSL2 환경에 붙고, 코드 편집/빌드/테스트는 전부 WSL2에서 수행
   - 브라우저에서 접속해야 하는 대시보드/서비스 URL도 `http://윈도우-Tailscale-IP:포트` 형태로 접근

이렇게 구성을 완료하였습니다!!

---

# 기여 내용

이제 본격적으로 제가 AIMLFW에 했던 기여들을 정리해보겠습니다.

---

## 1. simplify local image deletion script

- 링크: <https://gerrit.o-ran-sc.org/r/c/aiml-fw/aimlfw-dep/+/14779>

여러 번의 `nerdctl rmi` 호출을 이미지 리스트 한 번 호출로 통합하여 스크립트를 단순화하는 데에 목적을 두었습니다!

해당 프로젝트의 첫 기여인만큼 최대한 간단한 기여를 하였는데요!

당시 스크립트는 이미지 ID 하나당 `nerdctl rmi`를 N번 호출하는 형태였고, 조금 더 단순하게 만들고 싶다는 생각이 들었습니다.

그래서 방향을 이렇게 잡았습니다.

- images 목록을 묶은 뒤, rmi 한 번으로 모두 호출
- “이미 삭제된 이미지여도 에러 없이 넘어갈 수 있게” 재실행에 안전한 패턴 유지

이런 식으로 정리하면

- 스크립트 읽기가 훨씬 쉬워지고
- 여러 번 실행해도 부작용이 적으며
- 호출 횟수가 줄어들어 안정성이 개선된다는 기대가 있었습니다.

다만 이 아이템은 코드 기여 후 디스코드에서 비슷한 이슈를 이미 선점한 멘티 분이 있다는 것을 확인했고,  
중복 작업이 되지 않도록 자체적으로 기여를 Abandon(반려) 했습니다.

---

## 2. LLM ChatBot 구조 설계 및 공식 문서 게시

- 링크: <https://lf-o-ran-sc.atlassian.net/wiki/spaces/AIMLFEW/pages/546078733/AIMLFW+LLM+agent>

저희 멘티단의 목표 중 하나로 모델을 학습시켜주는 LLM Chatbot 제작이 있었고,
저희 과정에는 연구생 멘티 분들이 많았어서 멘토님이 실제 현업을 하고 있는 저에게 LLM Chatbot 구조 설계를 부탁하셨습니다!

- 개인 정리 문서: https://llm-backend.notion.site/LLM-BackEnd-BackUp-25977bf21c3e806d9477efa062d1f14c?source=copy_link

우선 Notion에 제일 최소한의 단위의 문서를 만들었고 Flow Diagram도 간단하게 만들어두었습니다.

이후 회의에서 구조에 대한 발표를 하였고,

<img width="1664" alt="image" src="https://velog.velcdn.com/images/alswp006/post/59d4343e-5e5c-4d21-92f9-66325e656b52/image.png">

회의를 통해 초안을 확정하였습니다.

- 초안 문서 : https://llm-backend.notion.site/?source=copy_link

### LLM 챗봇 구조 정리 후 공식 문서 게시

논의를 거치면서 구조가 어느 정도 합의되자, 이를 기반으로 공식 문서 공간인 Confluence에 정리했습니다.

- AI/ML Framework Confluence 문서:  
  <https://lf-o-ran-sc.atlassian.net/wiki/spaces/AIMLFEW/pages/546078733/AIMLFW+LLM+agent>

여기에는 공식문서에 필요한 최소한의 내용만 정리하여 적어두었습니다.

이후 메인 컨테이너에게 API 엔드포인트의 최상위 루트 네임을 변경하는 등의 피드백을 받아 수정하였습니다.

---

## 3. LLM 챗봇 최소 컨트롤러 엔드포인트 개발 및 기여

- 링크: <https://gerrit.o-ran-sc.org/r/c/aiml-fw/awmf/tm/+/14874>

이후 멘토, 멘티님들과의 논의를 통해 
위 내용을 바탕으로 먼저 프론트엔드 ↔ 백엔드 간 HTTP 연동을 확인할 수 있는 최소 단위 엔드포인트를 기여하였습니다.

그래서 우선 아래 두 개 엔드포인트를 추가했습니다.

- `GET /experiment/agent/modelInfo`
- `POST /experiment/agent/generate-content`

이 단계에서는

서비스/DB/LLM 연동은 전혀 하지 않고, 간단한 입력 값 검증 + Mock 응답만 반환하도록 구현했습니다.

이렇게 최소 컨트롤러부터 올려두어

- 프론트엔드/테스터 쪽에서 실제 HTTP 요청을 보내보며 테스트가 가능하도록 했고
- 후속 PR에서는 이 엔드포인트들을 기반으로 실제 서비스/DB/LLM 연동 로직만 채워 넣으면 되는 구조를 만들었습니다.

---

## 4. DB 구조 개선 및 테스트 코드 추가

- 링크: <https://gerrit.o-ran-sc.org/r/c/aiml-fw/awmf/modelmgmtservice/+/14808>

마지막으로 제가 가장 오래 붙잡고 있었던 작업은 Model 관련 정보와 TargetEnvironment를 어떻게 저장할 것인가에 대한 DB 구조 개선이었습니다.

이 작업은 이슈를 해결하는 느낌으로 기존에 있던 문제를 해결하였는데요.

이 기여는 생각할 부분이 많아 많은 피드백을 통해 점점 다듬어졌습니다.

자잘자잘하게 멘토님과 메인컨테이너와 의논한 내용들이 많았지만 크게 3번의 시도로 나누어 정리해보았습니다.

### 4-1. 1차 시도 – 별도 엔티티 + 기본 CRUD 테스트

표준 문서에서는 ModelInformation이 TargetEnvironment 리스트를 가진다고 정의하고 있습니다.
하지만 처음 코드를 봤을 때는 ModelInformation 쪽에 명시적인 ID/FK 구조가 없어서, 저는 이렇게 생각했습니다.

“그럼 내부에서는 ModelInformation과 연관 관계인 ModelRelatedInformation이 TargetEnvironment를 자식으로 가지는 구조로 설계하고, 외부 API에서는 그걸 풀어서 전달하면 되지 않을까?”

그래서 1차 시도에서는
ModelRelatedInformation ↔ TargetEnvironment 부모-자식 관계를 정의하고, 그 구조를 기준으로 아주 간단한 CRUD 테스트를 먼저 작성했습니다.

그리고 메인 컨테이너에게 두 가지 피드백을 받았습니다.
1. 스펙 상 TargetEnvironment[]는 ModelInformation 안에 있어야 하므로, API 관점에서는 이 위치를 지켜주는 것이 좋겠다는 의견.
2. 하나의 테스트 함수에 모든 케이스를 넣기보다, 서브테스트(subtest) 등으로 분리해서 유지보수성을 높이자는 의견.

그래서 “표준 필드는 ModelInformation에 맞추고,
내부 구조는 조금 더 고민해 보자”는 상태로 1차 시도를 정리했습니다.


### 4-2. 2차 시도 – ModelInformation에 리스트 노출 + API 우선 정리

2차 시도에서는 리뷰 내용을 반영해서 방향을 바꿨습니다.

외부 스펙은 최대한 그대로 맞추고, DB 마이그레이션은 단계적으로 가져가자.

코드의 변경 단위는 최소한으로 가져가고 우선 최소한의 기능으로 작동하는 코드를 넣어두고 점점 보완하는 것이 목표였습니다.

그래서 우선
- ModelInformation에 TargetEnvironment 리스트를 비영속(Non-persistent) 필드로 추가하고,
- DB 쿼리는 훅(Hook)이나 Raw SQL을 사용하여 겉으로 보이는 JSON 구조만 먼저 스펙에 맞춰 주는 방식으로 수정했습니다.
- 또한 테스트 코드를 세분화하는 작업도 함께 진행했습니다.

즉, 2차 시도에서는 API 스펙을 먼저 맞추고, DB 내부 구조는 완전하지 않아도 된다는 절충안이었습니다.

하지만 다시 메인컨테이너의 리뷰에서는 다음과 같은 추가 요구가 있었습니다.
- TargetEnvironment 자체에도 ID/FK를 명확히 추가해 1:N 관계를 정식으로 표현하자.
- 필드 이름과 구조를 표준 스펙과 완전히 일치하도록 맞추자.

이 피드백을 반영해서 3차 시도를 진행하게 됩니다.

⸻

### 4-3. 3차 시도 – 사이드 테이블 + ID/FK + 매핑 고도화

3차 시도에서는 메인컨테이너에게 DB에서는 외부에 노출되지 않는 ID와 FK를 추가해도 된다는 허락을 받았으니 아예 DB 구조와 매핑 전략을 다시 잡았습니다.

"API는 표준에 맞게 깔끔하게 노출하고, DB에서는 정규화된 1:N 구조를 제대로 정의하자."

핵심 변경점은 다음과 같습니다.
#### 1. TargetEnvironment 사이드 테이블 정식 도입
- target_environments 테이블에 id(uuid, PK), model_related_information_id(FK) 컬럼을 추가하고 1:N 관계를 명확하게 정리했습니다.
- GORM에서도 내부 관리용 필드인 ID, ModelRelatedInformationID에 json:"-" 옵션을 달아서 외부 응답에서는 노출되지 않도록 했습니다.
→ 표준에서 요구하는 필드만 API로 나가도록 보장.
#### 2. Raw SQL 의존 제거 + Schema/Mapping 고도화
- 2차 시도에서 임시로 사용하던 Raw SQL 대신, ORM 레벨에서 스키마/매핑을 정리해 일관성 있는 접근이 가능하게 했습니다.
- 이 과정에서 한 번 column model_related_information_id does not exist 같은 마이그레이션/스키마 관련 오류도 겪었고, 스키마 적용 순서와 테스트용 DB 초기화 과정을 다시 다듬어 해결했습니다.
	
#### 3. 최종 구조 요약
슬라이드 기준으로 정리하면 최종 구조는 이렇게 정리됩니다.
- API: TargetEnvironment에 기존과 같이 3개 필드만 노출
- DB: TargetEnvironment 테이블에 ID와 FK 추가하여 연관 관계 정의
- Read 경로: SkipHooks + 배치 방식 조회로 N+1 문제를 방지하고 성능 안정화
- Test: 전체 CRUD 흐름과 동시성(-race) 까지 확인

⸻

### 4-4. 테스트 코드 최종 점검

구조가 세 번 바뀐 만큼, 테스트도 고쳐 쓰기보다, 최종 구조 기준으로 다시 한 번 전부 점검했습니다.

테스트에서 확인한 것들은 대략 다음과 같습니다.
- 생성(Create): Model 정보와 TargetEnvironment가 함께 저장되는지
- 조회(Read): Preload/조인으로 올바르게 매핑되는지, N+1 없이 가져오는지
- 수정(Update): TargetEnvironment 리스트를 치환/부분 업데이트/비우는 경우 각각 안정적으로 동작하는지
- 삭제(Delete): 부모 삭제 시 자식 레코드 처리 방식 검증
- 동시성: go test -race로 데이터 경합 없이 안전하게 동작하는지

---

# 마무리 & 느낀 점

정리해보면, 이번 AIMLFW 기여는 다음과 같았습니다.

1. **환경 설정**  
윈도우 노트북 + WSL2 + Tailscale 조합으로 x86_64 환경을 원격 개발 서버처럼 쓰는 구조를 만들어보았고
2. **작은 개선 시도부터 시작**  
local image deletion 스크립트 단순화처럼 작지만 읽기 좋은 코드를 만드는 시도부터 시작하며 Gerrit에 대한 감을 익혔습니다.
3. **아키텍처 논의 + 최소 구현**  
LLM ChatBot 구조를 정리해서 문서화하고 최소 컨트롤러 엔드포인트로 기여해보았고
4. **DB 구조 리팩터링 + 테스트**  
DB 모델을 수정하고 테스트로 실제 데이터 모델을 안정적으로 다듬는 경험까지 해보았습니다.

사실 기능적으로 정말 대단한 일을 하거나 큰 업데이트를 하진 않았지만 많은 일들과 병행하며 진행한 프로그램이라 제 나름대로는 만족이 되었습니다.

글로 표현할 수 없는 많은 일들이 있었고 많은 경험을 얻었습니다.

멘토님과 메인컨테이너가 많은 도움을 주셨고, 멘티님들과 많이 소통하며 즐거운 시간을 가졌습니다!

앞으로도 꾸준히 제가 재미있어 할 만한 오픈소스 프로젝트를 찾고 기여를 해봐야겠습니다!
