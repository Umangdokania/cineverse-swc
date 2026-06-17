package com.cineverse.service;

import com.cineverse.dto.BookingRequest;
import com.cineverse.entity.Booking;
import com.cineverse.entity.Movie;
import com.cineverse.repository.BookingRepository;
import com.cineverse.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    public Booking createBooking(BookingRequest request, String userEmail) {
        // Validate the movie exists
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Movie not found with id: " + request.getMovieId()));

        if (request.getSeats() == null || request.getSeats().isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }

        // Check for already-booked seats for this movie
        List<Booking> existingBookings = bookingRepository.findByMovieId(request.getMovieId());
        List<String> bookedSeats = existingBookings.stream()
                .flatMap(b -> List.of(b.getSeats().split(",")).stream())
                .collect(Collectors.toList());

        List<String> conflicting = request.getSeats().stream()
                .filter(bookedSeats::contains)
                .collect(Collectors.toList());

        if (!conflicting.isEmpty()) {
            throw new IllegalArgumentException("Seats already booked: " + conflicting);
        }

        Booking booking = new Booking();
        booking.setMovieId(request.getMovieId());
        booking.setUserEmail(userEmail);
        booking.setSeats(String.join(",", request.getSeats()));
        booking.setTotalSeats(request.getSeats().size());

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsForUser(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getBookingsForMovie(Long movieId) {
        return bookingRepository.findByMovieId(movieId);
    }
}
