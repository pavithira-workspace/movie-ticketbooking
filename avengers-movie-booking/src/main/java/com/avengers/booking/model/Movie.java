package com.avengers.booking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    private String id;
    private String title;
    private String category;
    private double rating;
    private String genre;
    private String duration;
    private int price;
    private String poster;
    private String accent;
    private String synopsis;
}
