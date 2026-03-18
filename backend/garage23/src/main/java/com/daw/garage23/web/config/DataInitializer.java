package com.daw.garage23.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.enums.Rol;
import com.daw.garage23.persistence.repositories.UsuarioRepository;

@Component // Importante: @Component para que Spring lo detecte como un bean ejecutable
public class DataInitializer implements CommandLineRunner { // IMPORTANTE: implements CommandLineRunner
	
	@Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override // Anotación necesaria
    public void run(String... args) {
        try {
            // Solo creamos el admin si la tabla está vacía o el email no existe
            if (!usuarioRepository.existsByEmail("admin@garage.com")) {
                System.out.println("--- INICIANDO CARGA DE DATOS ---");

                // 1. CREAR EL ADMIN
                Usuario admin = new Usuario();
                admin.setNombre("Admin");
                admin.setApellidos("Taller");
                admin.setDni("00000000Z");
                admin.setEmail("admin@garage.com");
                admin.setTelefono("600000000");
                admin.setDireccion("Calle Taller 1");
                
                String passPlano = "Admin123";
                admin.setContrasena(passwordEncoder.encode(passPlano)); 
                admin.setRol(Rol.ADMIN);
                
                usuarioRepository.save(admin);
                System.out.println("✅ ADMIN CREADO. Email: admin@garage.com | Pass: " + passPlano);
                System.out.println("Contraseña encriptada en BD: " + admin.getContrasena());

                System.out.println("--- CARGA FINALIZADA CON ÉXITO ---");
            }
        } catch (Exception e) {
            System.err.println("❌ ERROR EN DATA INITIALIZER: " + e.getMessage());
            e.printStackTrace();
        }
    }
}