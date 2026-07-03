package ms_orders.dto;

import ms_orders.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String email;
    private String nombreProducto;
    private Integer cantidad;
    private Double precioTotal;
    private OrderStatus estado;
    private String canal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
