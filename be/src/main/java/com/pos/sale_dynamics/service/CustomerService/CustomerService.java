package com.pos.sale_dynamics.service.CustomerService;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.dto.CustomerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CustomerService {
    List<Customer> findAll();
    Page<CustomerDTO> findAll(Pageable pageable);


    ResponseEntity<CustomerDTO> create(CustomerDTO customerDTO);

    List<CustomerDTO> findByKeyword(String infix);

    ResponseEntity<CustomerDTO> findByPhone(String phone);
}
