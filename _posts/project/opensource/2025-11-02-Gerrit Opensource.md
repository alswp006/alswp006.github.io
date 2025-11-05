---
layout: post
title: Gerrit에서 코드 기여 해보기
subtitle: Gerrit에서 코드 기여 해보기
date: '2024-11-13 10:45:51 +0900'
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

# [OpenSource] Gerrit에서 코드 기여 해보기

저는 이전 OpenSource Contribution Academy 체험형을 하고나서 운이 좋게도 최근 OpenSource Contribution Academy 참가형 프로젝트에 참여할 수 있었습니다!

프로젝트는 ORAN Software Community AI/ML Framework였습니다!

해당 프로젝트는 Github가 아닌 Gerrit이라는 협업 툴을 사용하였고 Gerrit에 Merge가 되면 Github가 Mirrored되는 방식으로 Github에도 코드가 같이 올라갔습니다.

Gerrit에서 오픈소스 기여 활동을 하며 Github와는 방식이 많이 다른 것을 느꼈는데요!

Gerrit에서 코드를 커밋하고 수정하는 방법을 포스팅해보겠습니다.

## Gerrit은 github와 무엇이 다른가?

- 리뷰 중심: 변경(PR)이 아니라 Change 단위로 관리합니다.
- Patch Set: 같은 Change에 수정이 올라오면 패치셋이 쌓여 비교적 히스토리 깔끔하다는 느낌을 받았습니다.
- Change-Id: 커밋 메시지에 붙는 고유 ID로, 패치셋들을 하나의 변경으로 묶는 키입니다.

## git 설정하기

``` bash
sudo apt-get install git
sudo apt-get install git-review

git config --global user.email "eamil@gmail.com"
git config --global user.name "name"
```

이메일은 Gerrit 가입 이메일과 동일해야 합니다.

## SSH 키 설정하기

``` bash
# 1) SSH 키 생성(이미 있으면 생략)
ssh-keygen -t rsa -C "email@gmail.com"

# Generating public/private rsa key pair.
# Enter file in which to save the key (/.ssh/id_rsa):
# Enter passphrase (empty for no passphrase):
# Enter same passphrase again:
# Your identification has been saved in /tmp/testkey
# Your public key has been saved in /tmp/testkey.pub
# The key fingerprint is:
# ...
# +---[RSA 3072]----+
# |                 |
# ...
# |       ..=.+++=.+|
# |       .o. . **+=|
# +----[SHA256]-----+

# 2) 비밀키 등록
eval $(ssh-agent)
ssh-add /.ssh/id_rsa

# 3) 공개키 확인
cat ~/.ssh/id_rsa.pub

# 4) Gerrit 웹 → Settings → SSH Keys → Add... 에 위 공개키 붙여넣기

# 4) 접속 테스트 (호스트/포트는 인스턴스마다 다름, 예시는 ORAN)
ssh -p 29418 <Username>@gerrit.o-ran-sc.org
```

## 코드 가져오기

BROWSE - Repositories에서 원하는 Repository 선택

Clone with commit-msg hook으로 써져 있는 주소 복사
그냥 Clone을 하면 git commit 시 Commit-Id가 자동으로 생기지 않는다.
Gerrit의 많은 프로젝트는 Commit-Id가 없으면 push가 되지 않는다.

## 코드 기여하기

제가 현재 하고 있는 ORAN 프로젝트는 브랜치 관리를 따로 안하고 모두가 main 브랜치에 기여를 하는 방식이었습니다.

``` bash
# 1) 프로젝트 연결 확인
cd /Project/Repository
git review -s

# 2) 작업 파일 수정
git status
git add <수정한_파일들>

# 3) 서명 옵션 추가 : -s = Signed-off-by 추가 -> 여기서는 커밋 메시지 작성 X
git commit -s

# 4) 커밋 메시지 작성
git commit --amend

# 5) Commit Message, Author, Commit-Id, Change-Id 등 확인
git log

# 6) 코드 올리기
git review
```

Change-Id는 예를 들어, Change-Id: abc123 형식으로 메시지 맨 아래에 들어갑니다.

## 코드 수정하기

리뷰 코멘트가 달리면 같은 Change-Id를 유지한 채 메시지만/코드만 고쳐 패치셋을 올립니다.

``` bash
# 1) 수정한 파일 확인 및 추가
git status
git add <수정한_파일들>
git status

# 2) 기존 커밋 수정 (Change-Id는 건드리면 안됨)
git commit --amend

# 3) Change-Id 확인, Commit-Id는 달라지는 것이 맞음
git log

# 4) 코드 올리기
git review
```

## 한 번 더 확인하면 좋은 포인트

- Change-Id가 안 들어가요 → commit-msg hook으로 Clone 했는지 확인,  git review -s했는지 확인
- CI/권한 이슈 발생 -> 이메일 불일치 확인
- force-push를 하고 싶어요 → Gerrit은 --amend로 패치셋을 쌓는 모델이라, 보통 강제 푸시는 필요 없습니다. --amend로 진행하면 됩니다.

## Gerrit 코드 리뷰 점수

Gerrit에는 신기한 시스템이 있었습니다.

프로젝트마다 다르긴 한데 점수에 따라 코드가 승인되는 시스템이 있었는데요.

프로젝트마다 라벨 구성과 통과 기준이 다른데 보통 다음의 기준이 많이 쓰이는 것 같았습니다!!
- Code-Review: 리뷰어의 기술 검토. 보통 +2가 최종 승인에 필요.
- Verified: CI/봇이 테스트 통과 시 +1(또는 0/-1).
- Maintainer/Workflow/Owners-Approval: 메인테이너 승인 라벨이 따로 있는 경우가 많음.

최소 요구치는 Code-Review +2 그리고 Verified +1인 경우가 많은 것 같았구요.
추가 요구치는 Maintainer/Workflow +1 또는 Owners-Approval +1 이런 것도 있는 것 같았습니다!

보통 이런 식으로 나옵니다!

<img width="378" alt="image" src="https://velog.velcdn.com/images/alswp006/post/424d89e8-a9cc-46e0-b4fb-fccb4e0694d0/image.png" />

Change 화면 우측의 Labels 섹션에서 필수 라벨과 남은 조건을 확인할 수 있습니다!

## 정리

오늘은 Gerrit에서 오픈소스 기여하는 방법에 대해 포스팅하였는데요!!

다음에는 제가 기여한 내용에 대해 포스팅해보겠습니다.

감사합니다!!