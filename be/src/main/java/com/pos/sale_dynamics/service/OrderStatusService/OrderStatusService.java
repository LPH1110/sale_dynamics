package com.pos.sale_dynamics.service.OrderStatusService;

import com.pos.sale_dynamics.domain.OrderStatus;

import java.util.Optional;

public interface OrderStatusService {
    Optional<OrderStatus> findById(long id);
}
