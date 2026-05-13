
INSERT INTO usuario (nombre, apellidos, dni, telefono, email, direccion, contrasena, rol) VALUES
('Roberto', 'Jiménez García', '55555555F', '655555555', 'roberto.j@gmail.com', 'Calle Mayor 12', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Sofía', 'Ruiz Martínez', '66666666G', '666666666', 'sofia.ruiz@outlook.es', 'Av. Constitución 4', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Fernando', 'Alonso Díaz', '14141414F', '614141414', 'magic.alonso@gmail.com', 'Circuito Asturias 33', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Lucía', 'Fernández Sanz', '77777777H', '677777777', 'lucia.fer@yahoo.es', 'Calle Luna 45', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Marcos', 'Torres Leal', '88888888I', '688888888', 'marcos.t@hotmail.com', 'Calle Estrecha 2', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Paula', 'Vázquez Oro', '99999999J', '699999999', 'paula.vaz@gmail.com', 'Paseo Marítimo 10', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Alejandro', 'Sánchez Poo', '10101010K', '610101010', 'alex.san@gmail.com', 'Calle Nueva 1', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Marta', 'Calvo Soler', '20202020L', '620202020', 'marta.c@icloud.com', 'Calle Alta 5', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Javier', 'Gómez Noya', '30303030M', '630303030', 'javi.g@gmail.com', 'Av. De los Deportes 8', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Beatriz', 'Pascual Rey', '40404040N', '640404040', 'bea.p@outlook.com', 'Calle Silencio 14', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Ignacio', 'López Portillo', '50505050P', '650505050', 'nacho.l@gmail.com', 'Calle Principal 100', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Raquel', 'Méndez Alba', '60606060Q', '660606060', 'raquel.m@gmail.com', 'Calle Jardines 3', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Hugo', 'Silva Rojo', '70707070R', '670707070', 'hugo.silva@cine.es', 'Plaza Mayor 5', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Sara', 'Carbonero Aranda', '80808080S', '680808080', 'sara.c@periodismo.es', 'Calle Radio 22', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Adrián', 'Lastra Cano', '90909090T', '690909090', 'adrian.l@gmail.com', 'Calle Teatro 9', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Carmen', 'Machi Pozo', '12121212V', '612121212', 'carmen.m@gmail.com', 'Calle Comedia 1', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Luis', 'Tosar López', '13131313W', '613131313', 'luis.tosar@galicia.es', 'Calle Celda 211', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Blanca', 'Suárez Leyva', '15151515X', '615151515', 'blanca.s@actriz.es', 'Calle Barco 4', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE'),
('Mario', 'Casas Sierra', '16161616Y', '616161616', 'mario.c@gmail.com', 'Calle Tres Metros 3', 'lJqD5aELlxjCNKjf0a1dlwbe73iyzYdesh+qeRh07UA=', 'CLIENTE');

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

INSERT INTO servicio (nombre_servicio, descripcion, precio, duracion_minutos) VALUES
('Lubricación Alta Gama', 'Aceite y filtro respetando especificaciones del fabricante.', 95.00, 60),
('Optimización de Contacto', 'Cambio de neumáticos, alineación y calibración exacta.', 40.00, 90),
('Lavado Integral', 'Reacondicionamiento profundo interior/exterior.', 120.00, 180),
('Recogida y Entrega VIP', 'Servicio puerta a puerta con máxima seguridad y discreción.', 25.00, 30),
('Tratamiento Cerámico', 'Protección de pintura de concurso con recubrimiento cerámico.', 350.00, 360),
('Diagnosis Electrónica Premium', 'Lectura avanzada de centralita y telemetría de rendimiento.', 75.00, 45),
('Frenos Alto Rendimiento', 'Sustitución de pastillas y purgado de líquido deportivo.', 210.00, 120);


INSERT INTO cita (id, fecha, hora, estado, id_servicio, id_vehiculo) VALUES
-- 14 de Mayo
(1, '2026-05-14', '09:00:00', 'COMPLETADA', 2, 1),
(2, '2026-05-14', '10:00:00', 'COMPLETADA', 4, 3),
(3, '2026-05-14', '11:30:00', 'CANCELADA', 6, 2),
(4, '2026-05-14', '16:00:00', 'PENDIENTE', 1, 4),

-- 15 de Mayo
(5, '2026-05-15', '09:30:00', 'PENDIENTE', 5, 3), 
(6, '2026-05-15', '15:00:00', 'PENDIENTE', 7, 1),
(7, '2026-05-15', '16:00:00', 'CANCELADA', 3, 5),

-- 18 de Mayo (Lunes)
(8, '2026-05-18', '09:00:00', 'PENDIENTE', 1, 1),
(9, '2026-05-18', '11:00:00', 'PENDIENTE', 2, 2),
(10, '2026-05-18', '16:30:00', 'PENDIENTE', 6, 3),

-- 20 de Mayo
(11, '2026-05-20', '09:30:00', 'PENDIENTE', 4, 1),
(12, '2026-05-20', '12:00:00', 'PENDIENTE', 5, 4),

-- 22 de Mayo (Viernes)
(13, '2026-05-22', '09:00:00', 'PENDIENTE', 1, 5),
(14, '2026-05-22', '10:30:00', 'PENDIENTE', 2, 4),
(15, '2026-05-22', '11:30:00', 'CANCELADA', 7, 1),

-- 24 de Mayo
(16, '2026-05-24', '11:00:00', 'PENDIENTE', 6, 3),
(17, '2026-05-24', '12:00:00', 'PENDIENTE', 3, 2);


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