package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Entity
@Data
@Setter
@Table(name = "orders")
public class Order {
    @Id
    @Column(name = "order_id")
    @GenericGenerator(name="order_id_gen", type = com.pos.sale_dynamics.generators.OrderIdGenerator.class)
    @GeneratedValue(generator="order_id_gen")
    private String id;

    private String description;

    @Column(nullable = false)
    private int total;

    @Column(nullable = false)
    private int received;

    @Column(nullable = false)
    private int excess;

    @Column
    private int customerOwed;

    @Getter
    private boolean confirmed;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_status_id")
    private OrderStatus orderStatus;

    private LocalDateTime createdDate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private ApplicationUser issuer;

    public Order() {
        this.description = "";
        this.total = 0;
        this.received = 0;
        this.excess = 0;
        this.customerOwed = 0;
        this.orderStatus = null;
        this.createdDate = null;
        this.issuer = null;
        this.confirmed = false;
    }

    public Order(String description, int total, int received, int excess, int customerOwed) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        this.description = description;
        this.total = total;
        this.received = received;
        this.excess = excess;
        this.customerOwed = customerOwed;
        this.orderStatus = null;
        this.orderItems = new ArrayList<>();
        this.createdDate = LocalDateTime.now();
        this.confirmed = false;
        this.issuer = null;
    }

}
