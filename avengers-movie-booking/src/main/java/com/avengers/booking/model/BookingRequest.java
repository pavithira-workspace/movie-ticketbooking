package com.avengers.booking.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class BookingRequest {
    @NotBlank
    private String movieId;

    @NotBlank
    private String theatre;

    @NotNull
    private LocalDate showDate;

    @NotBlank
    private String showTime;

    @NotEmpty
    @Size(max = 8)
    private List<@NotBlank String> seats;
}
