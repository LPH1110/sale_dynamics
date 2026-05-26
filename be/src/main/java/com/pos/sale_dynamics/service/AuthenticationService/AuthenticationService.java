package com.pos.sale_dynamics.service.AuthenticationService;

import com.pos.sale_dynamics.domain.ApplicationUser;
import com.pos.sale_dynamics.domain.VerificationToken;
import com.pos.sale_dynamics.dto.LoginResponseDTO;
import com.pos.sale_dynamics.dto.TokenVerifyResponse;
import com.pos.sale_dynamics.mapper.UserDTOMapper;
import com.pos.sale_dynamics.repository.RoleRepository;
import com.pos.sale_dynamics.repository.UserRepository;
import com.pos.sale_dynamics.repository.VerificationTokenRepository;
import com.pos.sale_dynamics.responses.LoginResponse;
import com.pos.sale_dynamics.service.TokenService;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import com.pos.sale_dynamics.domain.Role;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;

@Service
@Transactional
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserDTOMapper userDTOMapper;

    public ApplicationUser registerUser(String username, String password) {
        String encodedPassword = passwordEncoder.encode(password.isEmpty() ? "123" : password);
        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        ApplicationUser newUser = new ApplicationUser(username, encodedPassword, authorities);
        System.out.println("In authentication service, registering: " + newUser);
        return userRepository.save(newUser);
    }

    public ResponseEntity<LoginResponse> loginUser(String username, String password) {
        System.out.println("Logging in: " + username + " - " + password);

        Optional<ApplicationUser> userRecord = userRepository.findByUsername(username);
        if (userRecord.isEmpty()) {
            return new ResponseEntity<>(new LoginResponse(true, "Username doesn't exist", null), HttpStatus.NOT_FOUND);
        } else if (!passwordEncoder.matches(password, userRecord.get().getPassword())) {
            return new ResponseEntity<>(new LoginResponse(true, "Wrong password", null), HttpStatus.NOT_ACCEPTABLE);
        } else {
            try {
                Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
                String token = tokenService.generateToken(auth);
                ApplicationUser user = userRecord.get();
                LoginResponseDTO loginResponseDTO = new LoginResponseDTO(userDTOMapper.apply(user), token);

                return new ResponseEntity<>(new LoginResponse(false, "Logged successfully", loginResponseDTO), HttpStatus.ACCEPTED);


            } catch (AuthenticationException e) {
                System.out.println(e.getMessage());
                return new ResponseEntity<>(new LoginResponse(true, e.getMessage(), null), HttpStatus.NOT_FOUND);
            }
        }
    }

    public ResponseEntity<TokenVerifyResponse> verifyToken(String token) throws NoSuchElementException {

        try {
            VerificationToken verifyToken = verificationTokenRepository.findByToken(token).get();
            Date time = verifyToken.getExpirationTime();
            Calendar calendar = Calendar.getInstance();

            if (time.getTime() - calendar.getTime().getTime() <= 0) {
                verificationTokenRepository.delete(verifyToken);
                TokenVerifyResponse response = new TokenVerifyResponse(verifyToken.getUser().getEnabled(), true, "Token is already expired");

                return new ResponseEntity<>(response, HttpStatus.GONE);
            } else {
                ApplicationUser user = verifyToken.getUser();
                user.setEnabled(true);
                userRepository.save(user);
                TokenVerifyResponse response = new TokenVerifyResponse(user.getEnabled(), false, "Account activated successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        } catch (NoSuchElementException e) {
            TokenVerifyResponse response = new TokenVerifyResponse(false, false, "Token not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
