package com.smartlogix.auth.service;

import com.smartlogix.auth.dto.RegisterRequest;
import com.smartlogix.auth.entity.User;
import com.smartlogix.auth.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void debeGuardarUsuario() {

    RegisterRequest request = new RegisterRequest();

    request.setNombre("Max");
    request.setEmail("max@test.com");
    request.setContrasena("123456");

    when(passwordEncoder.encode("123456"))
            .thenReturn("hash123");

    authService.register(request);

    verify(repository).save(any(User.class));
    }

    @Test
    void debeEncriptarContrasenaAntesDeGuardar() {

    RegisterRequest request = new RegisterRequest();

    request.setNombre("Max");
    request.setEmail("max@test.com");
    request.setContrasena("123456");

    when(passwordEncoder.encode("123456"))
            .thenReturn("hash123");

    authService.register(request);

    ArgumentCaptor<User> captor =
            ArgumentCaptor.forClass(User.class);

    verify(repository).save(captor.capture());

    User usuarioGuardado = captor.getValue();

    assertEquals(
            "hash123",
            usuarioGuardado.getContrasena()
        );
    }
}
