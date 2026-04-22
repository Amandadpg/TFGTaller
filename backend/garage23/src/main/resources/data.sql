INSERT INTO `usuario` (`nombre`, `apellidos`, `dni`, `telefono`, `email`, `direccion`, `contrasena`, `rol`) VALUES
('Alejandro', 'García Ruiz', '12345678A', '600111222', 'alex@email.com', 'Calle Mayor 1', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Beatriz', 'Sanz Martín', '23456789B', '600333444', 'bea@email.com', 'Av. Constitución 45', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Cristian', 'López Vega', '34567890C', '600555666', 'cris@email.com', 'Paseo del Prado 12', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Daniela', 'Hidalgo Porras', '45678901D', '600777888', 'dani@email.com', 'Calle Real 8', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Eduardo', 'Gómez Ferrero', '56789012E', '600999000', 'edu@email.com', 'Calle Luna 3', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Fátima', 'Blanco Soler', '67890123F', '611222333', 'fati@email.com', 'Av. de Europa 90', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Gonzalo', 'Méndez Castro', '78901234G', '622333444', 'gon@email.com', 'Calle Estrecha 2', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Helena', 'Ortega Cano', '89012345H', '633444555', 'hele@email.com', 'Plaza de España 15', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Iván', 'Torres Quevedo', '90123456I', '644555666', 'ivan@email.com', 'Calle del Pez 22', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Julia', 'Navarro Gil', '01234567J', '655666777', 'julia@email.com', 'Calle Nueva 5', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Kevin', 'Parrado Diez', '11223344K', '666777888', 'kevin@email.com', 'Calle Sol 44', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'),
('Laura', 'Vidal Moreno', '22334455L', '677888999', 'laura@email.com', 'Av. Mediterráneo 7', '$2a$10$zYm8S7P8v3I.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV.vV', 'CLIENTE'); 

INSERT INTO `vehiculo` (`matricula`, `marca`, `modelo`, `tipo`, `id_usuario`) VALUES
('2345-BBC', 'Volkswagen', 'Golf GTI', 'COCHE', 2),
('6789-DFG', 'Ford', 'Focus RS', 'COCHE', 3),
('1122-HHH', 'Yamaha', 'MT-07', 'MOTO', 4),
('4433-JKL', 'Mercedes', 'Actros', 'CAMION', 5),
('5566-MNP', 'Renault', 'Clio Sport', 'COCHE', 6),
('7788-QRS', 'Peugeot', '3008', 'COCHE', 7),
('9911-TUV', 'Kawasaki', 'Z900', 'MOTO', 8),
('2244-WXY', 'Scania', 'R500', 'CAMION', 9),
('3355-ZZA', 'Honda', 'Civic Type R', 'COCHE', 10),
('6677-BBD', 'Mazda', 'CX-5', 'COCHE', 11),
('8899-CCF', 'Tesla', 'Model 3', 'COCHE', 12),
('1010-DDG', 'Fiat', '500 Abarth', 'COCHE', 13);

INSERT INTO `servicio` (`nombre_servicio`, `descripcion`, `precio`, `duracion_minutos`) VALUES
('Revisión Estándar', 'Revisión completa en Taller Principal', 85.50, 90),
('Carga Aire A/C', 'Recarga de gas en Box 1', 60.00, 45),
('Frenos Delanteros', 'Cambio de pastillas en Box 2', 110.00, 120),
('Diagnosis OBD2', 'Escaneo de fallos en Zona Electrónica', 35.00, 30),
('Pulido Faros', 'Restauración en Zona Estética', 50.00, 75),
('Cambio Aceite', 'Sintético 5W30 en Taller Principal', 70.00, 40),
('Neumáticos (2)', 'Montaje y equilibrado en Box Neumáticos', 180.00, 60),
('Limpieza Inyectores', 'Tratamiento químico en Zona Motor', 95.00, 150),
('Batería Nueva', 'Sustitución en Taller Principal', 115.00, 20),
('Alineación', 'Ajuste de dirección en Box 3', 55.00, 50),
('ITV Previa', 'Revisión pre-inspección en Taller Principal', 40.00, 60),
('Lavado VIP', 'Limpieza integral en Zona Estética', 65.00, 90);


INSERT INTO `cita` (`fecha`, `hora`, `id_servicio`, `id_vehiculo`, `estado`) VALUES
('2026-05-10', '09:00:00', 1, 1, 'PENDIENTE'),
('2026-05-10', '11:30:00', 2, 1, 'PENDIENTE'),
('2026-05-11', '10:00:00', 3, 2, 'COMPLETADA'),
('2026-05-11', '12:00:00', 4, 3, 'PENDIENTE'),
('2026-05-12', '08:30:00', 5, 4, 'CANCELADA'),
('2026-05-12', '13:00:00', 6, 4, 'PENDIENTE'),
('2026-05-13', '10:30:00', 7, 5, 'PENDIENTE'),
('2026-05-13', '16:00:00', 8, 6, 'COMPLETADA'),
('2026-05-14', '09:15:00', 9, 7, 'PENDIENTE'),
('2026-05-14', '11:45:00', 10, 8, 'PENDIENTE'),
('2026-05-15', '10:00:00', 11, 9, 'PENDIENTE'),
('2026-05-15', '12:30:00', 12, 9, 'COMPLETADA');


-- Creamos un usuario de prueba si no existe
INSERT INTO usuario (nombre, apellidos, email, contrasena, dni, rol) 
VALUES ('Fernando', 'Alonso', 'magic@nana.com', '1234', '14141414A', 'CLIENTE');

-- Creamos su coche (asumiendo que el ID del usuario anterior es el que corresponda, ej: 14)
-- Ajusta el id_usuario según lo que veas en tu tabla de usuarios
INSERT INTO vehiculo (marca, modelo, matricula, id_usuario) 
VALUES ('Aston Martin', 'AMR23', '0014-FA', (SELECT id FROM usuario WHERE dni = '14141414A'));
-- Cita para HOY (8 de Abril)
INSERT INTO cita (fecha, hora, id_servicio, id_vehiculo, estado) 
VALUES (CURDATE(), '10:30:00', 1, (SELECT id FROM vehiculo WHERE matricula = '0014-FA'), 'PENDIENTE');

-- Cita para MAÑANA (9 de Abril)
INSERT INTO cita (fecha, hora, id_servicio, id_vehiculo, estado) 
VALUES (DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:00:00', 2, (SELECT id FROM vehiculo WHERE matricula = '0014-FA'), 'PENDIENTE');

-- Cita para PASADO MAÑANA (10 de Abril)
INSERT INTO cita (fecha, hora, id_servicio, id_vehiculo, estado) 
VALUES (DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', 1, (SELECT id FROM vehiculo WHERE matricula = '0014-FA'), 'PENDIENTE');