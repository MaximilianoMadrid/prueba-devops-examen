package ms_orders.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // @Value no se inyecta fuera del contexto de Spring, se setea a mano
        ReflectionTestUtils.setField(jwtService, "secret",
                "smartlogix-clave-super-secreta-para-secretear-2026");
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L);
    }

    @Test
    void debeGenerarTokenValido() {
        String token = jwtService.generateToken("cliente@test.com");

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void debeExtraerEmailDelToken() {
        String token = jwtService.generateToken("cliente@test.com");

        String email = jwtService.extractEmail(token);

        assertEquals("cliente@test.com", email);
    }

    @Test
    void debeValidarTokenCorrecto() {
        String token = jwtService.generateToken("cliente@test.com");

        boolean valido = jwtService.isTokenValid(token, "cliente@test.com");

        assertTrue(valido);
    }

    @Test
    void debeRechazarTokenConEmailDistinto() {
        String token = jwtService.generateToken("cliente@test.com");

        boolean valido = jwtService.isTokenValid(token, "otro@test.com");

        assertFalse(valido);
    }

    @Test
    void debeRechazarTokenMalformado() {
        boolean valido = jwtService.isTokenValid("token-invalido-123", "cliente@test.com");

        assertFalse(valido);
    }
}