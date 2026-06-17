package com.cineverse.service;

import com.cineverse.entity.Theatre;
import com.cineverse.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    public Theatre getTheatreById(Long id) {
        return theatreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Theatre not found with id: " + id));
    }

    public Theatre createTheatre(Theatre theatre) {
        return theatreRepository.save(theatre);
    }
}
