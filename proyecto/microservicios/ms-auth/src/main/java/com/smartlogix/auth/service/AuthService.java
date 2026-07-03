package com.smartlogix.auth.service;

import com.smartlogix.auth.dto.RegisterRequest;
import com.smartlogix.auth.entity.User;
import com.smartlogix.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request){

        User user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol("USER")
                .build();

        repository.save(user);
    }
}