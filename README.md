# Nicatours - Sistema de Transporte Turístico

Una aplicación web para gestionar servicios de transporte turístico en Nicaragua con una van de 13 pasajeros.

## Características

- **Autenticación Segura**: Sistema de login con JWT y hash de contraseñas
- **Calculadora de Precios**: Herramienta para calcular costos de viajes basados en:
  - Kilómetros totales
  - Precio actual del diésel
  - Margen de ganancia personalizable
  - Cálculo automático de mantenimiento (20% del combustible)
- **Diseño Responsive**: Optimizado para móviles y escritorio
- **Colores Patrióticos**: Paleta basada en los colores de la bandera de Nicaragua

## Tecnologías

- **Frontend**: Next.js 14 con React y TypeScript
- **Styling**: Tailwind CSS con SCSS
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con bcrypt
- **Deployment**: Optimizado para Vercel

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
   
4. Configurar la base de datos PostgreSQL y ejecutar:
   ```sql
   -- Ver archivo database-setup.sql
   ```

5. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```

## Uso

### Credenciales por defecto:
- **Usuario**: admin
- **Contraseña**: admin123

### Calculadora de Precios:
1. Ingresar kilómetros totales del viaje
2. Ingresar precio actual del diésel en córdobas
3. Seleccionar margen de ganancia (10%-100%)
4. El sistema calculará automáticamente:
   - Consumo de combustible (10.2 L/km)
   - Costo total de combustible
   - Costo de mantenimiento (20%)
   - Ganancia neta
   - **Precio total recomendado**

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/          # Endpoint de autenticación
│   ├── calculadora/       # Página calculadora de precios
│   ├── login/            # Página de login
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
```

## Deployment en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Deploy automático

## Licencia

Nicatours © 2024
