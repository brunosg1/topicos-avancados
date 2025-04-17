package br.edu.utfpr.api.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_doencas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Doenca extends BaseEntity {
    @Column(name= "nome", nullable = false, length = 100)
    public String nome;

    @Column(name= "sintomas", nullable = false, length = 100)
    public String sintomas;

    @OneToMany
    @JoinColumn(name = "cultura_id")
    public List<Cultura> culturasAfetadas;

    @Column(name= "tratamentos", nullable = false, length = 100)
    public String tratamentos;
}
