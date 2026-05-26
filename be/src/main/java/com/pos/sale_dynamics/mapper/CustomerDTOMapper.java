package com.pos.sale_dynamics.mapper;

import com.pos.sale_dynamics.domain.Customer;
import com.pos.sale_dynamics.dto.CustomerDTO;
import com.pos.sale_dynamics.dto.OrderDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class CustomerDTOMapper implements Function<Customer, CustomerDTO> {

    @Override
    public CustomerDTO apply(Customer customer) {

        return new CustomerDTO(
                customer.getLastname(),
                customer.getFirstname(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getGender(),
                customer.getAddress()
        );
    }

    public Customer mapToCustomer(CustomerDTO customerDTO) {
        return new Customer(
                customerDTO.lastname(),
                customerDTO.firstname(),
                customerDTO.email(),
                customerDTO.phone(),
                customerDTO.address(),
                customerDTO.gender()
        );
    }
}
