package com.avengers.booking.controller;

import com.avengers.booking.model.Movie;
import com.avengers.booking.service.MovieService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getMovies() {
        return movieService.getMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable("id") String id) {
        return movieService.getMovie(id);
    }
}
