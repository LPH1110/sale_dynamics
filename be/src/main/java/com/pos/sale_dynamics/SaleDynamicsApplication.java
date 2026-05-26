package com.pos.sale_dynamics;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.repository.CategoryRepository;
import com.pos.sale_dynamics.repository.OrderStatusRepository;
import com.pos.sale_dynamics.repository.RoleRepository;
import com.pos.sale_dynamics.repository.UserRepository;
import com.pos.sale_dynamics.service.AuthenticationService.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class SaleDynamicsApplication implements CommandLineRunner {
	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private OrderStatusRepository orderStatusRepository;



	@Override
	public void run(String... args) throws Exception {
		// INIT ROLES
		Role adminRole = roleRepository.findByAuthority("ADMIN")
				.orElseGet(() -> roleRepository.save(new Role("ADMIN")));

		if (roleRepository.findByAuthority("USER").isEmpty()) {
			roleRepository.save(new Role("USER"));
		}

		// INIT ADMIN ACCOUNT
		if(userRepository.findByUsername("admin").isEmpty()) {
			ApplicationUser user = authenticationService.registerUser("admin", "admin");
			user.getAuthorities().add(adminRole);
			user.setFullName("Le Phu Hao");
			user.setPhone("0935572755");
			userRepository.save(user);
		}

		// INIT CATEGORIES
		List<Category> categories = new ArrayList<>();
		categories.add(new Category("shoes"));
		categories.add(new Category("electronics"));
		categories.add(new Category("kitchen"));
		categories.add(new Category("clothe"));
		categories.add(new Category("default"));

		categories.forEach(category -> {
			if (categoryRepository.findByName(category.getName()).isEmpty()) {
				categoryRepository.save(category);
			}
		});

		// INIT ORDER STATUSES
		List<OrderStatus> statuses = new ArrayList<>();
		statuses.add(new OrderStatus("In progress")); // Not confirm
		statuses.add(new OrderStatus("Partial paid")); // Customer only doesn't pay enough
		statuses.add(new OrderStatus("Paid"));

		statuses.forEach(status -> {
			if (orderStatusRepository.findByTitle(status.getTitle()).isEmpty()) {
				orderStatusRepository.save(status);
			}
		});
	}

	public static void main(String[] args) {
		SpringApplication.run(SaleDynamicsApplication.class, args);
	}




}
