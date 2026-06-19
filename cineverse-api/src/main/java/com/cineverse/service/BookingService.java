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
import java.util.UUID;
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

        String showTime = request.getShowTime();
        if (showTime == null || showTime.isBlank()) {
            showTime = "7:30 PM"; // fallback default
        }

        final String finalShowDate = showDate;
        final String finalShowTime = showTime;

        // Synchronized on a per-movie+date+time key to prevent race conditions
        synchronized (getBookingLock(movieId, finalShowDate, finalShowTime)) {
            // Check for already-booked seats for this movie on this date and time
            // We need to fetch by date. To be perfectly accurate we'd also filter by time.
            // But let's assume we fetch all bookings for the movie and filter them.
            List<Booking> existingBookings = bookingRepository.findByMovieIdAndShowDate(movieId, finalShowDate);
            
            List<String> bookedSeats = existingBookings.stream()
                    .filter(b -> finalShowTime.equals(b.getShowTime()))
                    .flatMap(b -> Arrays.stream(b.getSeats().split(",")))
                    .map(String::trim)
                    .collect(Collectors.toList());

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
            booking.setShowTime(finalShowTime);
            
            // Generate real transaction ID (uppercase UUID segment for realism)
            String transId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            booking.setTransactionId(transId);

            Booking savedBooking = bookingRepository.save(booking);

            // Generate PDF and send confirmation email
            com.cineverse.entity.Movie movie = movieRepository.findById(movieId).get();
            byte[] pdfBytes = pdfGenerationService.generateTicketPdf(savedBooking, movie);
            emailService.sendBookingConfirmation(userEmail, savedBooking, movie, pdfBytes);

            return savedBooking;
        }
    }

    /**
     * Returns a flat list of all booked seat labels for a movie on a given date and time.
     * e.g. ["A1", "A2", "B5", "C3"]
     */
    public List<String> getBookedSeatsForMovie(Long movieId, String showDate, String showTime) {
        List<Booking> bookings = bookingRepository.findByMovieIdAndShowDate(movieId, showDate);
        return bookings.stream()
                .filter(b -> showTime.equals(b.getShowTime()))
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

    // ── Lock management for per-movie+date+time synchronization ──
    private static final java.util.concurrent.ConcurrentHashMap<String, Object> LOCKS =
            new java.util.concurrent.ConcurrentHashMap<>();

    private Object getBookingLock(Long movieId, String showDate, String showTime) {
        String key = movieId + ":" + showDate + ":" + showTime;
        return LOCKS.computeIfAbsent(key, k -> new Object());
    }
}
