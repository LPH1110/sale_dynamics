package com.pos.sale_dynamics.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestDTO{
    private String username;
    private String newPassword;
}
