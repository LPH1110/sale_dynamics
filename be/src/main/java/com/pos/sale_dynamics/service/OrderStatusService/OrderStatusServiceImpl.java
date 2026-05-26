package com.pos.sale_dynamics.service.OrderStatusService;

import com.pos.sale_dynamics.domain.OrderStatus;
import com.pos.sale_dynamics.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class OrderStatusServiceImpl implements OrderStatusService{
    @Autowired
    private OrderStatusRepository orderStatusRepository;
    @Override
    public Optional<OrderStatus> findById(long id) {
        return orderStatusRepository.findById(id);
    }

}
