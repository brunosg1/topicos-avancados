package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Praga;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PragaRepository extends JpaRepository<Praga, Long> {
    
}
