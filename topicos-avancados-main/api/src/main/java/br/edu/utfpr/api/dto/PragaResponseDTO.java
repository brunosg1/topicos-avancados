package br.edu.utfpr.api.dto;

import java.util.List;

import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Praga;
import jakarta.transaction.Transactional;

@Transactional
public class PragaResponseDTO {
    public long id;
    public String nome;
    public String nomeCientifico;
    public String descricao;
    public List<String> culturasAfetadas; // nomes apenas

    public PragaResponseDTO(Praga d) {
        this.id = d.getId();
        this.nome = d.getNome();
        this.nomeCientifico = d.getNomeCientifico();
        this.descricao = d.getDescricao();

        d.getCulturasAfetadas().size(); // Força a inicialização da coleção

        this.culturasAfetadas = d.getCulturasAfetadas()
                                  .stream()
                                  .map(Cultura::getNome)
                                  .toList();
    }
}
