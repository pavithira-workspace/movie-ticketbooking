package com.avengers.booking.service;

import com.avengers.booking.model.Booking;
import com.avengers.booking.model.BookingRequest;
import com.avengers.booking.model.Movie;
import com.avengers.booking.repository.BookingRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {
    private static final List<String> THEATRES = List.of(
            "PVR ICON · Phoenix Palladium · Mumbai",
            "INOX Megaplex · Malad · Mumbai",
            "PVR IMAX · Koramangala · Bengaluru",
            "Cinepolis IMAX · Forum Mall · Hyderabad",
            "PVR Luxe · VR Chennai · Chennai",
            "INOX Insignia · South City · Kolkata",
            "PVR Superplex · Select Citywalk · New Delhi",
            "Cinepolis · Lulu Mall · Kochi");
    private static final List<String> SHOW_TIMES = List.of("10:30 AM", "1:45 PM", "5:15 PM", "8:30 PM");
    private static final Pattern SEAT_PATTERN = Pattern.compile("^[A-H][1-8]$");

    private final BookingRepository bookingRepository;
    private final MovieService movieService;

    public BookingService(BookingRepository bookingRepository, MovieService movieService) {
        this.bookingRepository = bookingRepository;
        this.movieService = movieService;
    }

    public List<String> getBookedSeats(String movieId, String theatre, LocalDate showDate, String showTime) {
        validateShow(movieId, theatre, showDate, showTime);
        Set<String> occupied = new HashSet<>(List.of("A4", "B7", "D2", "F6"));
        occupied.addAll(bookingRepository.findSeats(movieId, theatre, showDate.toString(), showTime));
        return occupied.stream().sorted().toList();
    }

    public synchronized Booking createBooking(BookingRequest request) {
        Movie movie = movieService.getMovie(request.getMovieId());
        validateShow(request.getMovieId(), request.getTheatre(), request.getShowDate(), request.getShowTime());
        if (request.getSeats() == null || request.getSeats().isEmpty() || request.getSeats().size() > 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose between 1 and 8 seats.");
        }
        if (request.getSeats().stream().anyMatch(seat -> !SEAT_PATTERN.matcher(seat).matches())
                || new HashSet<>(request.getSeats()).size() != request.getSeats().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat selection is invalid.");
        }

        Set<String> occupied = new HashSet<>(getBookedSeats(
                request.getMovieId(), request.getTheatre(), request.getShowDate(), request.getShowTime()));
        if (request.getSeats().stream().anyMatch(occupied::contains)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more selected seats are no longer available.");
        }

        List<String> seats = request.getSeats().stream().sorted().toList();
        return bookingRepository.save(new Booking(
                "CIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                movie.getId(), movie.getTitle(), request.getTheatre(), request.getShowDate(),
                request.getShowTime(), seats, movie.getPrice(), movie.getPrice() * seats.size(), LocalDateTime.now()));
    }

    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBooking(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
    }

    private void validateShow(String movieId, String theatre, LocalDate showDate, String showTime) {
        movieService.getMovie(movieId);
        if (!THEATRES.contains(theatre)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid theatre.");
        }
        if (showDate == null || showDate.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid upcoming date.");
        }
        if (!SHOW_TIMES.contains(showTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid showtime.");
        }
    }
}
