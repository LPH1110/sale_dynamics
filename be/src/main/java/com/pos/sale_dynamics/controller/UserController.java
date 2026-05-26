package com.pos.sale_dynamics.controller;

import com.pos.sale_dynamics.domain.ApplicationUser;
import com.pos.sale_dynamics.dto.ChangePasswordRequestDTO;
import com.pos.sale_dynamics.dto.CropRatioDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.dto.UserDTO;
import com.pos.sale_dynamics.requests.GetInRangeRequest;
import com.pos.sale_dynamics.responses.CldUploadResponse;
import com.pos.sale_dynamics.service.UserService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/detail")
    public ResponseEntity<UserDTO> getInfo(@RequestParam String username) {
        return userService.findByUsername(username);
    }
    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequestDTO request) {
        return userService.changePassword(request.getUsername(), request.getNewPassword());
    }

    @PostMapping("/update")
    public Optional<ApplicationUser> updateInfo(@RequestParam String username, @RequestBody UserDTO userDTO) {
        return userService.updateInfo(username, userDTO);
    }

    @GetMapping("/orders")
    public List<OrderDTO> getOrders(@RequestParam String username) {
        return userService.findOrdersByUsername(username);
    }

    @PostMapping("/revenue")
    public Number getRevenue(@RequestBody GetInRangeRequest request) {
        return userService.calculateRevenue(request.from(), request.to());
    }

    @PostMapping("/change-avatar")
    public ResponseEntity<CldUploadResponse> changeAvatar(
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("username") String username
    ) {
        return userService.changeAvatar(thumbnail, username);
    }


}
