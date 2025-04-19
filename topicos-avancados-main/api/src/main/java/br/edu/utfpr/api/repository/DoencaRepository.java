package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Doenca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoencaRepository extends JpaRepository<Doenca, Long> {
    
}
