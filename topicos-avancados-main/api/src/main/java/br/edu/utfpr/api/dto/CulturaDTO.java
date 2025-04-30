package br.edu.utfpr.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CulturaDTO {
    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @Min(value = 1, message = "Tempo de cultivo deve ser maior que zero")
    public int tempoCultivoDias;

    @NotBlank(message = "Época de plantio é obrigatório")
    public String epocaPlantio;
}
