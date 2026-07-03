package ms_orders.service;

import ms_orders.dto.OrderRequest;
import ms_orders.dto.OrderResponse;
import ms_orders.entity.Order;
import ms_orders.enums.OrderStatus;
import ms_orders.repository.OrderRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void debeCrearPedido() {

    OrderRequest request = new OrderRequest();

    request.setEmail("cliente@test.com");
    request.setNombreProducto("Notebook");
    request.setCantidad(2);
    request.setPrecioTotal(2000.0);
    request.setCanal("SHOPIFY");

    Order pedidoGuardado = Order.builder()
            .id(1L)
            .email("cliente@test.com")
            .nombreProducto("Notebook")
            .cantidad(2)
            .precioTotal(2000.0)
            .estado(OrderStatus.PENDIENTE)
            .canal("SHOPIFY")
            .build();

    when(orderRepository.save(any(Order.class)))
            .thenReturn(pedidoGuardado);

    OrderResponse response =
            orderService.createOrder(request);

    assertNotNull(response);

    assertEquals(1L, response.getId());

    assertEquals(
            "cliente@test.com",
            response.getEmail()
    );

    assertEquals(
            OrderStatus.PENDIENTE,
            response.getEstado()
    );

    verify(orderRepository)
            .save(any(Order.class));
    }

    @Test
    void debeBuscarPedidoPorId() {

    Order pedido = Order.builder()
            .id(1L)
            .email("cliente@test.com")
            .nombreProducto("Notebook")
            .cantidad(2)
            .precioTotal(2000.0)
            .estado(OrderStatus.PENDIENTE)
            .canal("SHOPIFY")
            .build();

    when(orderRepository.findById(1L))
            .thenReturn(Optional.of(pedido));

    OrderResponse response =
            orderService.getOrderById(1L);

    assertNotNull(response);

    assertEquals(
            1L,
            response.getId()
    );

    assertEquals(
            "Notebook",
            response.getNombreProducto()
    );

    assertEquals(
            OrderStatus.PENDIENTE,
            response.getEstado()
    );

    verify(orderRepository)
            .findById(1L);
    }

    @Test
    void debeActualizarEstadoPedido() {

    Order pedido = Order.builder()
            .id(1L)
            .email("cliente@test.com")
            .nombreProducto("Notebook")
            .cantidad(2)
            .precioTotal(2000.0)
            .estado(OrderStatus.PENDIENTE)
            .canal("SHOPIFY")
            .build();

    when(orderRepository.findById(1L))
            .thenReturn(Optional.of(pedido));

    when(orderRepository.save(any(Order.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    OrderResponse response =
            orderService.updateStatus(1L, OrderStatus.ENTREGADO);

    assertEquals(
            OrderStatus.ENTREGADO,
            response.getEstado()
    );

    verify(orderRepository).findById(1L);
    verify(orderRepository).save(any(Order.class));
    }

    @Test
    void debeEliminarPedido() {

    when(orderRepository.existsById(1L))
            .thenReturn(true);

    orderService.deleteOrder(1L);

    verify(orderRepository)
            .deleteById(1L);
    }

    @Test
    void debeBuscarPedidosPorEstado() {

    Order pedido = Order.builder()
            .id(1L)
            .email("cliente@test.com")
            .nombreProducto("Notebook")
            .cantidad(2)
            .precioTotal(2000.0)
            .estado(OrderStatus.PENDIENTE)
            .canal("SHOPIFY")
            .build();

    when(orderRepository.findByEstado(OrderStatus.PENDIENTE))
            .thenReturn(java.util.List.of(pedido));

    var resultado =
            orderService.getOrdersByStatus(OrderStatus.PENDIENTE);

    assertEquals(1, resultado.size());

    assertEquals(
            OrderStatus.PENDIENTE,
            resultado.get(0).getEstado()
    );

    verify(orderRepository)
            .findByEstado(OrderStatus.PENDIENTE);
    }

    @Test
    void debeLanzarExcepcionSiPedidoNoExiste() {

    when(orderRepository.findById(99L))
            .thenReturn(Optional.empty());

    RuntimeException exception =
            assertThrows(
                    RuntimeException.class,
                    () -> orderService.getOrderById(99L)
            );

    assertTrue(
            exception.getMessage()
                    .contains("Pedido no encontrado")
    );
    }
}