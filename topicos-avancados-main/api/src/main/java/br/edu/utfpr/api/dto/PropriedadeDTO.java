package br.edu.utfpr.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class PropriedadeDTO {
    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @Positive(message = "Tamanho de hectares deve ser maior do que 0")
    public float tamanhoHa;

    @NotBlank(message = "Responsável é obrigatório")
    public String responsavel;
}
