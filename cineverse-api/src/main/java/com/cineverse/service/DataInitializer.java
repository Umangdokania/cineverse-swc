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
        if (movieRepository.count() >= 10) return;

        // If there are less than 10, we clear and reseed for this mock project
        movieRepository.deleteAll();

        String tmdbBaseUrl = "https://image.tmdb.org/t/p/w500";

        movieRepository.save(createMovie("Kalki 2898 AD", "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.", "Action/Sci-Fi", 8.2, 2024, 181, tmdbBaseUrl + "/qR2eM9wU1D3vG4bC61w6I2I6h4n.jpg"));
        movieRepository.save(createMovie("Deadpool & Wolverine", "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.", "Action/Comedy", 8.5, 2024, 127, tmdbBaseUrl + "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"));
        movieRepository.save(createMovie("Inside Out 2", "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up.", "Animation", 8.0, 2024, 96, tmdbBaseUrl + "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg"));
        movieRepository.save(createMovie("Despicable Me 4", "Gru and Lucy and their girls — Margo, Edith and Agnes — welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad.", "Animation", 7.5, 2024, 95, tmdbBaseUrl + "/3w84hCFJATpiCO5g8hpdWKAkK5D.jpg"));
        movieRepository.save(createMovie("A Quiet Place: Day One", "Experience the day the world went quiet. As New York City is invaded by alien creatures who hunt by sound, a woman named Sam fights to survive.", "Horror/Sci-Fi", 7.6, 2024, 100, tmdbBaseUrl + "/hU42CRk14JuPEdqbG3hL4y32lT9.jpg"));
        movieRepository.save(createMovie("Kill", "During a train journey to New Delhi, a pair of commandos face off against an army of invading bandits.", "Action/Thriller", 8.0, 2024, 115, tmdbBaseUrl + "/jXUpxxWeaVPRR42o3g2B0xKqQk4.jpg"));
        movieRepository.save(createMovie("Twisters", "As storm season intensifies, the paths of former storm chaser Kate Cooper, lured back to the open plains after a devastating encounter years prior, and reckless social-media superstar Tyler Owens collide when terrifying phenomena never seen before are unleashed.", "Action/Thriller", 7.8, 2024, 122, tmdbBaseUrl + "/pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg"));
        movieRepository.save(createMovie("Bad Newz", "A quirky comedy about a chaotic pregnancy resulting in a rare medical case involving two fathers.", "Comedy", 7.4, 2024, 140, tmdbBaseUrl + "/8xZ1yOaP2E8w0gLz3U9tFjQ7h4Y.jpg"));
        movieRepository.save(createMovie("Longlegs", "FBI Agent Lee Harker is assigned to an unsolved serial killer case that takes unexpected turns, revealing evidence of the occult.", "Horror", 7.9, 2024, 101, tmdbBaseUrl + "/5aj8vVGFqiG8bQdY8Kk7I1I3vR1.jpg"));
        movieRepository.save(createMovie("Alien: Romulus", "While scavenging the deep ends of a derelict space station, a group of young space colonizers face face-to-face with the most terrifying life form in the universe.", "Sci-Fi/Horror", 8.1, 2024, 119, tmdbBaseUrl + "/b33nnKl1GSFbao4l3fZtoqsG2vB.jpg"));
    }

    @org.springframework.lang.NonNull
    private Movie createMovie(String title, String description, String genre, double rating, int year, int duration, String imageUrl) {
        Movie m = new Movie();
        m.setTitle(title);
        m.setDescription(description);
        m.setGenre(genre);
        m.setRating(rating);
        m.setReleaseYear(year);
        m.setDurationMinutes(duration);
        m.setImageUrl(imageUrl);
        return m;
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
