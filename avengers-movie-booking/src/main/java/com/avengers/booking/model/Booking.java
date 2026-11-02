package com.avengers.booking.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private String bookingId;
    private String movieId;
    private String movieTitle;
    private String theatre;
    private LocalDate showDate;
    private String showTime;
    private List<String> seats;
    private int ticketPrice;
    private int totalAmount;
    private LocalDateTime bookedAt;
}
