package com.ridvankarsli.blog.blogbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // "/uploads/**" url'sine gelen istekleri projenin kök dizinindeki "uploads" klasörüne yönlendir
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}