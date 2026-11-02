package com.avengers.booking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PageController {
    @GetMapping({"/", "/movies"})
    public String home() {
        return "index";
    }

    @GetMapping("/booking")
    public String booking(@RequestParam(name = "movieId", required = false) String movieId, Model model) {
        model.addAttribute("selectedMovieId", movieId == null ? "" : movieId);
        return "index";
    }

    @GetMapping("/confirmation")
    public String confirmation() {
        return "index";
    }
}
