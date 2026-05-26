package com.pos.sale_dynamics.controller;

import com.pos.sale_dynamics.domain.ApplicationUser;
import com.pos.sale_dynamics.dto.LoginResponseDTO;
import com.pos.sale_dynamics.dto.RegistrationDTO;
import com.pos.sale_dynamics.dto.TokenVerifyResponse;
import com.pos.sale_dynamics.responses.LoginResponse;
import com.pos.sale_dynamics.service.AuthenticationService.AuthenticationService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApplicationUser registerUser(@RequestBody RegistrationDTO body) {
        return authenticationService.registerUser(body.getUsername(), body.getPassword());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody RegistrationDTO body)  {
        return authenticationService.loginUser(body.getUsername(), body.getPassword());
    }

    @GetMapping("/verify-user")
    public ResponseEntity<TokenVerifyResponse> verifyUser(@RequestParam String token) {
        return authenticationService.verifyToken(token);
    }
}
