package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name="users")
@Setter @Getter
public class ApplicationUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @Column(unique = true)
    private String username;
    private String password;
    private String fullName;

    @Column(unique = true)
    private String email;
    private String phone;
    private String avatarURL;
    private Boolean enabled = true;
    private Boolean blocked = false;
    private Date createdDate;
    private Date changedPasswordDate;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "User_Role",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<Role> authorities;

    @OneToMany(mappedBy = "issuer", cascade = CascadeType.ALL)
    private List<Order> orders;


    public ApplicationUser() {
        super();
        this.authorities = new HashSet<Role>();
    }

    public ApplicationUser(String username, String password, Set<Role> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.createdDate = this.getDate();
        this.changedPasswordDate = this.getDate();
    }

    public ApplicationUser(String username, String fullName, String password, Set<Role> authorities, String email, String phone) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.createdDate = this.getDate();
        this.changedPasswordDate = this.getDate();
    }

    private Date getDate() {
        Calendar calendar = Calendar.getInstance();
        return calendar.getTime();
    }

    @Override
    public Set<Role> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
