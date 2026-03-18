-- SOLO SERVICIOS, VEHICULOS Y CITAS
INSERT INTO servicio (nombre_servicio, descripcion, precio, duracion_minutos) VALUES
('Cambio de aceite','Sustitucion de aceite y filtro',49.99,45),
... (todos los servicios)

INSERT INTO vehiculo (matricula, marca, modelo, tipo, id_usuario) VALUES
('1000AAA','Toyota','Corolla','COCHE',1), 
... (todos los vehículos, asegúrate que id_usuario sea 1 para todos si solo tienes al admin)

INSERT INTO cita (fecha, hora, estado, id_vehiculo, id_servicio) VALUES
('2026-03-01','09:00:00','PENDIENTE',1,1),
... (todas las citas)