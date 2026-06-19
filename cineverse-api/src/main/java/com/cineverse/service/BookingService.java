package com.cineverse.service;

import com.cineverse.dto.BookingRequest;
import com.cineverse.entity.Booking;
import com.cineverse.repository.BookingRepository;
import com.cineverse.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private EmailService emailService;

    /**
     * Create a booking with synchronized seat-conflict protection.
     * The synchronized block prevents two concurrent requests from
     * booking the same seat simultaneously.
     */
    public Booking createBooking(BookingRequest request, String userEmail) {
        if (request.getMovieId() == null) {
            throw new IllegalArgumentException("Movie ID cannot be null");
        }
        long movieId = request.getMovieId();

        // Validate the movie exists
        movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Movie not found with id: " + movieId));

        if (request.getSeats() == null || request.getSeats().isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }

        // Default to today if no showDate provided
        String showDate = request.getShowDate();
        if (showDate == null || showDate.isBlank()) {
            showDate = LocalDate.now().toString();
        }

        final String finalShowDate = showDate;

        // Synchronized on a per-movie+date key to prevent race conditions
        // while still allowing concurrent bookings for different movies
        synchronized (getBookingLock(movieId, finalShowDate)) {
            // Check for already-booked seats for this movie on this date
            List<String> bookedSeats = getBookedSeatsForMovie(movieId, finalShowDate);

            List<String> conflicting = request.getSeats().stream()
                    .filter(bookedSeats::contains)
                    .collect(Collectors.toList());

            if (!conflicting.isEmpty()) {
                throw new IllegalArgumentException(
                        "Seats already booked: " + String.join(", ", conflicting));
            }

            Booking booking = new Booking();
            booking.setMovieId(movieId);
            booking.setUserEmail(userEmail);
            booking.setSeats(String.join(",", request.getSeats()));
            booking.setTotalSeats(request.getSeats().size());
            booking.setShowDate(finalShowDate);

            Booking savedBooking = bookingRepository.save(booking);

            // Generate PDF and send confirmation email
            com.cineverse.entity.Movie movie = movieRepository.findById(movieId).get();
            byte[] pdfBytes = pdfGenerationService.generateTicketPdf(savedBooking, movie);
            emailService.sendBookingConfirmation(userEmail, savedBooking, movie, pdfBytes);

            return savedBooking;
        }
    }

    /**
     * Returns a flat list of all booked seat labels for a movie on a given date.
     * e.g. ["A1", "A2", "B5", "C3"]
     */
    public List<String> getBookedSeatsForMovie(Long movieId, String showDate) {
        List<Booking> bookings = bookingRepository.findByMovieIdAndShowDate(movieId, showDate);
        return bookings.stream()
                .flatMap(b -> Arrays.stream(b.getSeats().split(",")))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    public List<Booking> getBookingsForUser(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getBookingsForMovie(Long movieId) {
        return bookingRepository.findByMovieId(movieId);
    }

    // ── Lock management for per-movie+date synchronization ──
    private static final java.util.concurrent.ConcurrentHashMap<String, Object> LOCKS =
            new java.util.concurrent.ConcurrentHashMap<>();

    private Object getBookingLock(Long movieId, String showDate) {
        String key = movieId + ":" + showDate;
        return LOCKS.computeIfAbsent(key, k -> new Object());
    }
}
