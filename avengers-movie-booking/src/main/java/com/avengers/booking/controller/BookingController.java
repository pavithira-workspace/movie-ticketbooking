package com.avengers.booking.controller;

import com.avengers.booking.model.Booking;
import com.avengers.booking.model.BookingRequest;
import com.avengers.booking.service.BookingService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/{bookingId}")
    public Booking getBooking(@PathVariable("bookingId") String bookingId) {
        return bookingService.getBooking(bookingId);
    }

    @GetMapping("/seats")
    public Map<String, List<String>> getBookedSeats(
            @RequestParam("movieId") String movieId,
            @RequestParam("theatre") String theatre,
            @RequestParam("showDate") LocalDate showDate,
            @RequestParam("showTime") String showTime) {
        return Map.of("bookedSeats", bookingService.getBookedSeats(movieId, theatre, showDate, showTime));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }
}
