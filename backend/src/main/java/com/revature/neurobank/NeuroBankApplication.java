package com.revature.neurobank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NeuroBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(NeuroBankApplication.class, args);
	}

}
