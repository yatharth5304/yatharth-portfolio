package com.jsp.portfolio.service;

import com.jsp.portfolio.entity.Principle;
import com.jsp.portfolio.repository.PrincipleRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrincipleService {

    private final PrincipleRepository repo;

    public PrincipleService(PrincipleRepository repo) {
        this.repo = repo;
    }

    public List<Principle> getAllPrinciples() {
        return repo.findAllByOrderByDisplayOrderAsc();
    }
}
