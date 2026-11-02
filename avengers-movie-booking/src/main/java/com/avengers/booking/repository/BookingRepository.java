package com.avengers.booking.repository;

import com.avengers.booking.model.Booking;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;

@Repository
public class BookingRepository {
    private final ConcurrentMap<String, Booking> bookings = new ConcurrentHashMap<>();

    public Booking save(Booking booking) {
        bookings.put(booking.getBookingId(), booking);
        return booking;
    }

    public Optional<Booking> findById(String bookingId) {
        return Optional.ofNullable(bookings.get(bookingId));
    }

    public List<Booking> findAll() {
        return bookings.values().stream()
                .sorted(Comparator.comparing(Booking::getBookedAt).reversed())
                .toList();
    }

    public List<String> findSeats(String movieId, String theatre, String showDate, String showTime) {
        return bookings.values().stream()
                .filter(booking -> booking.getMovieId().equals(movieId)
                        && booking.getTheatre().equals(theatre)
                        && booking.getShowDate().toString().equals(showDate)
                        && booking.getShowTime().equals(showTime))
                .flatMap(booking -> booking.getSeats().stream())
                .toList();
    }
}
