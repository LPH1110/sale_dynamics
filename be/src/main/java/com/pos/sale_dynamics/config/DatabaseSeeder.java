package com.pos.sale_dynamics.config;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Checking and seeding database...");

        // 1. Seed Roles and Admin User
        ApplicationUser adminUser = userRepository.findByUsername("admin").orElse(null);
        if (adminUser == null) {
            System.out.println("Seeding Admin User...");
            Role adminRole = roleRepository.findByAuthority("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));
            
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminUser = new ApplicationUser(
                    "admin", "System Administrator", passwordEncoder.encode("password"), 
                    adminRoles, "admin@example.com", "0000000000");
            adminUser = userRepository.save(adminUser);
        }

        // 2. Seed Categories and Products (for performance testing)
        List<Product> productsToSave = new ArrayList<>();
        if (productRepository.count() == 0) {
            System.out.println("Seeding Products...");
            List<Category> categories = categoryRepository.findAll();
            if (categories.isEmpty()) {
                categories = Arrays.asList(
                        new Category("Electronics"),
                        new Category("Clothing"),
                        new Category("Home & Garden"),
                        new Category("Sports"),
                        new Category("Toys")
                );
                categories = categoryRepository.saveAll(categories);
            }

            // Generating 200 dummy products
            for (int i = 1; i <= 200; i++) {
                Category cat = categories.get(i % categories.size());
                Product p = new Product(
                        "Test Product " + i,
                        "Detailed description for performance test product " + i,
                        "Test Provider " + (i % 5),
                        cat,
                        "Piece",
                        100 + (i * 5),
                        150 + (i * 5),
                        "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                        "BAR-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase()
                );
                
                Thumbnail dummyThumb = new Thumbnail("https://img.magnific.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80", "dummy-id-" + i);
                p.getThumbnails().add(dummyThumb);
                
                productsToSave.add(p);
            }
            productsToSave = productRepository.saveAll(productsToSave);
        } else {
            productsToSave = productRepository.findAll();
        }

        // 3. Seed Customers
        List<Customer> customersToSave = new ArrayList<>();
        if (customerRepository.count() == 0) {
            System.out.println("Seeding Customers...");
            // Generating 100 dummy customers
            for (int i = 1; i <= 100; i++) {
                Customer c = new Customer(
                        "Smith_" + i,
                        "John_" + i,
                        "customer" + i + "@example.com",
                        "555-000-" + String.format("%04d", i),
                        "123 Main St, Test City " + i,
                        i % 2 == 0 ? "Male" : "Female"
                );
                customersToSave.add(c);
            }
            customersToSave = customerRepository.saveAll(customersToSave);
        } else {
            customersToSave = customerRepository.findAll();
        }

        // 4. Seed Order Status and Orders
        if (orderRepository.count() == 0 && adminUser != null && !productsToSave.isEmpty() && !customersToSave.isEmpty()) {
            System.out.println("Seeding Orders...");
            List<OrderStatus> statuses = orderStatusRepository.findAll();
            if (statuses.isEmpty()) {
                OrderStatus pending = new OrderStatus("Pending");
                OrderStatus paid = new OrderStatus("Paid");
                OrderStatus cancelled = new OrderStatus("Cancelled");
                statuses = orderStatusRepository.saveAll(Arrays.asList(pending, paid, cancelled));
            }

            List<Order> ordersToSave = new ArrayList<>();
            Random rand = new Random();
            
            // Generating 300 dummy orders
            for (int i = 1; i <= 300; i++) {
                Customer customer = customersToSave.get(rand.nextInt(customersToSave.size()));
                OrderStatus status = statuses.get(rand.nextInt(statuses.size()));
                
                int total = 0;
                Order order = new Order("Performance Test Order " + i, 0, 0, 0, 0);
                order.setCustomer(customer);
                order.setIssuer(adminUser);
                order.setOrderStatus(status);
                
                // Add 1 to 5 items per order
                int numItems = rand.nextInt(5) + 1;
                for (int j = 0; j < numItems; j++) {
                    Product product = productsToSave.get(rand.nextInt(productsToSave.size()));
                    int quantity = rand.nextInt(3) + 1;
                    total += (product.getSalePrice() * quantity);
                    
                    OrderItem item = new OrderItem(order, product, quantity);
                    order.getOrderItems().add(item);
                }
                
                order.setTotal(total);
                if (status.getTitle().equalsIgnoreCase("Paid")) {
                    order.setReceived(total);
                    order.setConfirmed(true);
                } else {
                    order.setReceived(0);
                    order.setCustomerOwed(total);
                }
                
                ordersToSave.add(order);
            }
            orderRepository.saveAll(ordersToSave);
        }

        System.out.println("Database seeding completed.");
    }
}
