package com.pos.sale_dynamics.mapper;

import com.pos.sale_dynamics.domain.OrderItem;
import com.pos.sale_dynamics.dto.OrderItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class OrderItemDTOMapper implements Function<OrderItem, OrderItemDTO> {
    @Autowired
    private ProductDTOMapper productDTOMapper;

    @Override
    public OrderItemDTO apply(OrderItem orderItem) {
        return new OrderItemDTO(productDTOMapper.apply(orderItem.getProduct()), orderItem.getQuantity());
    }
}
