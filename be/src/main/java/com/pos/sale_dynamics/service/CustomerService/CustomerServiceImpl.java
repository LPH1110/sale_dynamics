package com.pos.sale_dynamics.service.CustomerService;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.domain.Order;
import com.pos.sale_dynamics.dto.CustomerDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.mapper.CustomerDTOMapper;
import com.pos.sale_dynamics.mapper.OrderDTOMapper;
import com.pos.sale_dynamics.repository.CustomerRepository;
import com.pos.sale_dynamics.repository.OrderRepository;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService{

    @Autowired
    private CustomerDTOMapper customerDTOMapper;
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDTOMapper orderDTOMapper;

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public ResponseEntity<CustomerDTO> create(CustomerDTO customerDTO) {
        Customer customer = customerRepository.save(customerDTOMapper.mapToCustomer(customerDTO));
        return new ResponseEntity<>(customerDTOMapper.apply(customer), HttpStatus.OK);
    }

    @Override
    public List<CustomerDTO> findByKeyword(String infix) {
        return customerRepository.findByNameContaining(infix).stream().map(customer -> customerDTOMapper.apply(customer)).toList();
    }

    @Override
    public ResponseEntity<CustomerDTO> findByPhone(String phone) {
        Optional<Customer> customerRecord = customerRepository.findByPhone(phone);
        return customerRecord.map(customer -> new ResponseEntity<>(customerDTOMapper.apply(customer), HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    public ResponseEntity<List<OrderDTO>> findOrdersByPhone(String phone) {
        List<OrderDTO> orders = orderRepository.findOrderByCustomerPhone(phone).stream().map(order -> orderDTOMapper.apply(order)).toList();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    public Number countNewCustomerInRange(String from, String to) {
        LocalDateTime fromTime = LocalDateTime.parse(from + "T00:00:00");
        LocalDateTime toTime = LocalDateTime.parse(to + "T23:59:59");
        Long number = customerRepository.countInRange(fromTime, toTime);
        return Objects.requireNonNullElse(number, 0);
    }
}
