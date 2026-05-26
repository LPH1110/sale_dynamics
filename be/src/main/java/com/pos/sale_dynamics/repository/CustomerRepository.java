package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Override
    List<Customer> findAll();

    @Query("SELECT COUNT(c.id) FROM Customer c WHERE c.createdDate >= ?1 AND c.createdDate <= ?2")
    Long countInRange(LocalDateTime from, LocalDateTime to);

    @Query("SELECT c FROM Customer c WHERE c.firstname LIKE %:infix% OR c.lastname LIKE %:infix% OR c.email LIKE %:infix% OR c.phone LIKE %:infix% ORDER BY id LIMIT 50")
    List<Customer> findByNameContaining(@Param("infix") String infix);

    @Query("SELECT c FROM Customer c WHERE c.phone=?1")
    Optional<Customer> findByPhone(String phone);
}
