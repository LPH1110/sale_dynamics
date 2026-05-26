package com.pos.sale_dynamics.exceptions;

import org.springframework.security.core.AuthenticationException;

public class VerifyTokenNotFound extends AuthenticationException {

    public VerifyTokenNotFound(String msg, Throwable cause) {
        super(msg, cause);
    }

    public VerifyTokenNotFound(String msg) {
        super(msg);
    }
}
