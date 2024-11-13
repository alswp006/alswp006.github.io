---
layout: post
title: Spring Security 오픈 소스 기여해보기
subtitle: Spring Security 오픈 소스 기여해보기
date: '2024-11-13 10:45:51 +0900'
categories:
    - project
    - opensource
    - study
    - spring
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---

# [Spring Security] OidcLogout Issue 기여하기

저는 오픈소스 컨트리뷰션 아카데미에서 자신감을 얻고 Spring Security에 대해 기여를 해보려 합니다!

저는 이전 전자정부 표준 프레임워크에 기여했던 경험이 있지만 이는 docs에 대한 기여라서 그렇게 코드를 읽고 본격적인 기여는 아니었습니다.

하지만 본격적인 기여는 처음이니 열심히 진행해보고 이를 기반으로 제 개발 생활에 스며들도록 해보려 합니다!

저는 다음의 포스팅을 참고하여 이슈 선정을 하였습니다!

[https://medium.com/opensource-contributors/오픈소스-멘토링-기여-가이드-오픈소스-멘토링에서-10명-넘는-오픈소스-컨트리뷰터가-첫-기여를-성공할-수-있었던-방법-3ff09c9b6f83](https://medium.com/opensource-contributors/%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4-%EB%A9%98%ED%86%A0%EB%A7%81-%EA%B8%B0%EC%97%AC-%EA%B0%80%EC%9D%B4%EB%93%9C-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4-%EB%A9%98%ED%86%A0%EB%A7%81%EC%97%90%EC%84%9C-10%EB%AA%85-%EB%84%98%EB%8A%94-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4-%EC%BB%A8%ED%8A%B8%EB%A6%AC%EB%B7%B0%ED%84%B0%EA%B0%80-%EC%B2%AB-%EA%B8%B0%EC%97%AC%EB%A5%BC-%EC%84%B1%EA%B3%B5%ED%95%A0-%EC%88%98-%EC%9E%88%EC%97%88%EB%8D%98-%EB%B0%A9%EB%B2%95-3ff09c9b6f83)

이렇게 하여 선택된 것은 Spring Security의 #15817 이슈입니다!

[해당 이슈의 링크입니다!](https://github.com/spring-projects/spring-security/issues/15817)

이제 해당 이슈에 대한 기여를 시작해보겠습니다!

# 이슈 파악하기

제가 이 이슈를 선택한 것은 Spring Security를 자주 사용하고 해당 기술에 더 익숙해지기 위함도 있습니다.

해당 이슈는 다음과 같은 내용을 가지고 있습니다.

> To active OIDC Back-Channel Logout support in the DSL, an application does this:
> 
> 
> ```
> http
>     .oidcLogout((oidc) -> oidc.backChannel(Customizer.withDefaults())
>     )
> ```
> 
> This could be simplified to:
> 
> ```
> http
>    .oidcBackChannelLogout(Customizer.withDefaults())
> ```
> 
> This would be place the logout DSL at the same level as other logout DSLs:
> 
> ```
> http
>     .logout((logout) -> logout ...)
>     .saml2Logout((saml2) -> saml2 ...
>     .oidcBackChannelLogout((oidc) -> oidc ...)
> ```
> 
> Also, it's less nesting which often makes the DSL more navigable.
> 
> This would mean deprecating the existing `backChannel` DSL method with the intent to remove in the next major version.
> 

우선 해당 이슈를 해결하기 위해 기반 지식들을 학습하였습니다.

학습 내용은 해당 링크에 작성되어 있습니다! 이에 대해 읽고 오시면 이해가 빠르실 것 같습니다!

- 링크

해당 이슈를 살펴보면 다음과 같습니다.

### 이슈 설명

- Spring Security는 OIDC 백채널 로그아웃을 지원하여 애플리케이션이 인증 서버로부터 로그아웃 요청을 받아 세션을 종료할 수 있도록 합니다.
- 현재는 oidcLogout 메소드 안에 backChannel 메소드를 호출하여 다음과 같이 백채널 로그아웃을 구성합니다.

```java
http
    .oidcLogout((oidc) -> oidc.backChannel(Customizer.withDefaults())
    )
```

하지만 이는 DSL 구문이 중첩되어 있어 사용자가 설정하기 헷갈릴 수 있고 다른 로그아웃 DSL과 비교하여 일관성이 부족하다는 문제가 있습니다.

### 이슈 목적

해당 이슈의 목적은 위의 문제를 해결하기 위해 DSL을 단순화하여 다음과 같이 oidcBackChannelLogout 메소드를 직접 호출할 수 있도록 합니다.

```java
http
   .oidcBackChannelLogout(Customizer.withDefaults());
```

이와 같이 단순화한다면 oidcBackChannelLogout을 다른 로그아웃 DSL과 동일한 수준에 배치할 수 있습니다.

```java
http
    .logout((logout) -> logout ...)
    .saml2Logout((saml2) -> saml2 ...)
    .oidcBackChannelLogout((oidc) -> oidc ...);
```

### 이슈 할당받기

저는 이슈를 해결하기에 앞서 제가 해당 이슈를 먼저 해결하기 전 다른 사람이 이슈를 해결하거나 이슈가 닫힐 수도 있어서 다음과 같이 해당 이슈를 해결해도 되는지 물어본 후 해당 이슈를 할당받았습니다.

<img width="1009" alt="image" src="https://github.com/user-attachments/assets/f3905916-a8b4-4f85-bfea-4293e5935563">


10월 1일에 코멘트를 달았는데 11월 초에 답글을 달아주었습니다.

오픈 소스 컨트리뷰션 아카데미에서 이런거 일 처리가 굉장히 느긋하게 되니까 천천히 마음먹고 하라는 얘기를 들었는데 이정도일 줄은 몰랐습니다..

그러면 이에 대한 구현을 해보겠습니다.

# 기여 시작

## 브랜치 생성하기

저는 단순히 Github Repository를 fork하여 제 Main Branch에서 작업하려 했습니다.

하지만 다른 사람들이 올린 PR을 살펴봤을 때 다음과 같이 작업한 것을 확인할 수 있습니다.

<img width="1658" alt="image" src="https://github.com/user-attachments/assets/0737b72c-ee1d-4ee5-98c0-119f11421bb8">


<img width="1658" alt="image" src="https://github.com/user-attachments/assets/dd7d3a58-8cb1-43cd-98d1-cb889cb71e68">


```java
github 이름:gh-이슈번호
```

다음과 같이 진행되는 관습을 따라 저도 브랜치를 생성하여 진행하려 합니다.

곁눈질로 배운거지만 어떤 이슈 번호에 대한 브랜치인지 파악할 수 있어서 좋은 것 같습니다!

## 코드 구성 확인하기

스프링 시큐리티의 폴더 구조는 굉장히 복잡합니다..

<img width="644" alt="image" src="https://github.com/user-attachments/assets/fd8f10d1-bb00-474f-8581-325d5fbab63e">


이에 대한 모든 구조를 파악하기는 힘들 것 같아 해당 oidcBackChannelLogout을 다른 로그아웃과 동일한 DSL 수준에 두는 것이 목표이니 다른 로그아웃의 디렉토리를 확인해주었습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/2a3b0175-4ba8-459c-b4a3-59f0e885bc19">


제가 사용하는 Security Config에서 logout으로 들어가보면 다음과 같습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/4d9476fc-429d-4637-9c3e-2c28a09f8df4">


가장 위로 올라가서 패키지 구조를 보면 다음과 같이 되어 있습니다.

```java
package org.springframework.security.config.annotation.web.builders;
```

해당 디렉토리의 HttpSecurity 클래스에 존재하는 것을 확인할 수 있습니다.

Spring Security로 들어가 해당 폴더를 확인해보겠습니다.

<img width="1007" alt="image" src="https://github.com/user-attachments/assets/fdc8acdd-75b5-442e-b879-780e4b713c5f">


해당 HttpSecurity 내에 기존 코드인 oidcLogout이 있는 것을 확인할 수 있습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/dcef3e5a-4e4a-4108-b403-5f8948bafb1a">


저의 목표는 이와 같은 레벨에 oidcBackChannelLogout 메서드를 만들고 메서드 체이닝으로 사용 가능하도록 만들어야 할 것 같습니다.

그렇다면 기존 코드를 분석해보도록 하겠습니다.

## 기존 코드 분석

기존 코드는 다음과 같습니다.

```java
http
    .oidcLogout((oidc) -> oidc.backChannel(Customizer.withDefaults())
    )
```

### HttpSecurity

우선 SecurityConfig의 filterChain에서 자주 쓰는 http는 저희가 위에서 봤던 HttpSecurity의 객체입니다.

<img width="1203" alt="image" src="https://github.com/user-attachments/assets/197ef03a-e9ef-4770-87b4-0232ce0c1053">


그렇다면 HttpSecurity에 대해서 알아보겠습니다.

[Spring Docs의 HttpSecurity의 공식 문서](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/builders/HttpSecurity.html)에서는 HttpSecurity를 다음과 같이 설명하고 있습니다.

> A [`HttpSecurity`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/builders/HttpSecurity.html) is similar to Spring Security's XML <http> element in the namespace configuration. It allows configuring web based security for specific http requests. By default it will be applied to all requests, but can be restricted using `#requestMatcher(RequestMatcher)` or other similar methods.
> 

공식 문서에 대한 내용을 정리해보면 다음과 같습니다.

- HttpSecurity 클래스는 특정 HTTP 요청에 대해 웹 보안을 구성할 수 있는 기능을 제공한다.
- HttpSecurity 클래스는 Spring Security에서 XML 설정의 <http> 요소와 유사한 역할을 한다.

HttpSecurity 클래스는 보통 다음과 같이 사용됩니다.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests()
        .requestMatchers("/**")
        .hasRole("USER") 
        .and()
        .formLogin();
    return http.build();
}
```

저는 이 구조를 처음 봤을 때 굉장히 신기했었습니다.

Method Chaining 방식과 Builder 패턴이 혼합되어 사용되고 있었기 때문입니다.

저희가 흔히 사용하는 Builder 객체를 따로 두고 그 Builder 객체를 통해 최종 객체를 생성하는 것과는 달리 메서드 체이닝 방식을 통해 필드 값을 설정하고 build() 메서드를 통해 최종 객체를 생성합니다.

그래서 저는 이 build() 메서드가 어떻게 설정되어 있는지 궁금해서 코드 안쪽으로 들어가보았습니다.

### HttpSecurity의 build() 메서드

우선 위에서 securityFilterChain이 `http.build();`를 통해 반환하는 객체를 보면 SecurityFilterChain 타입을 가지고 있습니다.

또한 이를 찾기 위해 HttpSecurity에서 build() 메서드를 찾아봤는데 해당 메서드가 없어서 HttpSecurity의 부모 클래스인 AbstractConfiguredSecurityBuilder 클래스를 보았습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/bfe93d21-ac07-48df-947a-4498b61a5f41">


그런데 또 AbstractConfiguredSecurityBuilder 클래스에도 build 메서드가 존재하지 않아 이의 부모 클래스인 AbstractSecurityBuilder를 찾아보았습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/bea39c61-2501-48ba-9bfb-82d884cef63c">


그리하여 결국 AbstractSecurityBuilder 클래스에서 build() 메서드를 찾을 수 있었습니다.

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/b28c72db-edcf-4d3b-8712-24319d7068cc">


우선 AbstractSecurityBuilder 클래스는 SecurityBuilder 인터페이스를 구현한 **추상 클래스**로, 객체를 빌드하는 로직을 제공하고 일부 구현을 하위 클래스에 위임하고 있습니다.

object 변수는 **빌드된 최종 객체를 저장**하는 필드이고 build 메서드에서 최종 객체를 할당하고 반환하는 데에 사용하고 있습니다.

또한 build() 메서드는 final 키워드를 통해 **하위 클래스에서 오버라이드하지 못하도록** 하고 있습니다.

if 문을 통해 이전에 빌드가 시작되지 않은 경우에만 빌드를 시작할 수 있도록 하고 이 조건이 충족되면 빌드가 시작됩니다.

빌드가 시작되면 doBuild() 메서드를 호출하여 실제 빌드 작업을 수행하고 결과를 object에 저장하고 반환됩니다.
여기서 주목해야 할 것은 doBuild() 메서드입니다.

### doBuild()

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/6100f479-0641-4580-963c-c0b5b8d826fd">


doBuilder는 protected를 통해 같은 패키지나 하위 클래스에서만 접근할 수 있도록 하였고 abstract를 통해 하위 클래스에서 반드시 이 메서드를 구현하도록 하였습니다.

결국 build() 메서드에서 doBuild()를 호출하여 객체를 생성하고 **빌드 과정에서 수행할 특정한 작업은 doBuilder 메서드에서 정의한다는 것을 알 수 있습니다.**

그러면 AbstractSecurityBuilder의 하위 클래스였던 AbstractConfiguredSecurityBuilder에서 doBuild() 메서드를 찾아보겠습니다.

[doBuild를 소개하는 공식 문서 링크입니다.](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/AbstractConfiguredSecurityBuilder.html#doBuild())

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/9bcf7893-c7ec-433e-94b8-349257d1738c">


AbstractConfiguredSecurityBuilder에서 doBuild() 코드는 다음과 같이 구성되어 있습니다.

```java
@Override
protected final O doBuild() throws Exception {
	synchronized (this.configurers) {
		this.buildState = BuildState.INITIALIZING;
		beforeInit();
		init();
		this.buildState = BuildState.CONFIGURING;
		beforeConfigure();
		configure();
		this.buildState = BuildState.BUILDING;
		O result = performBuild();
		this.buildState = BuildState.BUILT;
		return result;
	}
}
```

doBuild() 메서드는 **보안 설정을 빌드하기 위한 여러 단계의 작업을 순차적으로 수행하는 메서드입니다.**

우선 이 메서드를 더 잘 이해하기 위해 BuildState를 알아보겠습니다.

### BuildState

BuildState는 애플리케이션의 빌드 상태를 나타내기 위한 enum입니다.

BuildState는 다음과 같이 구성되어 있습니다.

```java
private enum BuildState {
	UNBUILT(0),
	INITIALIZING(1),
	CONFIGURING(2),
	BUILDING(3),
	BUILT(4);

	private final int order;

	BuildState(int order) {
		this.order = order;
	}

	public boolean isInitializing() {
		return INITIALIZING.order == this.order;
	}
	
	public boolean isConfigured() {
		return this.order >= CONFIGURING.order;
	}

}
```

가독성을 위해 주석은 제거하였고 각 상태에 대한 설명은 다음과 같습니다.

1. UNBUILT **(0)**

빌드가 시작되기 전의 초기 상태입니다. Builder의 build() 메서드가 호출되기 전의 상태입니다.

1. INITIALIZING **(1)**

빌드가 시작된 후 SecurityConfigurer**의** init() **메서드들이 호출되는 동안의 상태**입니다.

이 상태에서는 SecurityConfigurer를 초기화하여 빌드에 필요한 준비 작업을 수행합니다.

1. CONFIGURING **(2)**

SecurityConfigurer의 모든 init() 메서드가 완료된 후, configure() **메서드들이 호출되는 동안의 상태**입니다.

빌드 구성을 설정하는 단계로, 보안 설정이 이 상태에서 적용됩니다.

1. BUILDING **(3)**

SecurityConfigurer의 모든 configure() 메서드가 완료된 후부터, performBuild() **메서드를 통해 실제 객체가 빌드되기 전까지의 상태**입니다.

빌드가 진행되는 상태로, 필요한 설정이 완료되었고 최종 객체 생성 단계로 진입하는 시점입니다.

1. BUILT **(4)**

**객체가 완전히 빌드된 상태**를 나타냅니다.

performBuild() 메서드 호출이 완료되고, 최종 객체가 반환된 후의 상태입니다.

---

이렇게 빌드의 단계를 명확히 구분하여 상태를 관리하면 현재 빌드 단계를 알고 빌드 프로세스를 제어할 수 있을 것 같습니다.

또한 에러 방지에도 중요한 역할을 할 수 있을 것 같습니다!

그러면 다시 AbstractConfiguredSecurityBuilder에서 doBuild()로 돌아가 코드를 살펴보겠습니다.

### 다시 doBuild()

```java
@Override
protected final O doBuild() throws Exception {
	synchronized (this.configurers) {
		this.buildState = BuildState.INITIALIZING;
		beforeInit();
		init();
		this.buildState = BuildState.CONFIGURING;
		beforeConfigure();
		configure();
		this.buildState = BuildState.BUILDING;
		O result = performBuild();
		this.buildState = BuildState.BUILT;
		return result;
	}
}
```

우선 doBuild() 메서드가 실행되면 synchronized 블록을 사용하여 **다중 스레드 환경에서 동시 접근을 제어하고 코드를 수행합니다.**

첫 번째로 BuildState를 INITIALIZING로 설정하고 beforeInit() 메서드와 init() 메서드를 실행합니다.

beforeInit()과 Init() 메서드는 다음과 같습니다.

<img width="1595" alt="image" src="https://github.com/user-attachments/assets/5b887bae-ac17-44a4-b6fb-0f2cfcf5079e">


<img width="1595" alt="image" src="https://github.com/user-attachments/assets/5b5a818d-4e0b-4a76-9253-f009c9beb715">


우선 beforeInit() 메서드는 init() 메서드가 실행되기 전 하위 클래스가 오버라이드하여 추가적인 초기화 작업을 수행할 수 있도록 해주는 메서드인 것 같습니다.

그렇다면 init을 살펴보겠습니다.

### init()

init() 메서드는 처음에 getConfigurers()를 통해 SecurityConfigurer 객체들의 **컬렉션을 가져오고 있습니다.**

getConfigurers() 메서드는 다음과 같습니다.

<img width="1595" alt="image" src="https://github.com/user-attachments/assets/ee6349d2-1fd9-4d1a-a6a6-c5e804de8c0f">


getConfigurers()는 우선 SecurityConfigurer에 대한 리스트를 만듭니다.

이후 configurers.values()를 차례차례 가져오며 result에 저장하고 이를 반환합니다.

### configurers

configurers는 다음과 같습니다.

```java
private final LinkedHashMap<Class<? extends SecurityConfigurer<O, B>>, List<SecurityConfigurer<O, B>>> configurers = new LinkedHashMap<>();
```

configurers는 LinkedHashMap이며 Key로 Class<? extends SecurityConfigurer<O, B>>를 가지고 Value로 List<SecurityConfigurer<O, B>>를 가집니다.

Class<? extends SecurityConfigurer<O, B>>는 SecurityConfigurer의 클래스 타입을 나타내는 Class 객체인 것 같은데 구조가 조금 어렵습니다.

하나씩 뜯어보겠습니다.

- Class<T>

이는 제네릭 타입의 Class 객체를 나타내는 것입니다!

- SecurityConfigurer<O, B>

제네릭 타입을 가지는 SecurityConfigurer 클래스 또는 인터페이스를 의미하는 것 같습니다. 제네릭 타입을 통해 이 클래스에서 사용할 매개변수를 나타내고 있습니다.

- ? extends SecurityConfigurer<O, B>

**이는 와일드카드(**?**)를 사용해** SecurityConfigurer**의 하위 타입을 받는다는 의미를 가지고 있습니다.**

---

이를 종합해보면 제네릭 타입을 가지는 SecurityConfigurer 자체나 하위 클래스들의 Class 객체를 나타낸다!로 정리해볼 수 있을 것 같습니다.

그렇다면 이 configurers의 Key는 위와 같은 의미를 가지고 Value는 SecurityConfigurer의 List를 가지는 구조인 것 같습니다.

다시 init()으로 돌아가보겠습니다.

### getConfigurers()

```java
private Collection<SecurityConfigurer<O, B>> getConfigurers() {
	List<SecurityConfigurer<O, B>> result = new ArrayList<>();
	for (List<SecurityConfigurer<O, B>> configs : this.configurers.values()) {
		result.addAll(configs);
	}
	return result;
}
```

이제 getConfigurers()의 의미를 이해할 수 있을 것 같습니다.

configurers에서 모든 SecurityConfigurer 객체들을 모아서 List에 저장하고 반환한다!

그렇다면 다시 Init() 메서드로 가보겠습니다.

### 다시 init()

```java
private void init() throws Exception {
	Collection<SecurityConfigurer<O, B>> configurers = getConfigurers();
	for (SecurityConfigurer<O, B> configurer : configurers) {
		configurer.init((B) this);
	}
	for (SecurityConfigurer<O, B> configurer : this.configurersAddedInInitializing) {
		configurer.init((B) this);
	}
}
```

이제 조금 이해가 되는 것 같습니다.

configurers에 SecurityConfigurer 객체들을 모두 담고 이를 한 개씩 반복하여 `configurer.init((B) this);`를 실행한다!

여기서 실행되는 SecurityConfigurer의 init()은 다음과 같습니다.

<img width="1595" alt="image" src="https://github.com/user-attachments/assets/06d9bfae-0e98-4d14-b003-7edc13fe3c2a">


SecurityBuilder**의 초기화 작업**을 수행하기 위한 메서드로 설정이 올바르게 작동할 수 있도록 준비하는 역할이라고 합니다!

그리고 하위의 반복문은 configurersAddedInInitializing을 반복하며 SecurityConfigurer 객체들에 대한 초기화를 진행해주고 있습니다.

configurersAddedInInitializing 필드는 다음과 같습니다.

```java
private final List<SecurityConfigurer<O, B>> configurersAddedInInitializing = new ArrayList<>();
```

<img width="1668" alt="image" src="https://github.com/user-attachments/assets/3153a8bb-08e4-4961-b4c3-84df58bcc949">


이 필드가 사용되는 곳을 확인해보면 add, remove, 현재 메서드가 있는데 add() 메서드는 주어진 SecurityConfigurer 객체를 검증하고 configurersAddedInInitializing 필드에 추가하는 역할을 하고 있습니다.

종합해보면 init() 메서드는 SecurityConfigurer 객체들을 모두 가져와 초기화한다고 생각하면 될 것 같습니다!!

### 다시다시 doBuild()

```java
@Override
protected final O doBuild() throws Exception {
	synchronized (this.configurers) {
		this.buildState = BuildState.INITIALIZING;
		beforeInit();
		init();
		this.buildState = BuildState.CONFIGURING;
		beforeConfigure();
		configure();
		this.buildState = BuildState.BUILDING;
		O result = performBuild();
		this.buildState = BuildState.BUILT;
		return result;
	}
}
```

그러면 이제 doBuild()의 상위 3줄까지를 정리해보면 다음과 같을 것 같습니다.

> buildState를 INITIALIZING로 변경하고 하위 클래스에서 추가한 초기화 작업을 실행한 뒤 SecurityConfigurer 객체들에 대한 초기화를 진행한다!
> 

이제 아래로 내려가 보겠습니다.

buildState를 INITIALIZING로 바꿔주고 있습니다.

위에서 INITIALIZING는 빌드가 시작된 후 SecurityConfigurer**의** init() **메서드들이 호출되는 동안의 상태라고 했습니다.**

그 이후의 단계는 위에서 init()을 해줬던 것과 유사하게 진행되고 있습니다.

beforeConfigure()과 configure() 메서드를 보겠습니다.

### beforeConfigure()과 configure()

<img width="1639" alt="image" src="https://github.com/user-attachments/assets/2ee5917f-c35c-4046-b9d1-851919d3d474">


<img width="1639" alt="image" src="https://github.com/user-attachments/assets/cee3d0eb-2170-4c67-9ab0-c48fd5afa27c">


우선 beforeConfigure() 메서드는 beforeInit()과 유사하게 SecurityConfigurer 객체의 configure() 메서드가 호출되기 전에 실행되며, **설정 작업이 시작되기 전에 추가 작업을 수행할 수 있도록 하는 메서드입니다.**

configure() 메서드는 init()과 동일하게 getConfigurers()를 통해 SecurityConfigurer 객체를 가져오고 해당 객체의 configure() 작업을 실행한다고 이해할 수 있을 것 같습니다.

<img width="1639" alt="image" src="https://github.com/user-attachments/assets/028f586d-84f0-45c3-8822-0f9c1d8b259f">


또한 이 곳에서의 configure()는 SecurityBuilder **객체의 속성을 설정하여 보안 구성을 적용**하는 역할을 한다고 합니다.

정리해보면 configure() 메서드는 보안 설정의 구체적인 작업을 수행하는 단계입니다.

### 다시다시다시 doBuild()

```java
@Override
protected final O doBuild() throws Exception {
	synchronized (this.configurers) {
		this.buildState = BuildState.INITIALIZING;
		beforeInit();
		init();
		this.buildState = BuildState.CONFIGURING;
		beforeConfigure();
		configure();
		this.buildState = BuildState.BUILDING;
		O result = performBuild();
		this.buildState = BuildState.BUILT;
		return result;
	}
}
```

그렇다면 configure에 관한 코드도 이해가 됩니다.

이에 대한 로직을 정리해보면 다음과 같이 정리해볼 수 있을 것 같습니다.

> buildState를 CONFIGURING로 변경하고 하위 클래스에서 추가한 보안 설정을 수행한 뒤 SecurityConfigurer 객체들에 대한 보안 설정을 진행한다!
> 

그 후로는 BuildState를 BUILDING으로 변경해주고 performBuild() 메서드의 결과를 result에 넣어주고 있습니다.

perfomeBuild()는 다음과 같습니다.

<img width="1639" alt="image" src="https://github.com/user-attachments/assets/559612d2-46b7-4b54-b6e4-f0a8f3c63e20">

perfomeBuild()는 abstract로 하위 클래스에서 구현해야하고 최종적인 보안 객체인 SecurityFilterChain 객체를 빌드하고 반환하는 메서드입니다.

그 다음 BuildState를 BUILT로 변환해주고 최종 보안 객체를 반환해줍니다.

### 다시 build()

<img width="1651" alt="image" src="https://github.com/user-attachments/assets/35bb561e-bf8c-40f2-bc17-5c4bafddfcd1">


다시 AbstractSecurityBuilder의 build()를 보면 또 이해가 되는 것 같습니다.

if 문을 통해 이전에 빌드가 시작되지 않은 경우에 object에 최종 보안 객체를 doBuild() 메서드에서 반환받아 넣고 이를 반환하는 메서드라고 설명할 수 있을 것 같습니다.

### 정리

저희는 SecurityConfig에서 다음과 같이 사용한다고 했었습니다.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests()
        .requestMatchers("/**")
        .hasRole("USER") 
        .and()
        .formLogin();
    return http.build();
}
```

이는 메서드 체이닝을 통해 HttpSecurity 객체에서 원하는 필드를 설정해주고 위의 복잡한 빌드 과정을 통해 SecurityFilterChain 클래스의 최종 보안 객체를 빌드합니다.

어쩌다 이렇게 봤는지 모르겠지만 저희가 할 일은 “HttpSecurity에 oidcBackChannelLogout 메서드를 만들어 다른 로그아웃들과 동일한 DSL 수준에서 OIDC 백채널 로그아웃을 지원하도록 하자!”가 될 것 같습니다.

## 디버깅으로 실행 과정 알아보기

그러면 디버깅으로 기존 코드의 실행 과정을 알아보겠습니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/010ba3c9-0b8a-47da-98c3-12e9e2b1c4b6">


위처럼 코드를 구성하고 아래처럼 break point를 두어 애플리케이션을 실행해보겠습니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/de5ae567-9843-4942-9e61-0cc66963b651">


### 실행

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/85306ede-c906-4b28-b54e-d23acd51aa1d">


우선 실행해보니 해당 break point에 잘 걸렸습니다.

이제 step into로 들어가보겠습니다.

### 1. backChannel() 메서드 진입

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/d82fda6f-1ec0-400b-93c9-e393a5e706d5">


OidcLogoutConfigurer 클래스의 backChannel() 메서드로 진입하였습니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/ed397068-5f99-4291-8b6a-1b4dfc6b8a5e">


해당 시점의 backChannel 필드는 null이기 떄문에 새로운 BackChannelLogoutConfigurer 객체를 만들어 bakcChannel 필드에 넣어줍니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/8969f25e-2c7d-4e59-b7be-07357fc195ea">


이후 파라미터로 전달받은 backChannelLogoutConfigurer의 customize() 메서드에 backChannel 필드를 넣어주고 실행합니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/44e86014-c724-4858-b45d-5ecde55e6d12">


이후 다시 빠져나옵니다.

### 2. oidcLogout() 메서드 진입

다음으로 oidcLogout() 메서드에 진입합니다.

<img width="1642" alt="image" src="https://github.com/user-attachments/assets/1078f581-bdba-4fb8-a5f1-8fa00ed6cd89">


해당 메서드에 대해 알아보기 위해 공식 문서를 찾아봤는데 설명이 없는 것을 확인할 수 있었습니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/8d2b1acc-ea57-482c-823e-c5908b84570f">


차근차근 알아보겠습니다.

매개변수로 Custimizer<T>를 받고 있습니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/372b9332-d493-4947-b82e-b9ea75159f24">


Custimizer<T>는 주어진 객체의 설정을 수정할 수 있도록 돕습니다.

@**FunctionalInterface는 하나의 추상 메서드를 가지는 기능적 인터페이스를 의미합니다.**

이 customize() 추상메서드를 통해 객체의 설정을 수정합니다.

다음으로 `oauth2LoginCustomizer.customize(getOrApply(new OAuth2LoginConfigurer<>()));`를 알아보겠습니다.

`oauth2LoginCustomizer.customize`는 위에서 봤듯이 해당 매개변수에 대한 설정을 하는 메서드입니다.

getOrApply(new OidcLogoutConfigurer<>())는 다음과 같습니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/d7a8a062-f961-48bb-95fd-e9e2d4cf9727">


기존의 SecurityConfigurer 객체를 반환하거나 해당 객체가 없으면 새로운 SecurityConfigurerAdapter를 적용하여 새로운 SecurityConfigurer 객체를 반환한다고 합니다.

이에 대한 파라미터로 OidcLogoutConfigurer를 넣었으니 이전에 생성된 OidcLogoutConfigurer 객체가 있다면 이를 반환하고 없다면 새로운 OidcLogoutConfigurer 객체를 생성하여 반환합니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/8827ce85-2d6e-4005-91cf-ef42543eacb6">


새로운 객체를 만드는 apply 메서드는 다음과 같이 구성되어 있습니다.

내부의 add 메서드는 다음과 같습니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/f03c425b-b7ff-44c0-81f7-87c154ac7e46">


이는 새로운 SecurityConfigurer 객체를 configurers 맵에 추가하는 역할을 합니다.

위에서 init()이나 configurer()을 학습할 때 봤던 configurers라서 좀 익숙해진 것 같습니다!!

```java
Assert.notNull(configurer, "configurer cannot be null");
Class<? extends SecurityConfigurer<O, B>> clazz = (Class<? extends SecurityConfigurer<O, B>>) configurer
	.getClass();
```

우선 configure가 nouNull인 것을 확인하고 null이라면 예외 처리를 진행하고 null이 아니라면 configurer의 클래스 타입을 가져와서 clazz에 저장합니다.

이는 추후 configurers 맵의 키로 사용됩니다.

```java
synchronized (this.configurers) {
	if (this.buildState.isConfigured()) {
		throw new IllegalStateException("Cannot apply " + configurer + " to already built object");
	}
```

이후 synchronized를 사용하여 configurers 맵이 다중 스레드 환경에서도 안전하게 추가 작업을 수행할 수 있도록 하고 빌드가 완료된 상태인지 확인합니다.

BuildState가 CONFIGURING 상태라면 이미 설정이 완료된 상태이기 때문에 configurer를 추가할 수 없기 때문에 예외를 던져줍니다.

```java
List<SecurityConfigurer<O, B>> configs = null;
if (this.allowConfigurersOfSameType) {
    configs = this.configurers.get(clazz);
}
configs = (configs != null) ? configs : new ArrayList<>(1);
configs.add(configurer);
this.configurers.put(clazz, configs);
```

allowConfigurersOfSameType이 false인 경우, 동일한 타입의 SecurityConfigurer를 여러 개 추가할 수 없습니다.

allowConfigurersOfSameType이 true이면 configurers 맵에서 clazz 타입의 기존 SecurityConfigurer 리스트를 가져옵니다. 

그리고 Configs가 null이라면 새로운 리스트를 만들어 줍니다.

다음으로 해당 configurer를 configs 리스트에 추가해준 뒤 configurers 맵에 Put 해줍니다.

```java
if (this.buildState.isInitializing()) {
	this.configurersAddedInInitializing.add(configurer);
}
```

buildState가 INITIALIZING 상태라면 configurersAddedInInitializing 리스트에도 configurer를 추가합니다.
초기화 단계에서 추가된 SecurityConfigurer 객체를 추적하여 필요한 경우 추가 작업을 수행할 수 있게 하기 위함입니다!

add() 메서드의 동작은 SecurityConfigurer 객체를 configurers 맵에 타입별로 추가한다!라고 정리해볼 수 있을 것 같습니다.

### apply() 정리

```java
public <C extends SecurityConfigurer<O, B>> C apply(C configurer) throws Exception {
	add(configurer);
	return configurer;
}
```

그러면 apply()는 configurer를 configurers 맵에 추가하고 다시 반환해주는 메서드라고 설명할 수 있을 것 같습니다.

### getOrApply 정리

```java
private <C extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity>> C getOrApply(C configurer)
		throws Exception {
	C existingConfig = (C) getConfigurer(configurer.getClass());
	if (existingConfig != null) {
		return existingConfig;
	}
	return apply(configurer);
}
```

그렇다면 getOrApply()는 configurer의 클래스 타입을 확인하고 없으면 있으면 기존의 configurer를 반환하고 없다면 apply() 메서드를 통해 configurer를 등록해준 뒤 반환해주는 메서드라고 정리할 수 있을 것 같습니다!

### oidcLogout() 정리

```java
public HttpSecurity oidcLogout(Customizer<OidcLogoutConfigurer<HttpSecurity>> oidcLogoutCustomizer)
		throws Exception {
	oidcLogoutCustomizer.customize(getOrApply(new OidcLogoutConfigurer<>()));
	return HttpSecurity.this;
}
```

그렇다면 oidcLogout()은 OidcLogoutConfigurer의 새로운 객체를 생성하여 configurer를 등록하고 init()과 configure() 과정에서 포함될 수 있도록 하고 객체 설정을 커스터마이즈하여 반환하는 메서드라고 설명할 수 있을 것 같습니다!

### 다시 filterchain

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/9f92cb2d-3d11-41c2-9239-8db1cad91876">

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/f1e99763-06ce-4d8c-8b5b-2bee82ce8e1c">


이 과정 후 다시 filterChain으로 나오고 최종 객체가 빌드됩니다.

## 정리

```java
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .oidcLogout((oidc) -> oidc.backChannel(Customizer.withDefaults()));
        
        return http.build();
    }
```

따라서 해당 기능의 동작은 다음과 같습니다.

1. HttpSecurity 객체로, Spring Security에서 보안 설정 시작, 메서드 체이닝 방식으로 설정
2. **oidcLogout(...) 메서드 호출하여 OIDC 로그아웃 관련 설정을 시작**
    1. 내부적으로 getOrApply(new OidcLogoutConfigurer<>())를 호출하여 OidcLogoutConfigurer 객체를 가져오거나 생성
    2. oidcLogoutCustomizer.customize(...)를 통해 OidcLogoutConfigurer 객체를 설정
3. oidc.backChannel(Customizer.withDefaults())를 호출하여 **백채널 로그아웃** 설정
    1. OidcBackChannelLogoutConfigurer 객체를 생성하거나 가져와서 customize를 통해 백채널 로그아웃 설정 적용
4. http.build()를 통해 보안 구성 초기화 및 적용 후 빌드
    1. 각 SecurityConfigurer의 init() 메서드를 호출하여 필요한 초기 설정을 수행
    2. 각 SecurityConfigurer의 configure() 메서드를 호출하여 보안 설정을 적용
    3. performBuild()를 통해 최종적으로 SecurityFilterChain 객체를 생성