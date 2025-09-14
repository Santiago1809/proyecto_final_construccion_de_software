package com.tdea.proyecto_final.construccion_de_software.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Servir archivos estáticos del frontend
    registry
        .addResourceHandler("/**")
        .addResourceLocations("classpath:/static/");
  }

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    // Redirigir todas las rutas no-API al index.html para SPA routing
    registry.addViewController("/").setViewName("forward:/index.html");
    registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
  }
}