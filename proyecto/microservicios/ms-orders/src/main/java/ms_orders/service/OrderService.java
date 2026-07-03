package ms_orders.service;

import ms_orders.dto.OrderRequest;
import ms_orders.dto.OrderResponse;
import ms_orders.entity.Order;
import ms_orders.enums.OrderStatus;
import ms_orders.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderResponse createOrder(OrderRequest request) {
        Order order = Order.builder()
                .email(request.getEmail())
                .nombreProducto(request.getNombreProducto())
                .cantidad(request.getCantidad())
                .precioTotal(request.getPrecioTotal())
                .canal(request.getCanal())
                .estado(OrderStatus.PENDIENTE)
                .build();

        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));
        return toResponse(order);
    }

    public OrderResponse updateStatus(Long id, OrderStatus nuevoEstado) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));
        order.setEstado(nuevoEstado);
        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getOrdersByStatus(OrderStatus estado) {
    return orderRepository.findByEstado(estado)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado con id: " + id);
        }
        orderRepository.deleteById(id);
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder() 
                .id(order.getId())
                .email(order.getEmail())
                .nombreProducto(order.getNombreProducto())
                .cantidad(order.getCantidad())
                .precioTotal(order.getPrecioTotal())
                .estado(order.getEstado())
                .canal(order.getCanal())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}