package com.minimarket.service;

import com.minimarket.dto.VentaRequest;
import com.minimarket.entity.Producto;
import com.minimarket.entity.Venta;
import com.minimarket.exception.ResourceNotFoundException;
import com.minimarket.exception.StockInsuficienteException;
import com.minimarket.repository.ProductoRepository;
import com.minimarket.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public List<Venta> listarTodas() {
        return ventaRepository.findAll();
    }

    public Venta obtenerPorId(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));
    }

    @Transactional
    public Venta registrarVenta(VentaRequest request) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto no encontrado con id: " + request.getProductoId()));

        if (producto.getStock() < request.getCantidad()) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para el producto '" + producto.getNombre() +
                            "'. Disponible: " + producto.getStock() + ", solicitado: " + request.getCantidad());
        }

        BigDecimal total = producto.getPrecio().multiply(BigDecimal.valueOf(request.getCantidad()));

        producto.setStock(producto.getStock() - request.getCantidad());
        productoRepository.save(producto);

        Venta venta = new Venta();
        venta.setProducto(producto);
        venta.setCantidad(request.getCantidad());
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());

        return ventaRepository.save(venta);
    }
}
