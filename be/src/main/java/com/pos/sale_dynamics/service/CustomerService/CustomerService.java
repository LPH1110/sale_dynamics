package com.pos.sale_dynamics.service.CustomerService;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.dto.CustomerDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CustomerService {
    List<Customer> findAll();


    ResponseEntity<CustomerDTO> create(CustomerDTO customerDTO);

    List<CustomerDTO> findByKeyword(String infix);

    ResponseEntity<CustomerDTO> findByPhone(String phone);
}
