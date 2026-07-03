package ms_orders.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank(message = "El email del cliente es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombreProducto;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima es 1")
    private Integer cantidad;

    @NotNull(message = "El precio total es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private Double precioTotal;

    @NotBlank(message = "El canal es obligatorio")
    private String canal;
}