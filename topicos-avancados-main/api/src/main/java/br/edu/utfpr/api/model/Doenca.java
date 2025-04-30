package br.edu.utfpr.api.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_doencas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString

public class Doenca extends BaseEntity {

    @NotBlank(message = "Nome obrigatório")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "Sintomas obrigatórios")
    @Column(name = "sintomas", nullable = false, length = 100)
    private String sintomas;

    @Size(min = 1, message = "A lista de culturas deve ter pelo menos um item")    @ManyToMany
    @JoinTable(
        name = "doenca_cultura",
        joinColumns = @JoinColumn(name = "doenca_id"),
        inverseJoinColumns = @JoinColumn(name = "cultura_id")
    )
    private List<Cultura> culturasAfetadas;

    @NotBlank(message = "Tratamentos obrigatórios")
    @Column(name = "tratamentos", nullable = false, length = 100)
    private String tratamentos;
}
