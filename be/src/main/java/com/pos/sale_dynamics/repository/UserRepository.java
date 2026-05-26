package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Long> {
    Optional<ApplicationUser> findByUsername(String username);
    List<ApplicationUser> findAll();

    Optional<ApplicationUser> findByEmail(String email);

}
