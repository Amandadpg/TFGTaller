package com.daw.garage23.web.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.web.config.JwtUtils;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private com.daw.garage23.persistence.repositories.UsuarioRepository usuarioRepository; // Lo necesitamos para sacar los datos extras

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        // 1. Autenticamos
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginData.get("email"), loginData.get("password"))
        );

        // 2. IMPORTANTE: El principal ahora es un UserDetails de Spring
        org.springframework.security.core.userdetails.UserDetails userDetails = 
            (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
        
        // 3. Buscamos tu entidad Usuario para sacar el ID, Nombre y Rol
        Usuario user = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error fatal: Usuario no encontrado tras autenticar"));

        // 4. Generamos los tokens (Usando userDetails que es lo que espera el método de tu profe)
        String access = jwtUtils.generateAccessToken(userDetails);
        String refresh = jwtUtils.generateRefreshToken(userDetails);

        // 5. Devolvemos la respuesta
        return ResponseEntity.ok(Map.of(
            "accessToken", access,
            "refreshToken", refresh,
            "rol", user.getRol().name(),
            "userId", user.getId(),
            "nombre", user.getNombre()
        ));
    }
}