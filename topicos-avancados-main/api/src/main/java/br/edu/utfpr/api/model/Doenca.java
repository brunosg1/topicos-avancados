package br.edu.utfpr.api.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_doencas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString

public class Doenca extends BaseEntity {

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "sintomas", nullable = false, length = 100)
    private String sintomas;

    @ManyToMany
    @JoinTable(
        name = "doenca_cultura",
        joinColumns = @JoinColumn(name = "doenca_id"),
        inverseJoinColumns = @JoinColumn(name = "cultura_id")
    )
    private List<Cultura> culturasAfetadas;

    @Column(name = "tratamentos", nullable = false, length = 100)
    private String tratamentos;
}
