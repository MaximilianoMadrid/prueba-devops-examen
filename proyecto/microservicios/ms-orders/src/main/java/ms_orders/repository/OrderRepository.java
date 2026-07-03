package ms_orders.repository;

import ms_orders.entity.Order;
import ms_orders.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByEmail(String email);
    List<Order> findByEstado(OrderStatus estado);
    List<Order> findByCanal(String canal);
}