package com.jsp.portfolio.service;

import com.jsp.portfolio.entity.Stat;
import com.jsp.portfolio.repository.StatRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StatService {

    private final StatRepository repo;

    public StatService(StatRepository repo) {
        this.repo = repo;
    }

    public List<Stat> getAllStats() {
        return repo.findAllByOrderByDisplayOrderAsc();
    }
}
