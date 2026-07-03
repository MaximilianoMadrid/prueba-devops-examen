package ms_orders.controller;

import ms_orders.dto.OrderRequest;
import ms_orders.dto.OrderResponse;
import ms_orders.enums.OrderStatus;
import ms_orders.service.OrderService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private OrderResponse buildResponse() {
        return OrderResponse.builder()
                .id(1L)
                .email("cliente@test.com")
                .nombreProducto("Notebook")
                .cantidad(2)
                .precioTotal(2000.0)
                .estado(OrderStatus.PENDIENTE)
                .canal("SHOPIFY")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void debeCrearPedido() {

        OrderRequest request = new OrderRequest();
        request.setEmail("cliente@test.com");
        request.setNombreProducto("Notebook");
        request.setCantidad(2);
        request.setPrecioTotal(2000.0);
        request.setCanal("SHOPIFY");

        when(orderService.createOrder(request))
                .thenReturn(buildResponse());

        ResponseEntity<OrderResponse> response =
                orderController.create(request);

        assertNotNull(response.getBody());
        assertEquals(200, response.getStatusCode().value());
        assertEquals("cliente@test.com", response.getBody().getEmail());
        assertEquals(OrderStatus.PENDIENTE, response.getBody().getEstado());

        verify(orderService).createOrder(request);
    }

    @Test
    void debeListarTodosLosPedidos() {

        when(orderService.getAllOrders())
                .thenReturn(List.of(buildResponse()));

        ResponseEntity<List<OrderResponse>> response =
                orderController.getAll();

        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Notebook", response.getBody().get(0).getNombreProducto());

        verify(orderService).getAllOrders();
    }

    @Test
    void debeBuscarPedidoPorId() {

        when(orderService.getOrderById(1L))
                .thenReturn(buildResponse());

        ResponseEntity<OrderResponse> response =
                orderController.getById(1L);

        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());

        verify(orderService).getOrderById(1L);
    }

    @Test
    void debeBuscarPedidosPorEstado() {

        when(orderService.getOrdersByStatus(OrderStatus.PENDIENTE))
                .thenReturn(List.of(buildResponse()));

        ResponseEntity<List<OrderResponse>> response =
                orderController.getByStatus(OrderStatus.PENDIENTE);

        assertNotNull(response.getBody());
        assertEquals(OrderStatus.PENDIENTE, response.getBody().get(0).getEstado());

        verify(orderService).getOrdersByStatus(OrderStatus.PENDIENTE);
    }

    @Test
    void debeActualizarEstadoDelPedido() {

        OrderResponse actualizado = buildResponse();
        actualizado.setEstado(OrderStatus.ENVIADO);

        when(orderService.updateStatus(1L, OrderStatus.ENVIADO))
                .thenReturn(actualizado);

        ResponseEntity<OrderResponse> response =
                orderController.updateStatus(1L, OrderStatus.ENVIADO);

        assertNotNull(response.getBody());
        assertEquals(OrderStatus.ENVIADO, response.getBody().getEstado());

        verify(orderService).updateStatus(1L, OrderStatus.ENVIADO);
    }

    @Test
    void debeEliminarPedido() {

        doNothing().when(orderService).deleteOrder(1L);

        ResponseEntity<Void> response =
                orderController.delete(1L);

        assertEquals(204, response.getStatusCode().value());

        verify(orderService).deleteOrder(1L);
    }
}