package com.oceanview.backend.service;

import com.oceanview.backend.config.Roles;
import com.oceanview.backend.model.Admin;
import com.oceanview.backend.model.User;
import com.oceanview.backend.repository.AdminRepository;
import com.oceanview.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Check admins collection - return actual role (ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST)
        var adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            String dbRole = admin.getRole() != null ? admin.getRole().toUpperCase() : Roles.ADMIN;
            String authority = switch (dbRole) {
                case Roles.MANAGER -> Roles.ROLE_MANAGER;
                case Roles.RECEPTIONIST -> Roles.ROLE_RECEPTIONIST;
                default -> Roles.ROLE_ADMIN;
            };
            Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authority));
            return new org.springframework.security.core.userdetails.User(
                    admin.getUsername(),
                    admin.getPasswordHash(),
                    authorities
            );
        }

        // 2. Check users collection (customers)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username: " + username)
                );

        Collection<? extends GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}
