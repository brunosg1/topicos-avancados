package br.edu.utfpr.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
    @Column(name= "nome", nullable = false, length = 100)
    private String nome;

    @Column(name= "tempo_cultivo_dias", nullable = false, length = 100)
    private int tempo_cultivo_dias;

    @Column(name= "epoca_plantio", nullable = false, length = 100)
    private String epoca_plantio;
}
