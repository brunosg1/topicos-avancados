package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Cultura;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CulturaRepository extends JpaRepository<Cultura, Long> {
}
