package com.pos.sale_dynamics.service.OrderItemService;


import com.pos.sale_dynamics.domain.OrderItem;
import com.pos.sale_dynamics.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class OrderItemServiceImpl implements OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<OrderItem> findByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
