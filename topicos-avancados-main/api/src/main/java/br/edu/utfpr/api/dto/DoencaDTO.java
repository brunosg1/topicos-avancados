package br.edu.utfpr.api.dto;

import java.util.List;

import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DoencaDTO{
   
    public Long id;

    @NotBlank(message = "Nome é obrigatório")
    public String nome;
    
    @NotBlank(message = "Sintomas obrigatórios")
    public String sintomas;

    @Size(min = 1, message = "A lista de culturas deve ter pelo menos um item")    
    @ManyToMany
    public List<Long> culturasAfetadas;

    @NotBlank(message = "Tratamentos obrigatórios")
    public String tratamentos;
}
