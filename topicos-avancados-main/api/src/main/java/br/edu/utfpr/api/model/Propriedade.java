package br.edu.utfpr.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_propriedades")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Propriedade extends BaseEntity{
    @NotBlank(message = "Nome é obrigatório")
    @Column(name= "nome", nullable = false, length = 100)
    public String nome;

    @Positive(message = "Tamanho de hectares deve ser maior do que 0")
    @Column(name= "tamanho_ha", nullable = false, length = 100)
    public float tamanhoHa;

    @NotBlank(message = "Responsável é obrigatório")
    @Column(name= "responsavel", nullable = false, length = 100)
    public String responsavel;
}
