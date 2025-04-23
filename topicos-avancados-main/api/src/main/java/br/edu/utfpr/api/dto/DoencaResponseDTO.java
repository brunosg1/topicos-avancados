package br.edu.utfpr.api.dto;

import java.util.List;

import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Doenca;
import jakarta.transaction.Transactional;

@Transactional
public class DoencaResponseDTO {
    public long id;
    public String nome;
    public String sintomas;
    public List<String> culturasAfetadas; // nomes apenas
    public String tratamentos;

    public DoencaResponseDTO(Doenca d) {
        this.id = d.getId();
        this.nome = d.getNome();
        this.sintomas = d.getSintomas();
        this.tratamentos = d.getTratamentos();

        d.getCulturasAfetadas().size(); // Força a inicialização da coleção

        this.culturasAfetadas = d.getCulturasAfetadas()
                                  .stream()
                                  .map(Cultura::getNome)
                                  .toList();
    }
}
