package com.cineverse.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "theatres")
@Data
public class Theatre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "contact_email")
    private String contactEmail;
}
