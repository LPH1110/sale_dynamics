package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "order_statuses")
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_status_id")
    private long id;

    private String title;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orderStatus")
    private List<Order> orders;

    public OrderStatus() {
        this.orders = new ArrayList<>();
        this.title = "";
    }
    public OrderStatus(String title) {
        this.title = title;
    }

}
