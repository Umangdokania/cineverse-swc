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
        if (movieRepository.count() >= 20) return;

        // If there are less than 20, we clear and reseed for this mock project
        movieRepository.deleteAll();

        String tmdbBaseUrl = "https://image.tmdb.org/t/p/w500";

        movieRepository.save(createMovie("Inception", "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "Sci-Fi", 8.8, 2010, 148, tmdbBaseUrl + "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"));
        movieRepository.save(createMovie("The Dark Knight", "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", "Action", 9.0, 2008, 152, tmdbBaseUrl + "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"));
        movieRepository.save(createMovie("Interstellar", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "Sci-Fi", 8.6, 2014, 169, tmdbBaseUrl + "/gEU2QlsUUQZnKxXosNxA5G2x22.jpg"));
        movieRepository.save(createMovie("Parasite", "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", "Thriller", 8.6, 2019, 132, tmdbBaseUrl + "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"));
        movieRepository.save(createMovie("Oppenheimer", "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", "Drama", 8.3, 2023, 180, tmdbBaseUrl + "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"));
        movieRepository.save(createMovie("Dune: Part Two", "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.", "Sci-Fi", 8.5, 2024, 166, tmdbBaseUrl + "/1pdfLvkbY9ohJlCjQH2JGjjc91p.jpg"));
        movieRepository.save(createMovie("The Godfather", "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", "Crime", 9.2, 1972, 175, tmdbBaseUrl + "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"));
        movieRepository.save(createMovie("Pulp Fiction", "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", "Crime", 8.9, 1994, 154, tmdbBaseUrl + "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"));
        movieRepository.save(createMovie("Forrest Gump", "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other history unfold through the perspective of an Alabama man with an IQ of 75.", "Drama", 8.8, 1994, 142, tmdbBaseUrl + "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"));
        movieRepository.save(createMovie("The Matrix", "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", "Sci-Fi", 8.7, 1999, 136, tmdbBaseUrl + "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"));
        movieRepository.save(createMovie("Fight Club", "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", "Drama", 8.8, 1999, 139, tmdbBaseUrl + "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"));
        movieRepository.save(createMovie("Goodfellas", "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.", "Crime", 8.7, 1990, 145, tmdbBaseUrl + "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"));
        movieRepository.save(createMovie("Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.", "Animation", 8.6, 2023, 140, tmdbBaseUrl + "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"));
        movieRepository.save(createMovie("Spirited Away", "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", "Animation", 8.6, 2001, 125, tmdbBaseUrl + "/39wmItIWsg5sZMyRUHLkQlX1HOST.jpg"));
        movieRepository.save(createMovie("Gladiator", "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", "Action", 8.5, 2000, 155, tmdbBaseUrl + "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"));
        movieRepository.save(createMovie("Avengers: Endgame", "After the devastating events of Infinity War, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.", "Action", 8.4, 2019, 181, tmdbBaseUrl + "/or06DP3rTepeXXfH3Q9G1pI0nEq.jpg"));
        movieRepository.save(createMovie("The Lion King", "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.", "Animation", 8.5, 1994, 88, tmdbBaseUrl + "/sKCr78AS8o612513f5BvRQ2G9sC.jpg"));
        movieRepository.save(createMovie("Jurassic Park", "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.", "Adventure", 8.2, 1993, 127, tmdbBaseUrl + "/oU7Oq2kFAAlGqbB4LSupw4A2L18.jpg"));
        movieRepository.save(createMovie("The Silence of the Lambs", "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.", "Thriller", 8.6, 1991, 118, tmdbBaseUrl + "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"));
        movieRepository.save(createMovie("Avatar", "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.", "Sci-Fi", 7.9, 2009, 162, tmdbBaseUrl + "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg"));
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
