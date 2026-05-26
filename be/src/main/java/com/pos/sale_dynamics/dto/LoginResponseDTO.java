package com.pos.sale_dynamics.dto;

import com.pos.sale_dynamics.domain.ApplicationUser;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private UserDTO userDTO;
    private String jwt;

    public LoginResponseDTO(UserDTO userDTO, String jwt) {
        this.userDTO = userDTO;
        this.jwt = jwt;
    }
}
