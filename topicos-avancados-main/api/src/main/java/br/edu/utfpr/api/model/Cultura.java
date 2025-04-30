package br.edu.utfpr.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_culturas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Cultura extends BaseEntity {
    @NotBlank(message = "Nome é obrigatório")
    @Column(name= "nome", nullable = false, length = 100)
    private String nome;
    
    @Min(value = 1, message = "Tempo de cultivo em dias é obrigatório")
    @Column(name= "tempo_cultivo_dias", nullable = false, length = 100)
    private int tempoCultivoDias;
    
    @NotBlank(message = "Época de plantio é obrigatória")
    @Column(name= "epoca_plantio", nullable = false, length = 100)
    private String epocaPlantio;
}
