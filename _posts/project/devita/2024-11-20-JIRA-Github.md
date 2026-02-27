---
layout: post
title: 팀 프로젝트를 위한 JIRA + GITHUB 가이드라인
subtitle: 팀 프로젝트를 위한 JIRA + GITHUB 가이드라인
date: '2024-11-20 10:45:51 +0900'
categories:
    - project
    - devita
tags: []
comments: true
published: true
list: true
order: 6
---

# [협업] 팀 프로젝트를 위한 JIRA + GITHUB 가이드라인

## Jira 이슈와 Github Branch, Commit 연동하기

### Jira - Github Branch 연동

![image](https://github.com/user-attachments/assets/2e7830a1-f1ac-4d38-aef6-93029f8b7fec)

원하는 이슈로 가서 "브랜치 만들기" 누르기

<img width="1919" alt="image" src="https://github.com/user-attachments/assets/cf2e8282-7c0c-4ea2-8e3b-1f38ae24e621">

- Repository: 자신의 작업 레포지토리
- Branch from: 작업 내용을 복사해올 브랜치
- Branch name: 브랜치 이름 (기본으로 DK-000-BE와 같이 되어있는데 BE는 지우고 브랜치 이름 컨벤션 맞추기)

<img width="1919" alt="image" src="https://github.com/user-attachments/assets/990c6329-83d1-4d19-85a0-a5827150878a">

이렇게 맞추고 "Create branch" 누르기

<img width="670" alt="image" src="https://github.com/user-attachments/assets/dff6d353-aa22-4ad6-a83f-82b8359492d5">

Github 브랜치 생성 확인

<img width="1072" alt="image" src="https://github.com/user-attachments/assets/3255663f-5170-459c-81ad-0d8d1c7ca519">

작업 환경으로 가서 git pull 후 checkout으로 브랜치 이동

``` shell
git pull origin
git checkout DK-000-branch-name
```

### Jira + Github Commit

<img width="1072" alt="image" src="https://github.com/user-attachments/assets/13d2940d-bc4a-4ab2-b852-518a6ac16ede">

작업 후 add, commit, push 순서대로 진행

commit 시 자신이 원하는 작업에 대한 이슈 번호를 맨 앞에 추가

``` shell
git add 작업 파일
git commit -m "DK-000 커밋 컨벤션"
git push origin
```

<img width="1911" alt="image" src="https://github.com/user-attachments/assets/9e8c6c10-4217-4c78-94ee-8d0977b94e78">

jira의 본인 브랜치 이슈로 이동해서 커밋 추가 확인

<img width="965" alt="image" src="https://github.com/user-attachments/assets/5b1b3e86-6045-41d4-93b2-1cf61d8d2e2f">

클릭해보면 다음과 같이 커밋 이력이 발생

### Jira + Github Pull Request

<img width="1920" alt="image" src="https://github.com/user-attachments/assets/8d887afa-11c6-4c00-881e-d618e5861f2d">

Github Pull Reqeusts로 접속 후 작업 브랜치 pr 들어가기

제목은 이슈 번호 + 작업 요약이나 이슈 제목

pr 내용 작성 후 Create Pull Request

<img width="1913" alt="image" src="https://github.com/user-attachments/assets/b2d0d6e3-05da-4a1a-9bb9-19a199a9f7e2">

Jira에서 이슈로 들어가면 PR 확인 가능

<img width="1913" alt="image" src="https://github.com/user-attachments/assets/4e7e02a2-1745-414d-b017-febd19cfc3bd">

PR의 상태나 업데이트 시간, 작성자와 검토자 확인 가능 확인