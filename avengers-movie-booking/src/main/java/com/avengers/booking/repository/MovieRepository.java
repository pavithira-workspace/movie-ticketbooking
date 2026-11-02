package com.avengers.booking.repository;

import com.avengers.booking.model.Movie;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class MovieRepository {
    private final List<Movie> movies = List.of(
            new Movie("endgame", "Avengers: Endgame", "superhero", 8.4, "Action · Sci-Fi", "3h 1m", 320,
                    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=85",
                    "#d8a84e", "After the devastating events of Infinity War, the remaining heroes assemble for one final stand."),
            new Movie("infinity-war", "Avengers: Infinity War", "superhero", 8.4, "Action · Adventure", "2h 29m", 300,
                    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=85",
                    "#a76bff", "The Avengers and their allies face a threat unlike any the universe has ever known."),
            new Movie("the-avengers", "The Avengers", "superhero", 8.0, "Action · Sci-Fi", "2h 23m", 280,
                    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=85",
                    "#5bbcff", "Earth's mightiest heroes unite for the first time to protect the world."),
            new Movie("age-of-ultron", "Avengers: Age of Ultron", "superhero", 7.3, "Action · Adventure", "2h 21m", 260,
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85",
                    "#ff6d57", "The team faces a dangerous new enemy born from a plan to protect humanity."),
            new Movie("iron-man", "Iron Man", "superhero", 7.9, "Action · Sci-Fi", "2h 6m", 250,
                    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85",
                    "#ff5656", "A brilliant inventor builds a powerful suit and discovers what it means to be a hero."),
            new Movie("civil-war", "Captain America: Civil War", "superhero", 7.8, "Action · Drama", "2h 27m", 280,
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85",
                    "#5bbcff", "The heroes are divided by a new accord, turning allies into opposing sides."),
            new Movie("rrr", "RRR", "indian", 7.8, "Telugu · Action · Period", "3h 7m", 280,
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85",
                    "#e85e3f", "An epic Telugu-language action drama celebrated for its scale and spectacular set pieces."),
            new Movie("baahubali", "Baahubali: The Beginning", "indian", 8.0, "Telugu · Action · Fantasy", "2h 39m", 260,
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85",
                    "#d8a84e", "A sweeping Indian fantasy adventure filled with grand landscapes and legendary battles."),
            new Movie("jawan", "Jawan", "indian", 6.9, "Hindi · Action · Thriller", "2h 49m", 250,
                    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=85",
                    "#cb4051", "A high-energy Hindi action thriller with an ensemble cast and larger-than-life spectacle."),
            new Movie("kgf-chapter-2", "K.G.F: Chapter 2", "indian", 8.2, "Kannada · Action · Crime", "2h 48m", 270,
                    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85",
                    "#daa444", "A Kannada-language action drama set against a vast world of power and ambition."),
            new Movie("kalki-2898-ad", "Kalki 2898 AD", "indian", 7.0, "Telugu · Sci-Fi · Action", "3h 1m", 320,
                    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=85",
                    "#797bdb", "A futuristic Indian sci-fi adventure blending mythology, technology and a distant future."),
            new Movie("pushpa", "Pushpa: The Rise", "indian", 7.6, "Telugu · Action · Drama", "2h 59m", 250,
                    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=85",
                    "#6da36e", "A Telugu-language action drama about ambition, identity and a rise against the odds.")
    );

    public List<Movie> findAll() {
        return movies;
    }

    public Optional<Movie> findById(String id) {
        return movies.stream().filter(movie -> movie.getId().equals(id)).findFirst();
    }
}
