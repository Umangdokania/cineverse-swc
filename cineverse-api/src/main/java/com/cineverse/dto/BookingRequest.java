package com.cineverse.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long movieId;
    private List<String> seats;
    private String showDate;
    private String showTime;
}
