package com.cineverse.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @NotBlank
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    /** Comma-separated seat labels, e.g. "S1,S3,S5" */
    @NotBlank
    @Column(nullable = false)
    private String seats;

    @Column(name = "booked_at", nullable = false)
    private LocalDateTime bookedAt;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    /** The date of the show, e.g. "2026-06-19" */
    @Column(name = "show_date", nullable = false)
    private String showDate;

    /** The time of the show, e.g. "7:30 PM" */
    @Column(name = "show_time")
    private String showTime = "7:30 PM"; // Default value for existing backwards compatibility

    @Column(name = "transaction_id")
    private String transactionId;

    @PrePersist
    protected void onCreate() {
        bookedAt = LocalDateTime.now();
    }
}
