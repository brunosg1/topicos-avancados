package br.edu.utfpr.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    @Column(name= "nome", nullable = false, length = 100)
    public String nome;

    @Column(name= "tamanho_ha", nullable = false, length = 100)
    public float tamanho_ha;

    @Column(name= "responsavel", nullable = false, length = 100)
    public String responsavel;
}
