package com.pos.sale_dynamics.service.OrderItemService;

import com.pos.sale_dynamics.domain.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> findByOrderId(Long orderId);
}
