package br.edu.utfpr.api.dto;

import java.util.List;

import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Praga;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Transactional
public class PragaResponseDTO {
    public long id;

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "Nome cientifico é obrigatório")
    public String nomeCientifico;

    @NotBlank(message = "Descrição é obrigatório")
    public String descricao;

    @Size(min = 1, message = "A lista de culturas deve ter pelo menos um item")    
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
