package br.edu.utfpr.api.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_pragas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Praga extends BaseEntity {
    @Column(name= "nome", nullable = false, length = 100)
    public String nome;

    @Column(name= "nome_cientifico", nullable = false, length = 100)
    public String nomeCientifico;


    @OneToMany
    @JoinColumn(name = "cultura_id")
    public List<Cultura> culturasAfetadas;

    @Column(name= "descricao", nullable = false, length = 100)
    public String descricao;
}
