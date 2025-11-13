package com.frankenstein.story;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FrankensteinApplication {

    public static void main(String[] args) {
        SpringApplication.run(FrankensteinApplication.class, args);
    }
}
