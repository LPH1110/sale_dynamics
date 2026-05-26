package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@Data
@Setter
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private long id;

    private String lastname;

    @Column(nullable = false)
    private String firstname;

    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    private String address;

    private LocalDateTime createdDate;

    private String gender;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer")
    private List<Order> orders;

    public Customer() {
        this.lastname = "";
        this.firstname = "";
        this.email = "";
        this.phone = "";
        this.address = "";
        this.gender = "";
        this.createdDate = LocalDateTime.now();
    }

    public Customer(String lastname, String firstname, String email, String phone, String address, String gender) {
        this.lastname = lastname;
        this.firstname = firstname;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.createdDate = LocalDateTime.now();
    }
}
