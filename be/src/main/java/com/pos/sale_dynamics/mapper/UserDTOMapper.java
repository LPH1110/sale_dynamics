package com.pos.sale_dynamics.mapper;

import com.pos.sale_dynamics.domain.ApplicationUser;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class UserDTOMapper implements Function<ApplicationUser, UserDTO> {
    @Autowired
    private OrderDTOMapper orderDTOMapper;
    @Override
    public UserDTO apply(ApplicationUser user) {
        List<OrderDTO> orders = user.getOrders().stream().map(order -> orderDTOMapper.apply(order)).toList();

        return new UserDTO(
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarURL(),
                user.getAuthorities().stream().toList(),
                orders,
                user.getChangedPasswordDate(),
                user.getCreatedDate(),
                user.isEnabled(),
                user.getBlocked()
        );
    }
}
