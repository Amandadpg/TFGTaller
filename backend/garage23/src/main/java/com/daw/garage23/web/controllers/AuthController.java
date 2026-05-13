package com.daw.garage23.web.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.enums.Rol;
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

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginData.get("email"), loginData.get("password"))
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        
        Usuario user = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error fatal: Usuario no encontrado tras autenticar"));

        String access = jwtUtils.generateAccessToken(userDetails);
        String refresh = jwtUtils.generateRefreshToken(userDetails);

        return ResponseEntity.ok(Map.of(
            "accessToken", access,
            "refreshToken", refresh,
            "rol", user.getRol().name(),
            "userId", user.getId(),
            "nombre", user.getNombre()
        ));
    }
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        
        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
        }

        nuevoUsuario.setContrasena(passwordEncoder.encode(nuevoUsuario.getContrasena()));
        
        nuevoUsuario.setRol(Rol.CLIENTE);

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado con éxito"));
    }
}