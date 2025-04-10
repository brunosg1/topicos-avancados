package br.edu.utfpr.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.utfpr.api.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    public Pessoa findByEmail(String nome);
}
