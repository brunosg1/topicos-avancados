package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Propriedade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropriedadeRepository extends JpaRepository<Propriedade, Long> {
    
}
