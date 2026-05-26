package com.pos.sale_dynamics.service.OrderService;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.dto.TopSellingProductDTO;
import com.pos.sale_dynamics.mapper.OrderDTOMapper;
import com.pos.sale_dynamics.mapper.ProductDTOMapper;
import com.pos.sale_dynamics.repository.*;
import com.pos.sale_dynamics.responses.TopSellingProductResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderDTOMapper orderDTOMapper;

    @Autowired
    private ProductDTOMapper productDTOMapper;


    @Override
    public ResponseEntity<String> confirmOrder(String orderId) {
        Optional<Order> orderRecord = orderRepository.findById(orderId);
        if (orderRecord.isEmpty()) {
            return new ResponseEntity<>("Order not found with id: " + orderId, HttpStatus.NOT_FOUND);
        }
        Order order = orderRecord.get();
        order.setConfirmed(true);
        orderRepository.save(order);
        return new ResponseEntity<>("Order has been verified successfully!", HttpStatus.ACCEPTED);
    }

    @Override
    public List<OrderDTO> findAll() {
        return orderRepository.findAll().stream().map(order -> orderDTOMapper.apply(order)).toList();
    }

    @Override
    public ResponseEntity<OrderDTO> findById(String orderId) {
        Optional<Order> orderRecord = orderRepository.findById(orderId);
        if (orderRecord.isEmpty()) {
            System.out.println("In order service, order not found with id: " + orderId);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        Order order = orderRecord.get();
        return new ResponseEntity<>(orderDTOMapper.apply(order), HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<OrderDTO> createOrder(OrderDTO orderDTO) {
        Optional<Customer> customerRecord = customerRepository.findByPhone(orderDTO.customer().phone());
        if (customerRecord.isEmpty()) {
            System.out.println("In order service, Customer not found with phone: " + orderDTO.customer().phone());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        Optional<ApplicationUser> userRecord  = userRepository.findByUsername(orderDTO.issuer());
        if (userRecord.isEmpty()) {
            System.out.println("In order service, Issuer not found with username: " + orderDTO.issuer());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Order newOrder = orderRepository.save(
                new Order(
                        orderDTO.description(),
                        orderDTO.total(),
                        orderDTO.received(),
                        orderDTO.excess(),
                        orderDTO.customerOwed()
                )
        );

        int orderStatusId  = orderDTO.excess() >= 0 ? 3 : 2;
        OrderStatus orderStatus = orderStatusRepository.findById(orderStatusId).get();
        // bind relationship
        newOrder.setOrderStatus(orderStatus);
        orderStatus.getOrders().add(newOrder);
        orderStatusRepository.save(orderStatus);


        Customer customer = customerRecord.get();
        newOrder.setCustomer(customer);
        customer.getOrders().add(newOrder);
        customerRepository.save(customer);

        ApplicationUser user = userRecord.get();
        newOrder.setIssuer(user);
        user.getOrders().add(newOrder);
        userRepository.save(user);


        orderDTO.orderItems().forEach(item -> {
            // item = { productDTO, quantity }
            Product product = productRepository.findByBarcode(item.productDTO().barcode()).get();
            OrderItem orderItem = orderItemRepository.save(new OrderItem(newOrder, product, item.quantity()));
            newOrder.getOrderItems().add(orderItem);
        });

        return new ResponseEntity<>(orderDTOMapper.apply(orderRepository.save(newOrder)), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<OrderDTO> payOrder(String orderId, int received, int excess, int customerOwed) {
        Optional<Order> orderRecord = orderRepository.findById(orderId);
        if (orderRecord.isEmpty()) {
            System.out.println("In order service, order not found with id: " + orderId);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        Order order = orderRecord.get();
        order.setReceived(received);
        order.setExcess(excess);
        order.setCustomerOwed(customerOwed);

        if (received >= order.getTotal()) {
            OrderStatus status = orderStatusRepository.findById(3).get();
            order.setOrderStatus(status);
        }
        return new ResponseEntity<>(orderDTOMapper.apply(orderRepository.save(order)), HttpStatus.ACCEPTED);
    }

    @Override
    public Number countOrders(String from, String to) {
        LocalDateTime fromTime = LocalDateTime.parse(from + "T00:00:00");
        LocalDateTime toTime = LocalDateTime.parse(to + "T23:59:59");
        Long number = orderRepository.countOrders(fromTime, toTime);
        return Objects.requireNonNullElse(number, 0);
    }

    @Override
    public List<TopSellingProductResponse> findTopSellingProductsInRange(int limit, String from, String to) {
        LocalDateTime fromTime = LocalDateTime.parse(from + "T00:00:00");
        LocalDateTime toTime = LocalDateTime.parse(to + "T23:59:59");
        List<TopSellingProductDTO> products = orderItemRepository.findTopSellingProductsInRange(limit, fromTime, toTime);

        return products.stream().map(topDTO -> new TopSellingProductResponse(
                productDTOMapper.apply(topDTO.product),
                topDTO.quantity,
                topDTO.product.getSalePrice() * topDTO.quantity
        )).toList();
    }
}
