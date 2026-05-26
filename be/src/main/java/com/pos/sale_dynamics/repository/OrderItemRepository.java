package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.OrderItem;
import com.pos.sale_dynamics.dto.TopSellingProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT o FROM OrderItem o WHERE o.order.id = ?1")
    List<OrderItem> findByOrderId(Long orderId);

    @Query(
            "SELECT new com.pos.sale_dynamics.dto.TopSellingProductDTO(p, SUM(oi.quantity)) " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "JOIN oi.order o " +
            "WHERE o.createdDate >= ?2 AND o.createdDate <= ?3 " +
            "GROUP BY p " +
            "ORDER BY SUM(oi.quantity) DESC " +
            "LIMIT ?1"
    )
    List<TopSellingProductDTO> findTopSellingProductsInRange(int limit, LocalDateTime from, LocalDateTime to);
}
