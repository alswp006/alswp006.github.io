---
layout: post
title: MySQL 8.0의 Shared Lock, Exclusive Lock
subtitle: MySQL 8.0의 Shared Lock, Exclusive Lock
date: '2024-11-21 10:45:51 +0900'
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

# [MySQL] MySQL 8.0의 Shared Lock, Exclusive Lock 및 Test(feat.데드락, 잠금없는 읽기)

안녕하세요! 저번에는 트랜잭션에 대해서 알아봤고 이번에는 MySQL 8.0에서의 공유 락, 배타 락을 알아보도록 하겠습니다.

DBMS에서는 특정 데이터에 대한 동시 접근에서 데이터 일관성과 무결성을 지키기 위해 Lock을 걸어서 사용합니다.

이 때 잠금을 구현하는 방식이 크게 공유 락과 배타 락으로 나뉘어집니다.

## 공유 락 (Shared Lock)
공유 락(Shared Lock)은 읽기 락(Read Lock)이라고도 불립니다.

공유 락이 걸린 데이터에 대해서는 읽기 연산(SELECT)만 실행 가능하며, 쓰기 연산은 실행이 불가능합니다. 

공유 락이 걸린 데이터에 대해서 다른 트랜잭션도 똑같이 공유 락을 획득할 수 있으나, 배타 락은 획득할 수 없습니다. 

공유 락을 사용하면, 조회한 데이터가 트랜잭션 내내 변경되지 않음을 보장할 수 있습니다.

## 배타 락 (Exclusive Lock)
배타 락은 쓰기 락(Write Lock)이라고도 불립니다.

다른 트랜잭션은 배타 락이 걸린 데이터에 대해 읽기 작업도, 쓰기 작업도 수행할 수 없습니다. 

즉, 배타 락이 걸려있다면 다른 트랜잭션은 공유 락, 배타 락 둘 다 획득 할 수 없습니다. 

배타 락을 획득한 트랜잭션은 해당 데이터에 대한 독점권을 갖는 것입니다.

그러면 이들을 테스트를 통해 알아보겠습니다.

# 공유 락, 배타 락 테스트

테스트는 제가 프로젝트에서 더 이상 쓰지 않는 DB의 테이블을 사용하고 이에 대한 화면을 2개 띄워서 각각 접속하여 진행하겠습니다.

<img width="977" alt="image" src="https://github.com/user-attachments/assets/bbd9326d-cad6-4055-bf4a-c1018b8c7da9">

## 공유 락
공유 락은 다음과 같이 FOR SHARE를 통해 해당 데이터의 락을 획득할 수 있습니다.
``` sql
SELECT * FROM table_name WHERE id = 1 FOR SHARE;
```

우선 왼쪽에서 1번 데이터에 대한 공유 락을 획득해보겠습니다.

``` sql
start transaction;

select *
from locker
where locker_id = 1
for share;
```

<img width="489" alt="image" src="https://github.com/user-attachments/assets/e459ea7d-fa5e-4d2c-8716-ab9193054cb6">

### 읽기, 쓰기 Test

이제 오른쪽 터미널에서 각각 읽기와 쓰기 작업을 해보겠습니다.

``` sql
start transaction;

select *
from locker
where locker_id = 1;

update locker
set locker_password = 1000
where locker_id = 1;
```

<img width="479" alt="image" src="https://github.com/user-attachments/assets/1aa5b3f0-68cc-45f3-9500-89121ca846c0">

위 결과처럼 읽기는 되지만 쓰기는 어느 정도 시간을 기다렸다가 time out이 나는 것을 확인해볼 수 있습니다.

### 2개의 행에 공유 락을 걸고 서로의 행을 업데이트(데드락 테스트)
왼쪽 터미널은 id = 1의 행에 대해 공유 락을 얻고 오른쪽 터미널은 id = 2의 행에 대해 공유락을 얻어서 서로의 데이터에 업데이트 요청을 해보도록 하겠습니다.

- 1번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1
for share;
```

- 2번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 2
for share;
```

#### 상대방 row 업데이트
- 1번 터미널
``` sql
update locker
set locker_password = 9999
where locker_id = 2;
```

- 2번 터미널
``` sql
update locker
set locker_password = 9999
where locker_id = 1;
```

<img width="974" alt="image" src="https://github.com/user-attachments/assets/69c897bd-4256-43d9-8430-b901666f4e2f">

1번 터미널은 2번의 트랜잭션이 끝나기를 기다리고 2번의 터미널은 1번의 트랜잭션이 끝나기를 기다려서 데드락이 발생하게 됩니다.

오른쪽의 터미널이 데드락을 감지하여 롤백시키며 왼쪽이 락을 획득하는 것을 볼 수 있습니다.

여기서 저희는 MySQL이 데드락을 자동으로 감지한다는 것도 확인할 수 있었습니다.

이에 대해서는 추후 더 학습해보겠습니다.

### 1개의 행에 2개의 공유락을 걸고 업데이트

이번에는 1개의 행에 대해서 2개의 공유락을 걸고 해당 행을 업데이트 해보겠습니다.

- 1번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1
for share;
```

- 2번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1
for share;
```

#### row 업데이트
- 1번 터미널
``` sql
update locker
set locker_password = 9999
where locker_id = 1;
```

- 2번 터미널
``` sql
update locker
set locker_password = 9999
where locker_id = 1;
```

<img width="974" alt="image" src="https://github.com/user-attachments/assets/c8ba47e9-4758-4009-a111-364ff848d0ab">

이 또한 1번 터미널, 2번 터미널 모두 서로가 1번 행에 걸어놓은 트랜잭션이 끝나기를 기다리고 있으므로 데드락 상태가 되어 MySQL이 자동 감지를 하고 2번 터미널을 롤백 시킨 뒤 1번 터미널을 진행시키는 것을 확인할 수 있습니다.

## 배타 락
배타 락은 다음과 같이 FOR UPDATE를 통해 해당 데이터의 락을 획득할 수 있습니다.
``` sql
SELECT * FROM table_name WHERE id = 1 FOR UPDATE;
```

우선 왼쪽에서 1번 데이터에 대한 배타 락을 획득해보겠습니다.

``` sql
start transaction;

select *
from locker
where locker_id = 1
for update;
```

<img width="489" alt="image" src="https://github.com/user-attachments/assets/60d82b80-f990-4601-b282-9deabdd98fed">

### 읽기, 쓰기 Test (잠금없는 읽기)

이제 오른쪽 터미널에서 각각 읽기와 쓰기 작업을 해보겠습니다.

``` sql
start transaction;

select *
from locker
where locker_id = 1;

update locker
set locker_password = 1000
where locker_id = 1;
```

<img width="981" alt="image" src="https://github.com/user-attachments/assets/56a7f562-316d-4966-9a59-c7250e383645">

해당 락은 배타 락이기 때문에 읽기 또한 되지 않아야 하지만 위 결과에서 읽기 작업은 허용되는 것을 확인할 수 있었습니다.

이에 대해서 학습을 진행해보니 MySQL의 InnoDB 스토리지 엔진에서 기본 SELECT 쿼리는 잠금 없는 읽기가 지원되기 때문이라고 합니다.

이는 Lock이 걸린 상태라도 단순 조회를 할 수 있게 해주는 기능이고 이에 대해서는 아래에서 더 자세히 알아보겠습니다.

### 읽기, 쓰기 Test (잠금있는 읽기)
- 1번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1
for update;
```

- 2번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1;
for update;
```

<img width="981" alt="image" src="https://github.com/user-attachments/assets/0126ab7c-76c8-41c8-a3bd-a6aa4b515070">

2번 터미널에서 읽기에 대한 잠금도 걸려 대기하다가 timeout이 나는 것을 확인해볼 수 있었습니다!

### 2개의 행에 배타 락을 걸고 서로의 행을 조회(데드락 테스트)
왼쪽 터미널은 id = 1의 행에 대해 배타 락을 얻고 오른쪽 터미널은 id = 2의 행에 대해 배타 락을 얻어서 서로의 데이터에 업데이트 요청을 해보도록 하겠습니다.

- 1번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 1
for update;
```

- 2번 터미널
``` sql
start transaction;

select *
from locker
where locker_id = 2
for update;
```

#### 상대방 row 조회
- 1번 터미널
``` sql
select *
from locker
where locker_id = 2
for update;
```

- 2번 터미널
``` sql
select *
from locker
where locker_id = 1
for update;
```

<img width="981" alt="image" src="https://github.com/user-attachments/assets/d0fff7fb-4897-43c4-a507-18ed6dad4933">

1번 터미널은 2번의 트랜잭션이 끝나기를 기다리고 2번의 터미널은 1번의 트랜잭션이 끝나기를 기다려서 데드락이 발생하게 됩니다.

오른쪽의 터미널이 데드락을 감지하여 트랜잭션을 롤백시키며 왼쪽이 락을 획득하는 것을 볼 수 있습니다.

# 잠금없는 읽기

위에서 행에 대한 배타 락을 걸었을 때 읽기 작업은 되지 않아야 하지만 락이 없는 조회는 되었던 것을 확인할 수 있었습니다. 

이는 MySQL InnoDB 엔진을 사용하는 테이블에선 FOR UPDATE 또는 FOR SHARE 절을 가지지 않는 SELECT 쿼리는 잠금(Lock) 없는 읽기가 지원되기 때문입니다.

락을 굳이 획득할 필요가 없는 로직은 대기 상태에 빠질 필요가 없기 때문에 해당 데이터를 대기 없이 바로 조회할 수 있게 됩니다.

하지만 MySQL을 SERIALIZABLE 격리 수준으로 사용하게 된다면 모든 트랜잭션에 대해 락이 걸리기 때문에 일반 쿼리에 대해서도 읽기 잠금이 될 것 같습니다.

# 정리

오늘은 공유 락, 배타 락에 대해 정리하고 MySQL 8.0 환경에서 여러 상황에 대한 테스트를 진행해보았습니다.

JPA에서의 공유 락, 배타 락도 테스트해보고 싶고 MySQL에서의 기본 격리 수준 또한 다뤄보고 싶습니다.

차차 진행해보도록 하겠습니다!