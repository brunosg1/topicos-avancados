package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Praga;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PragaRepository extends JpaRepository<Praga, Long> {
    @Query("SELECT d FROM Praga d LEFT JOIN FETCH d.culturasAfetadas WHERE d.nome LIKE %:nome%")
    List<Praga> findByNomeIgnoreCaseWithCulturas(@Param("nome") String nome);

    @Query("SELECT d FROM Praga d LEFT JOIN FETCH d.culturasAfetadas")
    List<Praga> findAllWithCulturas();

    @Query("SELECT d FROM Praga d LEFT JOIN FETCH d.culturasAfetadas WHERE d.id = :id")
    List<Praga> findByIDWithCulturas(@Param("id") Long id);
}
