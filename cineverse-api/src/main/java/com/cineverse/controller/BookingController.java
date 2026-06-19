package com.cineverse.controller;

import com.cineverse.dto.BookingRequest;
import com.cineverse.entity.Booking;
import com.cineverse.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * POST /bookings — Create a new booking.
     * Requires a valid JWT token. The authenticated user's email is
     * extracted from the Spring Security context automatically.
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request,
                                            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }
        try {
            String userEmail = authentication.getName();
            Booking booking = bookingService.createBooking(request, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /bookings/seats/{movieId}?showDate=2026-06-19&showTime=7:30%20PM
     * Returns a flat list of booked seat labels for a movie on a given date and time.
     * This is the endpoint the frontend polls for real-time seat availability.
     * Public endpoint — no authentication required.
     */
    @GetMapping("/seats/{movieId}")
    public ResponseEntity<List<String>> getBookedSeats(
            @PathVariable Long movieId,
            @RequestParam(required = false) String showDate,
            @RequestParam(required = false) String showTime) {
        if (showDate == null || showDate.isBlank()) {
            showDate = LocalDate.now().toString();
        }
        if (showTime == null || showTime.isBlank()) {
            showTime = "7:30 PM";
        }
        List<String> bookedSeats = bookingService.getBookedSeatsForMovie(movieId, showDate, showTime);
        return ResponseEntity.ok(bookedSeats);
    }

    /**
     * GET /bookings/my — Get all bookings for the currently authenticated user.
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }
        String userEmail = authentication.getName();
        List<Booking> bookings = bookingService.getBookingsForUser(userEmail);
        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /bookings/movie/{movieId} — Get all bookings for a movie (public, for seat availability).
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Booking>> getBookingsForMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(bookingService.getBookingsForMovie(movieId));
    }
}
