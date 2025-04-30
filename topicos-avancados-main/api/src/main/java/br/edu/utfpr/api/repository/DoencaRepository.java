package br.edu.utfpr.api.repository;

import br.edu.utfpr.api.model.Doenca;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoencaRepository extends JpaRepository<Doenca, Long> {
    @Query("SELECT d FROM Doenca d LEFT JOIN FETCH d.culturasAfetadas WHERE d.nome LIKE %:nome%")
    List<Doenca> findByNomeIgnoreCaseWithCulturas(@Param("nome") String nome);

    @Query("SELECT d FROM Doenca d LEFT JOIN FETCH d.culturasAfetadas")
    List<Doenca> findAllWithCulturas();

    @Query("SELECT d FROM Doenca d LEFT JOIN FETCH d.culturasAfetadas WHERE d.id = :id")
    List<Doenca> findByIDWithCulturas(@Param("id") Long id);
}
