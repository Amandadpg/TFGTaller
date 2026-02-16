package com.daw.garage23.web.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.enums.Rol;
import com.daw.garage23.persistence.repositories.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UsuarioRepository usuarioRepository) {
        return args -> {

            if (!usuarioRepository.existsByEmail("admin@garage.com")) {

                Usuario admin = new Usuario();
                admin.setNombre("Admin");
                admin.setApellidos("Principal");
                admin.setDni("00000000A");
                admin.setEmail("admin@garage.com");
                admin.setTelefono("600000000");
                admin.setDireccion("Oficina Central");
                admin.setContrasena("Admin123");
                admin.setRol(Rol.ADMIN);

                usuarioRepository.save(admin);

                System.out.println("ADMIN creado correctamente");
            }
        };
    }
}
