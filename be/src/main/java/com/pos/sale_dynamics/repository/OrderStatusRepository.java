package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    Optional<OrderStatus> findById(long id);
    Optional<OrderStatus> findByTitle(String title);
}
