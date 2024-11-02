---
date: '2024-08-14'
draft: false
logo: images/client-logo/googleresearch.jpg
title: Google TimesFM – Contribución de código abierto

---
> Contribuciones de código abierto en GitHub al proyecto "TimesFM" de Google Research.


{{< image title="Google TimesFM – Contribución de código abierto" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/googleresearch.jpg" alt="texto alternativo" >}}

https://github.com/google-research/timesfm

https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/

## Resumen del Proyecto: Mejorando el Proyecto TimesFM de Google Research con CI/CD y Python Poetry

Contribución de código abierto: Integración Continua/Entrega Continua (CI/CD) y Gestión de Dependencias para TimesFM

{{< youtube e3koi4ph_es >}}

### Descripción del Proyecto:

TimesFM es un modelo de pronóstico avanzado desarrollado por Google Research, pre-entrenado en un vasto corpus de 100 mil millones de puntos temporales del mundo real. Ofrece un impresionante rendimiento de cero ejemplos en varios puntos de referencia públicos de múltiples dominios y granularidades. Este modelo destaca en la predicción de series temporales, lo cual es crucial en industrias como la venta al por menor, las finanzas, la fabricación, la atención médica y las ciencias naturales. TimesFM tiene un impacto especialmente significativo en la venta al por menor, ya que la previsión precisa de la demanda puede reducir significativamente los costos de inventario e impulsar los ingresos.

A pesar de su sólido rendimiento, TimesFM enfrentaba desafíos comunes a muchos modelos de aprendizaje profundo (DL): la necesidad de extensos ciclos de entrenamiento y validación antes del despliegue. Para abordar esto, TimesFM se diseñó como un modelo de base que ofrece fuertes capacidades de pronóstico fuera de la caja en nuevos datos de series temporales sin entrenamiento adicional. Esto permite a los usuarios implementar y refinar rápidamente las predicciones para tareas específicas, como la planificación de la demanda en la venta al por menor.


### Mis Contribuciones:

Para mejorar aún más la usabilidad y accesibilidad de TimesFM, contribuí al proyecto implementando una canalización de Integración Continua/Entrega Continua (CI/CD) usando GitHub Actions e integrando Python Poetry para la gestión de dependencias y el empaquetado. Estas contribuciones tenían como objetivo simplificar el proceso de instalación y optimizar los flujos de trabajo de desarrollo.

### Mejoras Clave:

#### Canalización CI/CD con GitHub Actions:

- **Automatización**: Automatizó los procesos de prueba, compilación y despliegue, asegurando que cualquier cambio en el código base se verifique a través de un flujo de trabajo consistente y confiable.
- **Aseguramiento de la Calidad**: Mejoró la calidad del código ejecutando pruebas automatizadas en cada solicitud de incorporación de cambios, detectando problemas temprano en el ciclo de desarrollo.
- **Despliegue**: Optimizó el proceso de despliegue, permitiendo actualizaciones más rápidas y confiables del modelo TimesFM.

#### Integración de Python Poetry:

- **Instalación Simplificada**: Permitió a los usuarios instalar TimesFM más fácilmente con un solo comando (`pip install timesfm`), reduciendo la fricción para nuevos usuarios y desarrolladores.
- **Gestión de Dependencias**: Mejoró la gestión de dependencias utilizando Poetry, que maneja las dependencias de paquetes de manera más eficiente y asegura que se usen las versiones correctas.
- **Reproducibilidad**: Mejoró la reproducibilidad del entorno de desarrollo, facilitando a los colaboradores configurar y mantener sus entornos de desarrollo.

### Impacto de las Contribuciones:

- **Facilidad de Uso**: Redujo la barrera de entrada para nuevos usuarios y colaboradores, facilitando el inicio con TimesFM.
- **Mejora de la Productividad**: Al automatizar tareas rutinarias y asegurar un entorno de desarrollo consistente, los desarrolladores pueden concentrarse más en la innovación y menos en la configuración y el mantenimiento.
- **Colaboración Mejorada**: La canalización CI/CD automatizada fomenta un proceso de desarrollo más colaborativo y eficiente, donde los cambios de código se integran y prueban continuamente.

### Acerca de TimesFM:

TimesFM representa un avance significativo en la predicción de series temporales. Es mucho más pequeño que los últimos modelos lingüísticos grandes (200M de parámetros) y, sin embargo, alcanza un rendimiento casi de vanguardia en una variedad de conjuntos de datos no vistos. Esto lo convierte en una herramienta poderosa para industrias que dependen de predicciones precisas de series temporales.

Para obtener más información y acceder al modelo, visita los repositorios HuggingFace y GitHub.

### Conclusión:

Mis contribuciones al proyecto TimesFM han mejorado significativamente su usabilidad y eficiencia de desarrollo. Al implementar una canalización CI/CD e integrar Python Poetry, he ayudado a optimizar los flujos de trabajo y a hacer que el modelo sea más accesible para usuarios y desarrolladores. Estas mejoras respaldan el éxito continuo de TimesFM al proporcionar capacidades robustas de pronóstico de cero ejemplos en diversos dominios.
