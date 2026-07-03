package com.minimarket;

import com.minimarket.repository.CategoriaRepository;
import com.minimarket.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de integración que levanta el contexto completo de Spring Boot,
 * incluyendo la conexión a la base de datos H2 en memoria.
 * Sirve como "smoke test" ideal para un pipeline de CI/CD.
 */
@SpringBootTest
class MinimarketApplicationTests {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    void contextLoads() {
        // Si el contexto de Spring no carga (por ejemplo, un error de configuración
        // de datasource/JPA), este test fallará automáticamente.
    }

    @Test
    void debeCargarDatosInicialesDesdeDataSql() {
        assertThat(categoriaRepository.findAll()).isNotEmpty();
        assertThat(productoRepository.findAll()).isNotEmpty();
    }
}
