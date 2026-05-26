package com.pos.sale_dynamics.service.UserService;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.dto.CropRatioDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.dto.UserDTO;
import com.pos.sale_dynamics.mapper.OrderDTOMapper;
import com.pos.sale_dynamics.mapper.UserDTOMapper;
import com.pos.sale_dynamics.repository.*;
import com.pos.sale_dynamics.responses.CldUploadResponse;
import com.pos.sale_dynamics.responses.CreateUserResponse;
import com.pos.sale_dynamics.service.CloudinaryService.CloudinaryServiceImpl;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ThumbnailRepository thumbnailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserDTOMapper userDTOMapper;

    @Autowired
    private OrderDTOMapper orderDTOMapper;


    @Autowired
    private CloudinaryServiceImpl cloudinaryService;

    public List<OrderDTO> findOrdersByUsername(String username) {
        Optional<ApplicationUser> user = userRepository.findByUsername(username);
        return user.map(applicationUser -> applicationUser.getOrders().stream().map(order -> orderDTOMapper.apply(order)).toList()).orElse(null);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("user not found"));
    }

    public Optional<ApplicationUser> updateInfo(String username, UserDTO userDTO) throws UsernameNotFoundException {
        Optional<ApplicationUser> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            ApplicationUser founded = user.get();
            founded.setFullName(userDTO.fullName());
            founded.setEmail(userDTO.email());
            founded.setPhone(userDTO.phone());
            return Optional.of(userRepository.save(founded));
        } else {
            throw new UsernameNotFoundException("Username not found!");
        }
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(user -> userDTOMapper.apply(user)).toList();
    }
    public ResponseEntity<UserDTO> findByUsername(String username) {
        Optional<ApplicationUser> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            System.out.println("In user service, user not found with username: " + username);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(userDTOMapper.apply(user.get()), HttpStatus.OK);
    }

    public ResponseEntity<CreateUserResponse> createUser(String fullName, String email, String password, String phone) {
         Optional<ApplicationUser> user = userRepository.findByEmail(email);
         if (user.isPresent()) {
             return new ResponseEntity<>(new CreateUserResponse(true, "Email has been already existed", null), HttpStatus.METHOD_NOT_ALLOWED);
         }

        // Encode password
        String encodedPassword = passwordEncoder.encode(password.isEmpty() ? "123" : password);
        String username = email.split("@")[0];
        // Add role
        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        // Create instance
        ApplicationUser newUser = new ApplicationUser(username, fullName, encodedPassword, authorities, email, phone);
        newUser.setEnabled(false);
        System.out.println("In user service, registering: " + newUser);

        ApplicationUser savedUser = userRepository.save(newUser);
        VerificationToken verifyToken = generateToken(savedUser);

        verificationTokenRepository.save(verifyToken);

        return new ResponseEntity<>(new CreateUserResponse(false, "Account created successfully", verifyToken), HttpStatus.CREATED);
    }

    public String getVerifyToken(String username) {
        ApplicationUser user = userRepository.findByUsername(username).get();
        // find and delete expired token
        Optional<VerificationToken> oldToken = verificationTokenRepository.findByUserId(user.getId());
        VerificationToken verifyToken;

        if (oldToken.isPresent()) {
            verifyToken = oldToken.get();
            verifyToken.setToken(UUID.randomUUID().toString());
            verifyToken.setExpirationTime(verifyToken.getTokenExpirationTime());
        } else {
            // create new token
            verifyToken = generateToken(user);
        }

        verificationTokenRepository.save(verifyToken);
        System.out.println(verifyToken.getToken());
        return verifyToken.getToken();
    }

    public VerificationToken generateToken(ApplicationUser user) {
        // create token
        String token = UUID.randomUUID().toString();
        // generate verify token
        return new VerificationToken(token, user);
    }

    public String changePassword(String username, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        ApplicationUser user = userRepository.findByUsername(username).get();
        user.setPassword(encodedPassword);
        Calendar calendar = Calendar.getInstance();
        user.setChangedPasswordDate(calendar.getTime());
        userRepository.save(user);

        return "Password changed";
    }

    public Number calculateRevenue(String from, String to) {
        LocalDateTime fromTime = LocalDateTime.parse(from + "T00:00:00");
        LocalDateTime toTime = LocalDateTime.parse(to + "T23:59:59");
        Long number = orderRepository.calculateRevenueInRange(fromTime, toTime);
        return Objects.requireNonNullElse(number, 0);
    }

    public ResponseEntity<String> block(String username) {
        Optional<ApplicationUser> userRecord = userRepository.findByUsername(username);
        if (userRecord.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        ApplicationUser user = userRecord.get();
        user.setBlocked(true);
        userRepository.save(user);
        return new ResponseEntity<>("Blocked user with username: " + user.getUsername() + " successfully!", HttpStatus.OK);
     }

    public ResponseEntity<String> unblock(String username) {
        Optional<ApplicationUser> userRecord = userRepository.findByUsername(username);
        if (userRecord.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        ApplicationUser user = userRecord.get();
        user.setBlocked(false);
        userRepository.save(user);
        return new ResponseEntity<>("Unblocked user: " + user.getUsername() + " successfully!", HttpStatus.OK);
    }

    public ResponseEntity<CldUploadResponse> changeAvatar(MultipartFile thumbnailFile, String username) {
        Optional<ApplicationUser> userRecord = userRepository.findByUsername(username);

        if (userRecord.isPresent()) {
            ApplicationUser user = userRecord.get();
            try {
                CldUploadResponse asset = cloudinaryService.upload(thumbnailFile);
                user.setAvatarURL(asset.url());
                userRepository.save(user);
                return new ResponseEntity<>(asset, HttpStatus.OK);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
