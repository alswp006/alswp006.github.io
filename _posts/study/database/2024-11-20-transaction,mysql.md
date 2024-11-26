---
layout: post
title: Transaction, Transaction Isolation Level(feat.MySQL 테스트)
subtitle: Transaction, Transaction Isolation Level(feat.MySQL 테스트)
date: '2024-11-20 10:45:51 +0900'
categories:
    - study
    - database
    - project
    - tradeham
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---

# [MySQL] Transaction, Transaction Isolation Level

저는 동시성 문제를 직면하여 이를 해결하기 전 Transaction과 Lock에 대해서 정리를 하고 해결하려고 합니다!

그러면 우선 Transaction에 대해 학습해보겠습니다.

# Transaction

여러 작업을 **하나의 논리적 단위**로 수행하는 것입니다.

이에 대한 예시는 다음과 같습니다.

## 예시

1. 사용자 Milo가 만 원을 송금한다.
2. 사용자 Milo의 계좌에 만 원이 있는지 확인한다.
3. **사용자 Milo의 계좌에서 만 원을 차감한다.** (UPDATE 문으로 사용자 A의 잔고 변경)
4. **사용자 Jayden의 계좌에 만 원을 추가한다.** (UPDATE 문으로 사용자 B의 잔고 변경)

<img width="599" alt="image" src="https://github.com/user-attachments/assets/3ba1f701-da23-429b-8cd8-8a3a06c3f0b9">


## Transaction의 필요성
위 과정의 3번에서 시스템 에러가 나 Milo의 계좌에서는 돈이 나갔지만 Jayden의 계좌에는 돈이 안 들어오는 상황이 발생할 수 있고 이렇게 되면 사용자는 신뢰성을 갖지 못하게 됩니다.

이 과정에서 돈과 같은 데이터의 정확성과 안정성을 보장하기 위해 Transaction을 사용합니다.

-> 즉, Transaction을 통해 사용자가 데이터베이스에 대한 완전성을 신뢰할 수 있도록 합니다.

## COMMIT, ROLLBACK
Transaction의 끝에는 2가지의 동작이 있습니다.

- **Commit**: Transaction이 성공적으로 완료되어 변경 사항을 확정
- **Rollback**: Transaction이 비정상적으로 종료되어 변경 사항을 취소하고 이전 상태로 복구

위와 같이 3번 과정에서 오류가 났을 때 Rollback을 통해 트랜잭션 이전의 상태로 돌아갈 수 있습니다.

<img width="599" alt="image" src="https://github.com/user-attachments/assets/f87612d3-cca9-4230-b1b1-875fe0ac81ad">

---

## 데이터베이스 수행 내역 로그 저장
이러한 기능을 위해서는 로그가 필요합니다.

다음의 로그를 사용하여 데이터베이스에 내용을 반영하거나 되돌릴 수 있습니다.

- redo log: 데이터베이스에 반영된 내용을 재반영하기 위한 로그, 주로 DB 장애 발생 시 복구에 사용됩니다.
- undo log: 수행을 실패해 이전 상태로 되돌리기 위한 로그, 주로 Rollback이나 Transaction 격리 수준에서 문제를 해결하기 위해 사용됩니다.


## ACID 원칙
Transaction에는 ACID라는 중요한 원칙들이 있습니다.

1. **원자성 (Atomicity)**: ALL or NOTHING
2. **일관성 (Consistency)**: 데이터베이스는 일관된 상태 유지
3. **독립성 (Isolation)**: 동시 실행 Transaction들이 서로 영향을 주지 않음
4. **지속성 (Durability)**: 커밋된 Transaction의 결과는 영구적으로 유지


### 1. 원자성 (Atomicity)
ALL or NOTHING

<img width="381" alt="image" src="https://github.com/user-attachments/assets/55fa560d-c7da-46d9-99e2-ef7d9a43efee">

Transaction은 무조건 Commit되어 작업 내용이 다 반영되거나 Rollback되어 작업 내용이 다 반영되지 않거나 둘 중의 하나의 상태만 가집니다.


### 2. 일관성 (Consistency)

데이터베이스는 일관된 상태를 유지해야 합니다.
"잔고의 총합이 변경되어서는 안 된다."와 같은 일관된 상태를 유지해야 합니다.

<img width="362" alt="image" src="https://github.com/user-attachments/assets/36eb4321-089b-4b2e-9685-30117c47dcc9">

하지만 이렇게 이해하니 잘 이해가 되지않아 다음과 같은 예시로 이해해봤습니다!

primary key 제약 조건, 참조 키 제약조건, 무결성 제약조건을 지켜야 한다.
모든 계좌는 잔고가 0 이하면 안된다는 무결성 제약조건이 있다면 이를 위반하는 트랜잭션은 중단되어야 한다.

<img width="358" alt="image" src="https://github.com/user-attachments/assets/489aa357-b61f-45cb-b99c-2e5508cd4dce">

### 3. 독립성 (Isolation)
- 동시 실행 Transaction들이 서로 영향을 주지 않는다.
=> 트랜잭션이 독립적으로 실행되는 것처럼 보이게 만든다.

<img width="292" alt="image" src="https://github.com/user-attachments/assets/92ae156d-4a65-432d-a632-356113ea0f29">


### 4. 지속성 (Durability)
- 커밋된 Transaction의 결과는 영구적으로 유지되어야 한다.
- CPU에서는 작업이 완료되었지만 디스크에는 저장되지 않았을 때 장애가 발생해도 최종적으로는 디스크에 작업이 저장되어야 한다.

# Transaction Isolation Level
Transaction에서 일관성 없는 데이터를 어느 정도 허용할 것인지 결정하는 수준입니다.

Transaction Isolation Level의 필요성은 동시성과 무결성 사이의 균형을 찾기 위해 생긴다고 생각합니다.

그렇다면 Isolation 수준에서 발생하는 문제들을 간단하게 보고 바로 Transaction 격리 수준을 확인해보겠습니다.

## 낮은 Isolation 수준에서 발생하는 문제들

1. **Dirty Read**: 커밋되지 않은 데이터를 다른 Transaction이 읽어간다!
2. **Non-Repeatable Read**: 동일한 쿼리 실행 시 결과가 달라진다!
3. **Phantom Read**: 동일한 쿼리 실행 시 새로운 행이 추가된다!

## Transaction Isolation Level 종류

1. **Read Uncommitted (레벨 0)**
2. **Read Committed (레벨 1)**
3. **Repeatable Read (레벨 2)**
4. **Serializable (레벨 3)**

## Transaction Isolation Level

### 1. **Read Uncommitted (레벨 0)**
커밋되지 않은 데이터에도 접근할 수 있는 격리 수준입니다.

Dirty Read의 문제가 발생합니다.

<img width="602" alt="image" src="https://github.com/user-attachments/assets/0bbe963b-975b-4f10-af69-bd2d72ca220b">

왼쪽 사진과 같이 커밋되지 않은 데이터를 다른 Transaction이 읽어가 정확하지 않은 데이터가 반환됩니다.

만약 여기서 Transaction이 롤백된다면 읽어간 데이터는 없는 데이터가 되는 문제가 생깁니다.

이는 Read Committed를 통해 해결할 수 있습니다.

### 2. **Read Committed (레벨 1)**
커밋된 데이터에만 접근할 수 있는 격리 수준입니다.

위의 Dirty Read의 문제를 해결할 수 있습니다.

<img width="602" alt="image" src="https://github.com/user-attachments/assets/f88a12fd-35e5-4739-b881-f47cdfd0ea32">

왼쪽 사진과 같이 트랜잭션이 끝나지 않은 테이블의 데이터에 접근한다면 UNDO Log를 통해 데이터를 가져가고 이로써 커밋되지 않은 데이터에 접근을 하지 못하게 됩니다.

하지만 Non-Repeatable Read의 문제가 발생합니다.

하지만 오른쪽 사진과 같이 1번 트랜잭션이 있고 2번 트랜잭션이 있을 때 2번 트랜잭션 내에서 조회를 2번 하지만 1번 트랜잭션에 의해 데이터가 바뀌었기 때문에 2번의 조회에서 데이터의 정합성을 맞춰주지 못하게 됩니다.

이는 Repeatable Read를 통해 해결할 수 있습니다.

### 3. **Repeatable Read (레벨 2)**
동일한 행을 여러번 읽어도 항상 같은 결과를 보장하는 격리 수준입니다.

Non-Repeatable Read의 문제를 해결할 수 있습니다.

<img width="602" alt="image" src="https://github.com/user-attachments/assets/7f4853bd-b3af-4915-9303-3f0301458207">

이제 여기서부터 Transaction ID라는 개념을 알아야 합니다.

Transaction이 실행될 때 각 Transaction에 대한 ID가 생깁니다.

각각의 테이블 데이터는 CUD되면 해당 데이터가 수정된 Transaction ID를 갖게 됩니다.

이제 위 사진 왼쪽 흐름을 보겠습니다.

왼쪽 트랜잭션을 1번 트랜잭션이라 하고 오른쪽 트랜잭션을 2번 트랜잭션이라 하겠습니다.

2번 트랜잭션이 먼저 실행되어 해당 Transaction에 Transaction ID가 4로 부여됩니다.

이 때 데이터를 조회하면 nina가 반환됩니다.

그리고 1번 트랜잭션이 실행되어 해당 Transaction에 Transaction ID가 5로 부여되고 데이터를 바꾸면 해당 데이터에 Transaction ID가 5로 컬럼이 들어가게 됩니다.

다시 2번 트랜잭션이 조회를 하게 되면 자신의 Transaction ID보다 낮은 데이터만 읽기 때문에 UNDO Log로 가서 nina 데이터를 읽어오게 됩니다.

이와 같은 과정으로 Non-Repeatable Read 문제를 해결할 수 있습니다.

하지만 이는 Phantom Read라는 문제가 생깁니다.

이 격리 수준은 테이블에 대해 업데이트나 조회에 대해서는 엄격하게 관리하지만 Insert에 대해서는 제한이 없습니다.

그래서 2번 트랜잭션이 시작되고 처음 조회시 id가 1보다 큰 데이터를 가져올 때는 2개의 데이터를 가져옵니다.

하지만 1번 트랜잭션에서 새로운 행을 추가하고 다시 2번 트랜잭션이 Id가 1보다 큰 데이터를 가져올 때는 3개의 데이터를 가져오게 됩니다.

이러면 같은 트랜잭션 내에서 같은 쿼리문으로 조회를 하지만 다른 데이터를 가져오게 됩니다.

이를 막기 위해 마지막 격리 수준인 Serializable을 사용하게 됩니다.

### 4. **Serializable (레벨 3)**
한 트랜잭션에서 작업중인 레코드에 절대 접근할 수 없는 격리 수준입니다.

2번 트랜잭션이 시작되면 끝날 때까지 1번 트랜잭션은 커밋되지 못하고 대기하게 됩니다.

이로 인해 Phantom Read 문제가 발생하지 않게 됩니다.

<img width="602" alt="image" src="https://github.com/user-attachments/assets/1317ce57-045b-4029-a4d3-bc3beda23508">


## Transaction Isolation 수준 선택 시 고려사항

Transaction Isolation 수준 선택 시 동시성과 무결성에 대한 트레이드 오프가 생기는 것 같습니다.

시스템의 성능과 애플리케이션 요구사항에 맞게 속도와 데이터 일관성 사이에서 효율적인 선택을 잘 해야할 것 같습니다.

# 마무리

오늘은 Transaction, Transaction Isolation Level에 대해 알아봤습니다.

이제 다음 포스팅에서는 MySQL 락에 대해 테스트를 통해 알아보겠습니다.