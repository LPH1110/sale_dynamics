package com.pos.sale_dynamics.exceptions;

import org.springframework.security.core.AuthenticationException;

public class ProductNotFound extends AuthenticationException {
    public ProductNotFound(String msg, Throwable cause) {
        super(msg, cause);
    }

    public ProductNotFound(String msg) {
        super(msg);
    }
}
