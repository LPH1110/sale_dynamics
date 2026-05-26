package com.pos.sale_dynamics.mapper;

import com.pos.sale_dynamics.domain.Order;
import com.pos.sale_dynamics.dto.CustomerDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.dto.OrderItemDTO;
import com.pos.sale_dynamics.repository.OrderItemRepository;
import com.pos.sale_dynamics.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class OrderDTOMapper implements Function<Order, OrderDTO> {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CustomerDTOMapper customerDTOMapper;

    @Autowired
    private OrderItemDTOMapper orderItemDTOMapper;

    @Override
    public OrderDTO apply(Order order) {

        // customer
        CustomerDTO customerDTO = customerDTOMapper.apply(order.getCustomer());

        // order status
        String status = order.getOrderStatus().getTitle();

        // order items
        List<OrderItemDTO> orderItemDTOList = order.getOrderItems().stream().map(item -> orderItemDTOMapper.apply(item)).toList();

        return new OrderDTO(
                order.getId(),
                order.getTotal(),
                order.getReceived(),
                order.getExcess(),
                order.getCustomerOwed(),
                order.getCreatedDate(),
                status,
                customerDTO,
                orderItemDTOList,
                order.isConfirmed(),
                order.getDescription(),
                order.getIssuer().getUsername()
        );
    }

    public Order mapToOrder(OrderDTO orderDTO) {
        return null;
    }
}
