package br.edu.utfpr.api.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PragaDTO {
    public Long id;

    
    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "Nome cientifico é obrigatório")
    public String nomeCientifico;

    @Size(min = 1, message = "A lista de culturas deve ter pelo menos um item")    
    public List<Long> culturasAfetadas;

    @NotBlank(message = "Descrição obrigatório")
    public String descricao;
}
