package com.cineverse.service;

import com.cineverse.dto.RegisterRequest;
import com.cineverse.entity.User;
import com.cineverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.USER);
        
        User savedUser = userRepository.save(user);
        
        // Send welcome email with raw password
        emailService.sendWelcomeEmail(request.getEmail(), request.getName(), request.getPassword());
        
        return savedUser;
    }
}
