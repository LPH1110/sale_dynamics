package com.pos.sale_dynamics.controller;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.dto.CustomerDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import com.pos.sale_dynamics.requests.GetInRangeRequest;
import com.pos.sale_dynamics.service.CustomerService.CustomerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@CrossOrigin("*")
public class CustomerController {
    @Autowired
    private CustomerServiceImpl customerService;
    @GetMapping
    public List<Customer> getCustomers() {
        return customerService.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO customerDTO) {
        return customerService.create(customerDTO);
    }

    @GetMapping("/detail")
    public ResponseEntity<CustomerDTO> getCustomer(@RequestParam String phone) {
        return customerService.findByPhone(phone);
    }

    @PostMapping("/count/news")
    public Number countNewCustomers(@RequestBody GetInRangeRequest request) {
        return customerService.countNewCustomerInRange(request.from(), request.to());
    }


    @GetMapping("/detail/orders")
    public ResponseEntity<List<OrderDTO>> getOrders(@RequestParam String phone) {
        return customerService.findOrdersByPhone(phone);
    }

    @GetMapping("/keyword")
    public List<CustomerDTO> getByKeyWord(@RequestParam String infix) {
        return customerService.findByKeyword(infix);
    }
}
