package com.cineverse.service;

import com.cineverse.entity.Movie;
import com.cineverse.entity.Theatre;
import com.cineverse.repository.MovieRepository;
import com.cineverse.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheatreRepository theatreRepository;

    @Override
    public void run(String... args) throws Exception {
        seedMovies();
        seedTheatres();
    }

    private void seedMovies() {
        if (movieRepository.count() > 0) return;

        Movie m1 = new Movie();
        m1.setTitle("Inception");
        m1.setDescription("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.");
        m1.setGenre("Sci-Fi");
        m1.setRating(8.8);
        m1.setReleaseYear(2010);
        m1.setDurationMinutes(148);

        Movie m2 = new Movie();
        m2.setTitle("The Dark Knight");
        m2.setDescription("When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.");
        m2.setGenre("Action");
        m2.setRating(9.0);
        m2.setReleaseYear(2008);
        m2.setDurationMinutes(152);

        Movie m3 = new Movie();
        m3.setTitle("Interstellar");
        m3.setDescription("A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.");
        m3.setGenre("Sci-Fi");
        m3.setRating(8.6);
        m3.setReleaseYear(2014);
        m3.setDurationMinutes(169);

        Movie m4 = new Movie();
        m4.setTitle("Parasite");
        m4.setDescription("Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.");
        m4.setGenre("Thriller");
        m4.setRating(8.6);
        m4.setReleaseYear(2019);
        m4.setDurationMinutes(132);

        Movie m5 = new Movie();
        m5.setTitle("Oppenheimer");
        m5.setDescription("The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.");
        m5.setGenre("Drama");
        m5.setRating(8.3);
        m5.setReleaseYear(2023);
        m5.setDurationMinutes(180);

        Movie m6 = new Movie();
        m6.setTitle("Dune: Part Two");
        m6.setDescription("Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.");
        m6.setGenre("Sci-Fi");
        m6.setRating(8.5);
        m6.setReleaseYear(2024);
        m6.setDurationMinutes(166);

        movieRepository.save(m1);
        movieRepository.save(m2);
        movieRepository.save(m3);
        movieRepository.save(m4);
        movieRepository.save(m5);
        movieRepository.save(m6);
    }

    private void seedTheatres() {
        if (theatreRepository.count() > 0) return;

        Theatre t1 = new Theatre();
        t1.setName("Cineverse IMAX - Mumbai");
        t1.setLocation("Bandra, Mumbai");
        t1.setTotalSeats(300);
        t1.setContactEmail("mumbai@cineverse.in");

        Theatre t2 = new Theatre();
        t2.setName("Cineverse Gold - Delhi");
        t2.setLocation("Connaught Place, New Delhi");
        t2.setTotalSeats(250);
        t2.setContactEmail("delhi@cineverse.in");

        Theatre t3 = new Theatre();
        t3.setName("Cineverse Premium - Bangalore");
        t3.setLocation("Indiranagar, Bangalore");
        t3.setTotalSeats(200);
        t3.setContactEmail("bangalore@cineverse.in");

        theatreRepository.save(t1);
        theatreRepository.save(t2);
        theatreRepository.save(t3);
    }
}
