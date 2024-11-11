---
layout: post
title: 아직도 공통 응답 포맷을 모르시나요?
subtitle: 아직도 공통 응답 포맷을 모르시나요?
date: '2024-11-07 10:45:51 +0900'
categories:
    - project
    - tradeham
    - study
    - spring
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---

# [API 공통 응답 포맷] 아직도 Envelope Pattern을 안 쓰시나요? 쉽게 알려드립니다!

자! 오늘은 API 공통 응답 포맷에 대해 아주 쉽게 알아 보겠습니다!

저희가 보통 기술을 선택할 때 기술에 대한 사용 이유를 명확하게 알고 사용해야 합니다.

이러한 코드 포맷을 사용할 때도 같다고 생각합니다.

“그냥 쓰던데요..”라기 보다 어떠한 이점을 얻기 위해 각각의 코드를 구성하였는지 직접 생각해봐야 한다고 생각합니다.

그렇다면 API 공통 응답 포맷 중 Envelope Pattern을 차근차근 처음부터 알아보겠습니다!

# **API 공통 응답 포맷이란?**

API 공통 응답 포맷은 RESTful API에서 클라이언트에게 일관된 형식의 응답을 제공하기 위한 표준화된 구조입니다. 이는 응답의 성공 여부, 데이터, 메시지, 상태 코드 등을 포함하여 클라이언트가 응답을 쉽게 이해하고 처리할 수 있도록 돕습니다.

```java
{
	"status": 200,
	"message": "요청이 성공적으로 처리되었습니다.",
	"data": { ... }
}
```

# **API 공통 응답 포맷이 왜 필요한가!**

만약 정말 raw하게 응답을 내린다면 다음과 같을 것입니다.

```java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ResponseEntity<String> success(){

        return ResponseEntity.ok("성공!!");
    }

    @GetMapping("/api/fail")
    public ResponseEntity<String> fail() throws IllegalAccessException {
        throw new IllegalAccessException("실패!!!");
    }
}
```

이 API들에 대해서 클라이언트는 다음의 응답을 제공받습니다.

- `/api/success`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/9f01f018-9843-4be4-8502-305934949ea9">


- `/api/fail`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/cb28e711-6e7d-4ec3-b5d8-3187ceb3c6e0">

과연 이는 좋은 응답일까요??

저는 아니라고 생각합니다!

왜냐하면 다음과 같은 문제가 예상되기 때문입니다!!

1. **비일관성**: 성공과 실패에 대해 응답 포맷이 다르면 클라이언트에서는 성공과 실패를 구분하는 로직을 처리하기 위한 코드를 구현해야하고 로직이 복잡해진다!!
2. **정보 부족**: 위에서의 응답은 상세한 정보가 부족하여 클라이언트가 어떤 문제로 인해 실패했는지 정확히 파악하기 어려워 디버깅이 어려워진다!!
3. **확장성 부족**: 클라이언트에 API가 여러 타입의 메시지, 상태, 데이터 등을 반환해야 하기가 어렵다!!

이를 해결하기 위한 것이 API 공통 응답 포맷 방식입니다!

# API 공통 응답 포맷 형식

인터넷의 떠도는 글을 읽어보면 API 공통 응답 포맷의 형식은 크게 두가지로 나뉘는 것 같습니다!

## 첫 번째 방법

- 성공 응답

```java
{
	"status": "success",
	"body": {
		"exampleKey": "exampleValue"
	}
}
```

- 실패 응답

```java
{
	"status": "error",
	"errorMessage": "API 실패 메세지"
}
```

이와 같이 성공했을 때는 성공한 데이터만, 실패했을 때는 에러 메시지만 주는 방법입니다.

## 두 번째 방법

- 성공 응답

```java
{
	"status": "success",
	"data": {
		"exampleKey": "exampleValue"
	},
	"error": null
}
```

- 실패 응답

```java
{
	"status": "error",
	"data": null
	"error": "API 실패 메세지"
}
```

위와 같이 성공했을 때나 실패했을 때나 일관된 응답을 내려주는 것입니다!

저는 일관성과 단순성의 이유로 두 번째 방식을 더 선호하고 있습니다!

(하지만 다음 포스팅으로 간다면 더 업그레이드가 됩니다!!)

그렇다면 이제 이러한 응답 포맷을 만들기 위해 코드를 구현해보겠습니다!

# **API 공통 응답 포맷 구현해보기**

## 1. 공통 응답 클래스 만들기

일관성있는 공통 응답을 내려주기 위해서는 공통된 응답 클래스를 만들어 클라이언트에게 항상 같은 클래스로 응답을 반환해주면 될 것입니다.

그래서 저는 다음과 같은 클래스를 만들어 보았습니다!

```java
@Getter
@NoArgsConstructor
public class ApiResponse<T> {
    private String status;
    private T data;
    private String error;

    // 성공 응답 생성 메서드
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = "success";
        response.data = data;
        response.error = null;
        return response;
    }

    // 실패 응답 생성 메서드
    public static <T> ApiResponse<T> error(String errorMessage) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = "error";
        response.data = null;
        response.error = errorMessage;
        return response;
    }
}
```

값은 어떤 값을 받을지 모르니 제네릭을 사용해주었고 실패 시에는 에러 메시지를 적절하게 받을 수 있도록 해주었습니다!

다음과 같은 클래스를 만들어서 반환해준다면 항상 같은 응답을 반환해줄 것입니다.

Controller도 바꿔주겠습니다!

```java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ApiResponse<String> success() {
        return ApiResponse.success("성공!!");
    }

    @GetMapping("/api/fail")
    public ApiResponse<String> fail() {
        return ApiResponse.error("실패!!!");
    }
}
```

테스트해보겠습니다!

### 테스트

- `/api/success`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/69433481-fa16-4684-86ca-a9083432264c">

- `/api/fail`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/9d7582e5-16e1-4d33-902a-3dba1539d1a3">

하지만 딱 보기에도 문제가 많아 보입니다!

하나하나 해결해보겠습니다!!

우선 실패 시에도 “200 OK”를 반환하는 것이 아닌 적절한 에러 코드를 내려주겠습니다!

## 2. 적절한 에러 코드 내려주기

현재는 실패 에러 코드 또한 200 OK로 내려주고 있기 때문에 이에 대한 처리를 해주어야 합니다!

사실 코드를 항상 200으로 내려주고 내부 status 값으로 성공/실패 여부를 처리하는 방법도 있다고 하는데 이에 대해서는 논쟁이 조금 있어서 다음에 정리하고 저는 더 Restful한 에러 코드를 알맞게 내려주는 방법을 사용하겠습니다!!

정말 단순하게 생각한다면 다음과 같은 방법을 사용할 수 있을 것 같습니다!!

```java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ResponseEntity<ApiResponse<String>> success() {
        return ResponseEntity.ok(ApiResponse.success("성공!!"));
    }

    @GetMapping("/api/fail")
    public ResponseEntity<ApiResponse<String>> fail() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST) // HTTP 400 상태 코드 설정
                .body(ApiResponse.error("실패!!!"));
    }

    @GetMapping("/api/error")
    public ResponseEntity<ApiResponse<String>> serverError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500 상태 코드 설정
                .body(ApiResponse.error("서버 에러 발생!!!"));
    }
}
```

(보기만해도 뭔가 괴랄해진…)

하지만 이렇게 된다면 응답 방식이 더 복잡해지고 서비스 단에서 던져야 하는 오류를 잡으려면 try-catch를 써서 처리를 더 해주어야 하겠죠??

그러면 너무 복잡해지니 저희는 GlobalExceptionHandler에 대해서 공부하여야 합니다!!

### GlobalExceptionHandler

Global Exception Handler은 모든 예외를 중앙에서 관리하기 위한 클래스입니다!!

예외에 대한 적절한 ApiResponse와 HTTP 상태 코드를 반환하는 것을 목표로 합니다!

이를 사용하려면 다음 두 어노테이션에 대해서 알아야 합니다.

1. **@RestControllerAdvice**
<br>
<br>
@ControllerAdvice와 @ResponseBody가 결합된 어노테이션입니다. (@RestController가 @Controller와 @ResponseBody이 합쳐진 것과 같습니다.)
<br><br>
애플리케이션 전체에서 발생하는 예외를 중앙에서 처리하여 JSON 형식의 응답을 반환할 수 있도록 도와줍니다!
<br><br>
저는 Exception이 훨훨 날아가는 것을 애가 잡아온다고 이해하고 있습니다!!
<br><br>
2. **@ExceptionHandler**
<br><br>
@ExceptionHandler는 특정 예외가 발생했을 때 호출될 메서드를 정의합니다!!
<br><br>
보통 다음과 같이 사용합니다.

```java
@ExceptionHandler((원하는)Exception.class)
```

그러면 이들을 이용한 코드를 한번 보겠습니다.

- TestController

```java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ApiResponse<String> success() {
        return ApiResponse.success("성공!!");
    }

    @GetMapping("/api/fail")
    public ApiResponse<String> fail() {
        throw new IllegalArgumentException("잘못된 요청입니다."); // 예외 던지기만 하면 GlobalExceptionHandler에서 처리
    }

    @GetMapping("/api/error")
    public ApiResponse<String> serverError() {
        throw new RuntimeException("서버 내부 오류 발생!"); // 예외 던지기만 하면 GlobalExceptionHandler에서 처리
    }
}
```

- GlobalExceptionHandler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage())); // 400 Bad Request와 함께 에러 메시지 반환
    }

    // RuntimeException (서버 에러)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("서버 오류가 발생했습니다: " + ex.getMessage()));
    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("알 수 없는 오류가 발생했습니다: " + ex.getMessage()));
    }
}
```

확연히 컨트롤러 코드에서의 복잡성이 줄어들었죠??

또한 서비스에서 `throw new`로 예외 처리를 해도 여기서 다 잡아서 일관된 포맷으로 보내줄 수 있을 것입니다.

이 외에도 중앙 집중화된 에러 처리, 코드 중복 제거, 유지 보수성 및 가독성 증가 등의 장점이 있을 것입니다!!

테스트도 해보겠습니다!

### 테스트

- `/api/success`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/a48ee5c0-1cb3-4fa3-8930-37bf8977492b">

- `/api/fail`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/1ad2c5b0-57f1-4b4b-84e4-fc0ab91895ae">


- `/api/error`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/7593b1ed-ceb9-4ac6-bd00-d5c886a2b1fc">


결과는 다음과 같이 에러 코드와 메시지를 잘 반환하고 있습니다.

하지만 아직도 아쉬운 부분이 있습니다.

저는 에러 메시지가 조금 더 상세하게 클라이언트에게 갔으면 좋겠습니다.

## 3. 상세한 에러 코드 보내주기

저는 에러 메시지가 조금 더 상세하게 클라이언트에게 가면 프론트엔드의 개발이 더 편하겠다는 생각을 하였습니다!(프론트 감수성 챙겨..!!)

물론 배포 단계에서는 보안의 문제로 이를 잘 숨겨야 하겠지만 개발 단계에서는 프론트엔드가 더 에러를 확실하게 볼 수 있어야 한다고 생각합니다!!

그래서 에러를 더 자세하게 만들기 위해 기존 ApiResponse에서 `private String error`으로 사용하던 error를 클래스를 만들어 객체를 넣는 방식으로 사용해야할 것 같습니다!!

- ErrorResponse 생성

```java
@Getter
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String code;
    private String message;
    private String path;

    public static ErrorResponse of(int status, String code, String message, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .code(code)
                .message(message)
                .path(path)
                .build();
    }
}
```

우선 에러의 정보를 담을 ErrorResponse를 생성해줍니다.

그리고 ApiResponse 클래스를 바꿔줍니다.

- ApiResponse

```java
@Getter
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorResponse error;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> error(ErrorResponse errorResponse) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.error = errorResponse;
        return response;
    }
}
```

그리고 기존 그냥 메시지만 감싸서 반환하던 GlobalExceptionHandler도 ErrorResponse를 감싸서 반환하도록 바꿔줍니다.

- GlobalExceptionHandler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "INVALID_ARGUMENT",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorResponse));
    }

    // RuntimeException (서버 에러)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorResponse));

    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorResponse));
    }
}
```

그리고 마지막으로 예외 처리를 하고 있는 Controller도 바꿔줍니다.

```java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ApiResponse<String> success() {
        return ApiResponse.success("성공!!");
    }

    @GetMapping("/api/fail")
    public ApiResponse<String> fail() {
        throw new IllegalArgumentException("잘못된 요청입니다.");
    }

    @GetMapping("/api/error")
    public ApiResponse<String> error() {
        throw new RuntimeException("알 수 없는 에러가 발생하였습니다.");
    }
}
```

그러면 테스트를 해보겠습니다!

### 테스트

- `/api/success`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/463b12aa-91aa-4bfe-8a77-89f0ae92e9b0">

- `/api/fail`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/a1298580-5ba9-48d7-8cd7-a55026121b7c">

- `/api/error`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/aa3a3467-0f2c-4519-b2ce-a0c0953b26c5">

자 여기서 또 드는 생각이 있습니다.

특정 상황에 대한 에러 코드와 메시지를 일관되게 관리한다면 유지 보수성과 확장성이 좋아지지 않을까?

이를 해결해보겠습니다.

## 4.  일관된 에러 코드 관리

자, 저희는 일관되게 코드를 관리해야 합니다.

만약 유저를 못 찾는 에러가 자주 반복되는데 이에 대한 메시지가 만드는 사람에 따라 다 다르고 만들 때마다 다 다르면 프론트엔드는 매우 화가 나겠죠?

유혈 사태를 일으키면 안되니 이에 대한 일관성이 필요합니다.

그래서 enum을 통해 에러 코드를 관리해주겠습니다.

enum으로 묶어야 할 필드는 위 ErrorResponse에서 status, code, message입니다.

- ErrorCode

```java
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 Bad Request
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "INVALID_INPUT_VALUE", "잘못된 입력 값입니다."),
    INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "INVALID_ARGUMENT", "잘못된 요청입니다."),

    // 404 Not Found
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "리소스를 찾을 수 없습니다."),
    
    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "서버 에러가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
```

위와 같이 Enum으로 묶어서 특정 상황에 대한 Error Code의 일관성을 맞춰 줍니다.

협업을 하는 사람도 이를 확인하여 적절한 필드를 내려준다면 일관성에 전혀 문제가 없겠죠??

그러면 **ErrorResponse를 수정해주겠습니다.**

- **ErrorResponse**

```java
@Getter
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String code;
    private String message;
    private String path;

    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .build();
    }
}
```

of의 파라미터도 적어졌죠? 네. 이득입니다.

그러면 GlobalExceptionHandler도 수정해주겠습니다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.INVALID_ARGUMENT,
                request.getRequestURI()
        );

        return ResponseEntity.status(ErrorCode.INVALID_ARGUMENT.getStatus())
                .body(ApiResponse.error(errorResponse));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorResponse));

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI()
        );

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(ApiResponse.error(errorResponse));
    }
}
```

여기서 `Exception ex`와 같은 파라미터는 안 쓰는데 왜 넣어놨냐!라고 하시는 분들도 있겠지만 저는 알 수 없는 예외가 발생할 때 사용되거나 디버깅이 필요할 때 사용하기 위해 놔둡니다!

그러면 이것도 테스트해보겠습니다!

### 테스트

- `/api/success`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/7986b20c-be4f-4d01-822d-94757075eb75">

- `/api/fail`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/88a24e62-23a4-4a11-83cf-28526a48d319">

- `/api/error`

<img width="1659" alt="image" src="https://github.com/user-attachments/assets/ae995ae2-215e-4867-8bba-e9ecc98cb11d">

응답이 일관되게 잘 나오는 것을 확인할 수 있습니다!

# Custom Exception

이제 마지막 단계입니다! 직접 Exception을 Custom하는 것입니다!

아래와 같이 Exception에 대한 Custom을 하여 상황에 맞는 Exception을 만들어 사용할 수 있습니다.

<img width="329" alt="image" src="https://github.com/user-attachments/assets/4f8eb409-7c0a-4d35-a61d-d841350ef59d">

기존의 코드는 다음과 같이 3가지 예외에 대한 Handling을 해주고 있습니다.

``` java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.RESOURCE_NOT_FOUND,
                request.getRequestURI()
        );

        return ResponseEntity.status(ErrorCode.RESOURCE_NOT_FOUND.getStatus())
                .body(ApiResponse.error(errorResponse));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorResponse));

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI()
        );

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(ApiResponse.error(errorResponse));
    }
}

```

하지만 저희는 각 상황에 맞는 보기 쉬운 에러를 내려주고 싶습니다.

만약 Repository에서 객체나 필드를 find할 때 원하는 데이터가 없으면 어떻게 예외를 처리해줄 수 있을까요?

그냥 다음과 같이 처리해줄 수도 있을 것입니다.

``` java
new RuntimeException("원하는 리소스가 없습니다.");
```

하지만 에러를 커스텀하여 RuntimeException 외에 자신이 원하는 에러를 내려줄 수 있습니다.

이를 위해서는 다음의 단계가 필요합니다.

- Exception을 확장하는 클래스 만들기
- ErrorCode에서 code와 message 만들기
- GlobalExceptionHandler에서 해당 에러를 Handling하는 코드 추가하기

이 단계를 차근차근 진행해보겠습니다.

### Exception을 확장하는 클래스 만들기

위의 예시를 가져와 원하는 리소스를 찾을 수 없을 때 발생하는 예외를 처리해주겠습니다.

``` java
@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final ErrorCode errorCode;

    public ResourceNotFoundException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
```

이제 다음과 같이 원하는 에러를 던질 수 있게 되었습니다.

``` java
new ResourceNotFoundException(ErrorCode.~)
```

### ErrorCode에서 code와 message 만들기

ErrorCode Enum에 다음의 코드를 추가해줍니다.

``` java
RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "리소스를 찾을 수 없습니다.")
```

### GlobalExceptionHandler에서 해당 에러를 Handling하는 코드 추가하기

GlobalExceptionHandler에 다음의 코드를 추가하여 ResourceNotFoundException을 Handling해줍니다.

``` java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ApiResponse<?>> handleNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = ErrorResponse.of(ex.getErrorCode(), request.getRequestURI());
    return new ResponseEntity<>(ApiResponse.error(errorResponse), ex.getErrorCode().getStatus());
}
```

### 테스트
이와 같이 Exception Custom을 통해 다음과 같이 예외 처리를 해줄 수 있습니다.

``` java
new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND)
```

Controller를 다음과 같이 구성하여 테스트해볼 수 있습니다.

``` java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ApiResponse<String> success() {
        return ApiResponse.success("성공!!");
    }

    @GetMapping("/api/fail")
    public ApiResponse<String> fail() {
        throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
```

<img width="1277" alt="image" src="https://github.com/user-attachments/assets/828895bf-cbea-40ec-ba9d-571f2a326f7d">

다음과 같이 에러가 잘 발생하는 것을 확인할 수 있습니다!!

## Custom Exception에 대한 논쟁

위와 같이 Exception Custom은 장점만 있는 것처럼 느껴집니다.

하지만 Exception을 Custom하여 사용하는 것은 다음과 같은 논쟁 거리가 있습니다.

1. 의미 전달이 제대로 되지 않을 수 있다.
<br><br>
Exception의 Naming을 잘 못할 경우 의미 전달이 제대로 되지 않을 수도 있습니다.
<br><br>
2. 협업을 하다보면 최초의 Custom Exception을 만든 저자의 의도와 다르게 사용할 수 있다.
<br><br>
협업자들 간 소통이 제대로 일어나지 않는 경우 각각의 Exception Custom을 할 수 있다는 문제가 생길 수도 있고 신입 개발자의 학습 곡선이 높아진다는 문제도 있습니다.
<br><br>
3. Code의 규약이 늘어난다.

또한 이 외에도 Spring에서 제공하는 기본 Exception들 또한 공식 문서에 계속 업데이트가 되고 있고 Spring에서 의미하는 의도가 명확하기 때문에 최대한 Custom을 지양하라는 얘기가 있습니다!

하지만 저는 이를 사용하여 각 Exception의 의미를 명확하게 해주는 것을 선호합니다!!

(카카오 멘토님께 여쭤봤을 때도 Exception을 Custom하여 사용한다고 하셨습니다..!!)

# 정리

이렇게 API 공통 응답 포맷 중 Envelope Pattern을 만들어보았습니다. 그래도 코드가 조금 보기 좋아진 것 같습니다!

하지만 또 다른 방법이… 어쩌면 더 좋을 수도 있을 방법이 존재합니다.

왜냐하면 이 방법이 장점이 많은 만큼 단점도 명확하기 때문입니다!

다음 포스팅에서는 이에 대한 단점과 다른 방법에 대해 알아보겠습니다!!

긴 글 읽어 주셔서 감사합니다!!

---

[제가 만든 **Envelope-Pattern**의 링크는 이 곳을 클릭해주세요!](https://github.com/alswp006/API_Response_Format-Envelope_Pattern)

PR이나 의견, 피드백을 환영합니다!!!