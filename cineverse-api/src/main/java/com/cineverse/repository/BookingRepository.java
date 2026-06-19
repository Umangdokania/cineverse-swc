package com.cineverse.repository;

import com.cineverse.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByMovieId(Long movieId);
    List<Booking> findByMovieIdAndShowDate(Long movieId, String showDate);
}
